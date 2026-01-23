import { z } from 'zod';
import { publicProcedure, createTRPCRouter } from '../create-context';
import { supabaseAdmin } from '@/lib/supabase';
import { createBrandFetchClient } from '@/lib/brandfetch';
import OpenAI from 'openai';

const CompanyNameSchema = z.object({
  name: z.string(),
  type: z.string(),
  region: z.string(),
});

const CompanyNamesSchema = z.object({
  companies: z.array(CompanyNameSchema),
});

export const aiMarketUpdaterRouter = createTRPCRouter({
  generateAndSaveCompanies: publicProcedure
    .input(z.object({
      commodity: z.string(),
      commodityLabel: z.string(),
      commodityDescription: z.string(),
      companiesPerUpdate: z.number(),
    }))
    .mutation(async ({ input }) => {
      const { commodity, commodityLabel, commodityDescription, companiesPerUpdate } = input;

      if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'placeholder-key') {
        console.error('[AI Market Updater Backend] SUPABASE_SERVICE_ROLE_KEY not configured');
        return { 
          success: false, 
          added: 0, 
          error: 'Database admin access not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.' 
        };
      }

      const brandFetchClient = createBrandFetchClient();
      if (!brandFetchClient) {
        console.error('[AI Market Updater Backend] BrandFetch API key not configured');
        return { 
          success: false, 
          added: 0, 
          error: 'Data verification service not configured. Please contact support.' 
        };
      }

      console.log(`[AI Market Updater Backend] Using BrandFetch to find real companies for ${commodityLabel}`);

      const generationPrompt = `List ${companiesPerUpdate} well-known, REAL companies that operate in the ${commodityDescription} market.

Provide only:
- Exact company name (as it appears publicly)
- Company type (Trading Company, Refinery, Distributor, Mining Company, etc.)
- Primary region (Asia, Europe, Americas, Middle East, Africa)

These will be looked up in BrandFetch to get verified business data, logos, and contact information.
Only include major, established companies that would have a public brand presence.`;

      let companyNames;
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await Promise.race([
          openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a business research assistant. Generate accurate, real company names in JSON format.',
              },
              {
                role: 'user',
                content: generationPrompt + '\n\nRespond with valid JSON only: {"companies": [{"name": "...", "type": "...", "region": "..."}]}',
              },
            ],
            temperature: 0.7,
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Company name generation timeout after 60s')), 60000)
          )
        ]);
        
        const content = completion.choices[0]?.message?.content;
        if (!content) {
          throw new Error('No response from OpenAI');
        }
        
        const parsed = JSON.parse(content);
        companyNames = parsed.companies || [];
      } catch (error) {
        console.error('[AI Market Updater Backend] Company name generation error:', error);
        return { 
          success: false, 
          added: 0, 
          error: error instanceof Error ? error.message : 'Failed to generate company list'
        };
      }

      if (companyNames.length === 0) {
        return { success: false, added: 0, error: 'No company names generated' };
      }

      console.log(`[AI Market Updater Backend] Looking up ${companyNames.length} companies in BrandFetch...`);

      const enrichedCompanies = [];
      let brandFetchErrors = 0;
      let successfulLookups = 0;

      const retryWithBackoff = async <T,>(fn: () => Promise<T>, maxRetries = 5): Promise<T> => {
        for (let i = 0; i < maxRetries; i++) {
          try {
            return await fn();
          } catch (error) {
            if (i === maxRetries - 1) {
              console.error(`[AI Market Updater Backend] All ${maxRetries} retries failed:`, error);
              throw error;
            }
            const backoffMs = Math.min(1000 * Math.pow(2, i), 10000);
            console.log(`[AI Market Updater Backend] Retry ${i + 1}/${maxRetries} after ${backoffMs}ms - Error: ${error instanceof Error ? error.message : 'Unknown'}`);
            await new Promise(resolve => setTimeout(resolve, backoffMs));
          }
        }
        throw new Error('Max retries reached');
      };

      const calculateDataQuality = (data: any, hasLogo: boolean, hasDescription: boolean): number => {
        let score = 0;
        if (data.claimed) score += 40;
        if (hasLogo) score += 20;
        if (hasDescription && data.description?.length > 50) score += 20;
        if (data.links && data.links.length > 2) score += 10;
        if (data.colors && data.colors.length > 0) score += 10;
        return score;
      };

      const findBestMatch = (results: any[], searchName: string): any | null => {
        if (!results || results.length === 0) return null;
        
        const searchLower = searchName.toLowerCase();
        const exactMatch = results.find(r => r.name?.toLowerCase() === searchLower);
        if (exactMatch) return exactMatch;
        
        const closeMatch = results.find(r => 
          r.name?.toLowerCase().includes(searchLower) || 
          searchLower.includes(r.name?.toLowerCase())
        );
        if (closeMatch) return closeMatch;
        
        return results[0];
      };

      for (const company of companyNames) {
        try {
          console.log(`[AI Market Updater Backend] Fetching BrandFetch data for: ${company.name}`);
          
          const searchResults = await retryWithBackoff(() => 
            Promise.race([
              brandFetchClient.searchByName(company.name),
              new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('BrandFetch search timeout')), 30000)
              )
            ])
          );

          if (!searchResults || searchResults.length === 0) {
            console.log(`[AI Market Updater Backend] No BrandFetch data found for: ${company.name}`);
            continue;
          }

          const bestMatch = findBestMatch(searchResults, company.name);
          if (!bestMatch || !bestMatch.domain) {
            console.log(`[AI Market Updater Backend] No valid match found for: ${company.name}`);
            continue;
          }

          console.log(`[AI Market Updater Backend] Best match: ${bestMatch.name} (${bestMatch.domain})`);

          const fullData = await retryWithBackoff(() => 
            Promise.race([
              brandFetchClient.searchByDomain(bestMatch.domain),
              new Promise<null>((_, reject) => 
                setTimeout(() => reject(new Error('BrandFetch domain lookup timeout')), 30000)
              )
            ])
          );

          if (!fullData) {
            console.log(`[AI Market Updater Backend] No detailed data for: ${company.name}`);
            continue;
          }

          const logo = brandFetchClient.getLogo(fullData);
          const primaryColor = brandFetchClient.getPrimaryColor(fullData);
          const description = fullData.description || fullData.longDescription || `${company.type} operating in ${commodityDescription}`;
          
          const email = fullData.links?.find(link => 
            link.name.toLowerCase() === 'email' || 
            link.url.startsWith('mailto:')
          )?.url.replace('mailto:', '') || null;

          const phone = fullData.links?.find(link => 
            link.name.toLowerCase() === 'phone' || 
            link.url.startsWith('tel:')
          )?.url.replace('tel:', '') || null;

          const linkedin = fullData.links?.find(link => 
            link.name.toLowerCase() === 'linkedin' || 
            link.url.includes('linkedin.com')
          )?.url || null;

          const website = `https://${bestMatch.domain}`;

          const dataQualityScore = calculateDataQuality(fullData, !!logo, !!description);
          
          if (dataQualityScore < 30) {
            console.log(`[AI Market Updater Backend] Low quality data (${dataQualityScore}/100) for ${fullData.name}, skipping`);
            continue;
          }
          
          enrichedCompanies.push({
            name: fullData.name,
            domain: bestMatch.domain,
            description,
            website,
            logo,
            primaryColor,
            email,
            phone,
            linkedin,
            verified: fullData.claimed,
            companyType: company.type,
            region: company.region,
            dataQualityScore,
            brandFetchData: {
              claimed: fullData.claimed,
              hasLogo: !!logo,
              hasColors: !!(fullData.colors && fullData.colors.length > 0),
              linksCount: fullData.links?.length || 0,
            },
          });

          successfulLookups++;
          console.log(`[AI Market Updater Backend] ✓ Enriched ${fullData.name} with BrandFetch data (Quality: ${dataQualityScore}/100, Verified: ${fullData.claimed})`);
          
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          brandFetchErrors++;
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.error(`[AI Market Updater Backend] BrandFetch error for ${company.name}: ${errorMsg}`);
          
          if (errorMsg.includes('timeout')) {
            console.log('[AI Market Updater Backend] Timeout detected, waiting 5s before next attempt');
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
          
          if (brandFetchErrors >= companyNames.length * 0.7) {
            console.error('[AI Market Updater Backend] Too many BrandFetch errors (>70%), stopping');
            return { 
              success: false, 
              added: 0, 
              error: `Data verification service experiencing issues. Please try again later.`
            };
          }
        }
      }

      console.log(`[AI Market Updater Backend] BrandFetch lookup complete: ${successfulLookups} successful, ${brandFetchErrors} errors`);

      if (enrichedCompanies.length === 0) {
        const errorMsg = brandFetchErrors > 0 
          ? `Unable to verify company data at this time. Please try again later.` 
          : 'No companies met quality standards';
        return { 
          success: false, 
          added: 0, 
          error: errorMsg
        };
      }

      console.log(`[AI Market Updater Backend] Successfully enriched ${enrichedCompanies.length} companies with average quality score: ${Math.round(enrichedCompanies.reduce((sum, c) => sum + c.dataQualityScore, 0) / enrichedCompanies.length)}`);

      let existingParticipants;
      try {
        const result = await Promise.race([
          supabaseAdmin
            .from('market_participants')
            .select('name, domain')
            .returns<{ name: string; domain?: string }[]>(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database query timeout')), 10000)
          )
        ]) as any;
        existingParticipants = result.data;
      } catch (error) {
        console.error('[AI Market Updater Backend] Failed to fetch existing participants:', error);
        return { 
          success: false, 
          added: 0, 
          error: 'Failed to check existing companies'
        };
      }

      const existingDomains = new Set(
        (existingParticipants || [])
          .filter((p: { name: string; domain?: string }) => p.domain)
          .map((p: { name: string; domain?: string }) => p.domain!.toLowerCase().trim())
      );

      const newCompanies = enrichedCompanies
        .filter(company => !existingDomains.has(company.domain.toLowerCase().trim()))
        .sort((a, b) => b.dataQualityScore - a.dataQualityScore)
        .map((company, index) => ({
          id: `brandfetch_${commodity}_${Date.now()}_${index}`,
          name: company.name,
          domain: company.domain,
          type: 'trading_house' as const,
          headquarters: company.region,
          description: company.description,
          verified: company.verified,
          website: company.website,
          logo: company.logo,
          primary_color: company.primaryColor,
          email: company.email,
          phone: company.phone,
          linkedin: company.linkedin,
          commodities: [commodity],
          category: ['diversified'],
          offices: [company.region],
          licenses: [`${company.region}: ${company.companyType}`],
          specialization: commodityDescription,
          business_type: 'both' as const,
          data_quality_score: company.dataQualityScore,
          brandfetch_claimed: company.brandFetchData.claimed,
          last_verified: new Date().toISOString(),
        }));

      if (newCompanies.length === 0) {
        console.log(`[AI Market Updater Backend] All ${enrichedCompanies.length} BrandFetch companies already exist in database`);
        return { 
          success: true, 
          added: 0, 
          duplicates: enrichedCompanies.length,
          error: `All ${enrichedCompanies.length} companies already exist (verified)` 
        };
      }

      console.log(`[AI Market Updater Backend] Preparing to insert ${newCompanies.length} new companies (${enrichedCompanies.length - newCompanies.length} duplicates filtered)`);

      let insertError, insertData;
      try {
        const result = await Promise.race([
          supabaseAdmin
            .from('market_participants')
            .insert(newCompanies as any)
            .select(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database insert timeout')), 15000)
          )
        ]) as any;
        insertError = result.error;
        insertData = result.data;
      } catch (error) {
        console.error('[AI Market Updater Backend] Insert timeout or error:', error);
        return { 
          success: false, 
          added: 0, 
          error: error instanceof Error ? error.message : 'Database insert failed'
        };
      }

      if (insertError) {
        console.error('[AI Market Updater Backend] Insert error:', insertError);
        return { 
          success: false, 
          added: 0, 
          error: `Database error: ${insertError.message}` 
        };
      }

      const addedCount = insertData?.length || 0;
      const avgQuality = addedCount > 0 
        ? Math.round(newCompanies.slice(0, addedCount).reduce((sum, c) => sum + (c.data_quality_score || 0), 0) / addedCount)
        : 0;
      const verifiedCount = newCompanies.slice(0, addedCount).filter(c => c.brandfetch_claimed).length;

      console.log(`[AI Market Updater Backend] ✅ Successfully inserted ${addedCount} companies (Avg Quality: ${avgQuality}/100, Verified: ${verifiedCount}/${addedCount})`);

      return { 
        success: true, 
        added: addedCount,
        duplicates: enrichedCompanies.length - newCompanies.length,
        qualityScore: avgQuality,
        verifiedCount,
        totalAttempted: companyNames.length,
        brandfetchSuccess: successfulLookups,
        brandFetchErrors,
      };
    }),
});
