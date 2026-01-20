import { z } from 'zod';
import { publicProcedure, createTRPCRouter } from '../create-context';
import { supabaseAdmin } from '@/lib/supabase';
import { generateObject } from '@rork-ai/toolkit-sdk';

const CompanySchema = z.object({
  name: z.string(),
  headquarters: z.string(),
  description: z.string(),
  website: z.string().optional(),
  specialization: z.string(),
  businessType: z.enum(['buyer', 'seller', 'both']),
  companyType: z.string(),
  jurisdiction: z.string(),
});

const MarketUpdateSchema = z.object({
  companies: z.array(CompanySchema),
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

      console.log(`[AI Market Updater Backend] Generating companies for ${commodityLabel}`);

      const generationPrompt = `Generate ${companiesPerUpdate} REAL, EXISTING companies that are actively involved in the ${commodityDescription} market.

IMPORTANT:
- These must be actual, real companies that exist in the real world
- Include a diverse mix: major corporations, regional traders, distributors, refineries, wholesalers
- Include companies from different regions (Asia, Europe, Americas, Middle East, Africa)
- Provide factual information only - no fictional companies
- Include company type and jurisdiction information

For each company provide:
- Exact legal name
- Real headquarters location
- Factual description of their business
- Type of company (Trading Company, Refinery, Distributor, Wholesaler, etc.)
- Whether they are a buyer, seller, or both
- Their main specialization
- Jurisdiction/country code
- Website if known`;

      let generationResult;
      try {
        generationResult = await Promise.race([
          generateObject({
            messages: [
              {
                role: 'user',
                content: generationPrompt,
              },
            ],
            schema: MarketUpdateSchema,
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('AI generation timeout after 90s')), 90000)
          )
        ]) as any;
      } catch (error) {
        console.error('[AI Market Updater Backend] Generation error:', error);
        return { 
          success: false, 
          added: 0, 
          error: error instanceof Error ? error.message : 'AI generation failed'
        };
      }

      if (!generationResult.companies || generationResult.companies.length === 0) {
        return { success: false, added: 0, error: 'No companies generated' };
      }

      let existingParticipants;
      try {
        const result = await Promise.race([
          supabaseAdmin
            .from('market_participants')
            .select('name')
            .returns<{ name: string }[]>(),
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

      const existingNames = new Set(
        (existingParticipants || []).map(p => p.name.toLowerCase().trim())
      );

      const newCompanies = generationResult.companies
        .filter(company => !existingNames.has(company.name.toLowerCase().trim()))
        .map((company, index) => ({
          id: `ai_generated_${commodity}_${Date.now()}_${index}`,
          name: company.name,
          type: 'trading_house' as const,
          headquarters: company.headquarters,
          description: company.description,
          verified: true,
          website: company.website,
          commodities: [commodity],
          category: ['diversified'],
          offices: [company.headquarters],
          licenses: [`${company.jurisdiction.toUpperCase()}: ${company.companyType}`],
          specialization: company.specialization,
          business_type: company.businessType,
        }));

      if (newCompanies.length === 0) {
        return { 
          success: true, 
          added: 0, 
          duplicates: generationResult.companies.length,
          error: 'All generated companies were duplicates' 
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
