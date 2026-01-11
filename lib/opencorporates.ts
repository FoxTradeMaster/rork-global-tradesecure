import { trpcClient } from '@/lib/trpc';

export interface OpenCorporatesCompany {
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

export interface OpenCorporatesSearchResult {
  companies: {
    company: OpenCorporatesCompany;
  }[];
  total_count: number;
  page: number;
  per_page: number;
}

export async function searchCompanies(
  query: string,
  page: number = 1,
  perPage: number = 30
): Promise<OpenCorporatesSearchResult> {
  console.log(`[OpenCorporates Client] Searching for: ${query} (page ${page})`);
  
  try {
    const result = await trpcClient.opencorporates.searchCompanies.query({
      query,
      page,
      perPage,
    });
    
    console.log(`[OpenCorporates Client] Found ${result.total_count} companies`);
    return result;
  } catch (error) {
    console.error('[OpenCorporates Client] Search error:', error);
    throw error;
  }
}

export async function getCompanyDetails(
  jurisdictionCode: string,
  companyNumber: string
): Promise<OpenCorporatesCompany> {
  console.log(`[OpenCorporates Client] Getting details for: ${jurisdictionCode}/${companyNumber}`);
  
  try {
    const result = await trpcClient.opencorporates.getCompanyDetails.query({
      jurisdictionCode,
      companyNumber,
    });
    
    return result;
  } catch (error) {
    console.error('[OpenCorporates Client] Details error:', error);
    throw error;
  }
}

export function getSearchQueriesForCommodity(commodity: string): string[] {
  const queries: Record<string, string[]> = {
    edible_oils: [
      'edible oil trading',
      'vegetable oil distribution',
      'palm oil supplier',
      'cooking oil wholesale',
      'food oil manufacturer',
      'oil refinery food grade',
    ],
    fuel_oil: [
      'fuel oil trading',
      'petroleum products supplier',
      'marine fuel supplier',
      'bunker fuel trading',
      'energy trading',
      'oil refinery',
    ],
    gold: [
      'gold bullion dealer',
      'precious metals trading',
      'gold refinery',
      'bullion bank',
      'gold wholesaler',
      'precious metals merchant',
    ],
    steam_coal: [
      'coal trading',
      'thermal coal supplier',
      'steam coal export',
      'coal mining',
      'coal merchant',
      'power coal supplier',
    ],
    anthracite_coal: [
      'anthracite coal supplier',
      'coal trading',
      'coal merchant',
      'coal export',
    ],
    urea: [
      'fertilizer trading',
      'urea supplier',
      'agricultural chemicals',
      'fertilizer distributor',
      'nitrogen fertilizer',
    ],
  };

  return queries[commodity] || ['commodity trading'];
}

export function formatCompanyLocation(company: OpenCorporatesCompany): string {
  if (company.registered_address) {
    const parts = [
      company.registered_address.locality,
      company.registered_address.region,
      company.registered_address.country,
    ].filter(Boolean);
    
    if (parts.length > 0) {
      return parts.join(', ');
    }
  }

  if (company.registered_address_in_full) {
    const parts = company.registered_address_in_full.split(',').map(p => p.trim());
    if (parts.length > 0) {
      return parts.slice(-2).join(', ');
    }
  }

  return company.jurisdiction_code.toUpperCase();
}

export function generateCompanyDescription(
  company: OpenCorporatesCompany,
  commodity: string
): string {
  const location = formatCompanyLocation(company);
  const commodityLabel = commodity.replace(/_/g, ' ');
  
  return `${company.company_type || 'Trading company'} based in ${location}, registered in ${company.jurisdiction_code.toUpperCase()}. Active in ${commodityLabel} market. Company number: ${company.company_number}.`;
}
