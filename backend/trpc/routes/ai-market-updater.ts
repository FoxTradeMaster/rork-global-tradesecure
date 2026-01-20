import { z } from 'zod';
import { publicProcedure, createTRPCRouter } from '../create-context';
import { supabaseAdmin } from '@/lib/supabase';
import { generateObject } from '@rork-ai/toolkit-sdk';
import { createBrandFetchClient } from '@/lib/brandfetch';

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
          error: 'BrandFetch API not configured. This is the primary data source for real company data.' 
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
        const generationResult = await Promise.race([
          generateObject({
            messages: [
              {
                role: 'user',
                content: generationPrompt,
              },
            ],
            schema: CompanyNamesSchema,
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Company name generation timeout after 60s')), 60000)
          )
        ]) as any;
        
        companyNames = generationResult.companies || [];
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

      for (const company of companyNames) {
        try {
          console.log(`[AI Market Updater Backend] Fetching BrandFetch data for: ${company.name}`);
          
          const searchResults = await Promise.race([
            brandFetchClient.searchByName(company.name),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('BrandFetch search timeout')), 15000)
            )
          ]);

          if (!searchResults || searchResults.length === 0) {
            console.log(`[AI Market Updater Backend] No BrandFetch data found for: ${company.name}`);
            continue;
          }

          const bestMatch = searchResults[0];
          const fullData = await Promise.race([
            brandFetchClient.searchByDomain(bestMatch.domain),
            new Promise<null>((_, reject) => 
              setTimeout(() => reject(new Error('BrandFetch domain lookup timeout')), 15000)
            )
          ]);

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

          const website = `https://${bestMatch.domain}`;
          
          enrichedCompanies.push({
            name: fullData.name,
            domain: bestMatch.domain,
            description,
            website,
            logo,
            primaryColor,
            email,
            verified: fullData.claimed,
            companyType: company.type,
            region: company.region,
          });

          console.log(`[AI Market Updater Backend] ✓ Enriched ${fullData.name} with BrandFetch data`);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          brandFetchErrors++;
          console.error(`[AI Market Updater Backend] BrandFetch error for ${company.name}:`, error);
          if (brandFetchErrors > 3) {
            console.error('[AI Market Updater Backend] Too many BrandFetch errors, stopping');
            break;
          }
        }
      }

      if (enrichedCompanies.length === 0) {
        return { 
          success: false, 
          added: 0, 
          error: `BrandFetch could not find data for any companies (${brandFetchErrors} errors)` 
        };
      }

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
          .filter(p => p.domain)
          .map(p => p.domain!.toLowerCase().trim())
      );

      const newCompanies = enrichedCompanies
        .filter(company => !existingDomains.has(company.domain.toLowerCase().trim()))
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
          commodities: [commodity],
          category: ['diversified'],
          offices: [company.region],
          licenses: [`${company.region}: ${company.companyType}`],
          specialization: commodityDescription,
          business_type: 'both' as const,
        }));

      if (newCompanies.length === 0) {
        return { 
          success: true, 
          added: 0, 
          duplicates: enrichedCompanies.length,
          error: 'All BrandFetch companies already exist in database' 
        };
      }

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

      return { 
        success: true, 
        added: insertData?.length || 0,
        duplicates: generationResult.companies.length - newCompanies.length,
      };
    }),
});
