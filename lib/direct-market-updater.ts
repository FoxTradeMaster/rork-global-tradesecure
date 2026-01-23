import { BrandFetchClient } from './brandfetch';
import { supabase } from './supabase';
import type { CommodityType } from '@/types';
import { generateCompanies } from './openai-client';

export interface UpdateResult {
  success: boolean;
  added: number;
  duplicates?: number;
  error?: string;
  qualityScore?: number;
  verifiedCount?: number;
  totalAttempted?: number;
  brandfetchSuccess?: number;
  brandFetchErrors?: number;
}

export class DirectMarketUpdater {
  private brandFetchClient: BrandFetchClient | null;

  constructor() {
    const apiKey = process.env.EXPO_PUBLIC_BRANDFETCH_API_KEY || process.env.BRANDFETCH_API_KEY;
    this.brandFetchClient = apiKey ? new BrandFetchClient(apiKey) : null;
  }

  async generateAndSaveCompanies(
    commodity: CommodityType,
    companiesPerUpdate: number = 10
  ): Promise<UpdateResult> {
    try {
      if (!this.brandFetchClient) {
        return {
          success: false,
          added: 0,
          error: 'BrandFetch API key not configured',
        };
      }

      console.log(`[DirectMarketUpdater] Generating ${companiesPerUpdate} companies for ${commodity}`);

      // Generate companies using OpenAI
      let companyTemplates;
      try {
        companyTemplates = await generateCompanies(commodity, companiesPerUpdate);
      } catch (error) {
        console.error('[DirectMarketUpdater] AI generation error:', error);
        return {
          success: false,
          added: 0,
          error: 'Failed to generate company list. Please check your OpenAI API key.',
        };
      }

      if (companyTemplates.length === 0) {
        return {
          success: false,
          added: 0,
          error: 'AI did not generate any companies',
        };
      }

      console.log(`[DirectMarketUpdater] Processing ${companyTemplates.length} AI-generated companies`);

      const enrichedCompanies = [];
      let brandFetchErrors = 0;
      let successfulLookups = 0;
      let duplicates = 0;

      // Check existing companies to avoid duplicates by name
      const { data: existingCompanies } = await supabase
        .from('market_participants')
        .select('name, domain');

      const existingNames = new Set(existingCompanies?.map(c => c.name.toLowerCase()) || []);
      const existingDomains = new Set(existingCompanies?.map(c => c.domain) || []);

      for (const template of companyTemplates) {
        try {
          // Skip if already exists by name
          if (existingNames.has(template.name.toLowerCase())) {
            console.log(`[DirectMarketUpdater] Skipping duplicate: ${template.name}`);
            duplicates++;
            continue;
          }

          // Search BrandFetch by company name
          console.log(`[DirectMarketUpdater] Searching BrandFetch for: ${template.name}`);
          const searchResults = await this.brandFetchClient.searchByName(template.name);
          
          if (!searchResults || searchResults.length === 0) {
            console.log(`[DirectMarketUpdater] No BrandFetch results for: ${template.name}`);
            brandFetchErrors++;
            continue;
          }

          // Find best match
          const bestMatch = searchResults[0]; // BrandFetch returns best matches first
          if (!bestMatch.domain) {
            console.log(`[DirectMarketUpdater] No domain found for: ${template.name}`);
            brandFetchErrors++;
            continue;
          }

          // Skip if domain already exists
          if (existingDomains.has(bestMatch.domain)) {
            console.log(`[DirectMarketUpdater] Domain already exists: ${bestMatch.domain}`);
            duplicates++;
            continue;
          }

          // Get full brand data
          const brandData = await this.brandFetchClient.searchByDomain(bestMatch.domain);

          if (brandData) {
            const logo = this.brandFetchClient.getLogo(brandData);
            const brandColor = this.brandFetchClient.getPrimaryColor(brandData);
            
            const website = brandData.links?.find(l => l.name === 'website')?.url || `https://${brandData.domain}`;
            const email = brandData.links?.find(l => l.name === 'email')?.url?.replace('mailto:', '');

            // Calculate data quality score
            let qualityScore = 0;
            if (brandData.name) qualityScore += 20;
            if (brandData.description) qualityScore += 20;
            if (logo) qualityScore += 20;
            if (website) qualityScore += 15;
            if (brandData.links && brandData.links.length > 0) qualityScore += 15;
            if (brandData.claimed) qualityScore += 10;

            enrichedCompanies.push({
              name: brandData.name || template.name,
              type: template.type,
              headquarters: template.region,
              description: brandData.description || brandData.longDescription || `${template.type} operating in ${commodity.replace(/_/g, ' ')} sector`,
              verified: true,
              website,
              commodities: [commodity],
              category: [template.type],
              logo,
              brand_color: brandColor,
              email,
              domain: brandData.domain,
              data_quality_score: qualityScore,
              brandfetch_claimed: brandData.claimed || false,
              last_verified: new Date().toISOString(),
            });

            successfulLookups++;
            existingDomains.add(brandData.domain); // Track to avoid duplicates in same batch
            console.log(`[DirectMarketUpdater] ✓ Enriched: ${brandData.name} (Quality: ${qualityScore}/100)`);
          } else {
            brandFetchErrors++;
            console.log(`[DirectMarketUpdater] ⚠ No brand data: ${template.name}`);
          }

          // Rate limiting: wait 1.5s between requests to avoid hitting BrandFetch limits
          await new Promise(resolve => setTimeout(resolve, 1500));

        } catch (error) {
          console.error(`[DirectMarketUpdater] Error processing ${template.name}:`, error);
          brandFetchErrors++;
          
          // Continue to next company on error
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Save to database
      if (enrichedCompanies.length > 0) {
        const { data, error } = await supabase
          .from('market_participants')
          .insert(enrichedCompanies)
          .select();

        if (error) {
          console.error('[DirectMarketUpdater] Database error:', error);
          return {
            success: false,
            added: 0,
            error: `Database error: ${error.message}`,
          };
        }

        const added = data?.length || 0;
        const qualityScore = Math.round((successfulLookups / companyTemplates.length) * 100);

        console.log(`[DirectMarketUpdater] ✅ Successfully added ${added} companies`);

        return {
          success: true,
          added,
          duplicates,
          qualityScore,
          verifiedCount: successfulLookups,
          totalAttempted: companyTemplates.length,
          brandfetchSuccess: successfulLookups,
          brandFetchErrors: brandFetchErrors,
        };
      }

      return {
        success: true,
        added: 0,
        duplicates,
        error: duplicates > 0 ? 'All companies already exist in database' : undefined,
      };

    } catch (error) {
      console.error('[DirectMarketUpdater] Error:', error);
      return {
        success: false,
        added: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const directMarketUpdater = new DirectMarketUpdater();
