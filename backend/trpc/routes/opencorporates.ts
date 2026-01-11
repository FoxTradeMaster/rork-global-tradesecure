import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

interface OpenCorporatesCompany {
  name: string;
  company_number: string;
  jurisdiction_code: string;
  incorporation_date: string | null;
  company_type: string;
  registry_url: string;
  branch: string | null;
  inactive: boolean;
  current_status: string;
  registered_address_in_full: string;
  registered_address: {
    locality?: string;
    region?: string;
    country?: string;
  } | null;
}

interface OpenCorporatesSearchResult {
  companies: {
    company: OpenCorporatesCompany;
  }[];
  total_count: number;
  page: number;
  per_page: number;
}

interface OpenCorporatesResponse {
  results: OpenCorporatesSearchResult;
}

const BASE_URL = 'https://api.opencorporates.com/v0.4';

export const opencorporatesRouter = createTRPCRouter({
  searchCompanies: publicProcedure
    .input(
      z.object({
        query: z.string(),
        page: z.number().default(1),
        perPage: z.number().default(30),
      })
    )
    .query(async ({ input }) => {
      console.log(`[OpenCorporates Backend] Searching for: ${input.query} (page ${input.page})`);
      
      const url = new URL(`${BASE_URL}/companies/search`);
      url.searchParams.append('q', input.query);
      url.searchParams.append('page', input.page.toString());
      url.searchParams.append('per_page', input.perPage.toString());
      url.searchParams.append('inactive', 'false');
      url.searchParams.append('branch', 'false');

      try {
        const response = await fetch(url.toString(), {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`OpenCorporates API error: ${response.status} ${response.statusText}`);
        }

        const data: OpenCorporatesResponse = await response.json();
        console.log(`[OpenCorporates Backend] Found ${data.results.total_count} companies`);
        
        return data.results;
      } catch (error) {
        console.error('[OpenCorporates Backend] Search error:', error);
        throw new Error(error instanceof Error ? error.message : 'Search failed');
      }
    }),

  getCompanyDetails: publicProcedure
    .input(
      z.object({
        jurisdictionCode: z.string(),
        companyNumber: z.string(),
      })
    )
    .query(async ({ input }) => {
      console.log(`[OpenCorporates Backend] Getting details for: ${input.jurisdictionCode}/${input.companyNumber}`);
      
      const url = `${BASE_URL}/companies/${input.jurisdictionCode}/${input.companyNumber}`;

      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`OpenCorporates API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.results.company;
      } catch (error) {
        console.error('[OpenCorporates Backend] Details error:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to get company details');
      }
    }),
});
