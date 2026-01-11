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

export async function searchCompanies(
  query: string,
  page: number = 1,
  perPage: number = 30
): Promise<OpenCorporatesSearchResult> {
  console.log(`[OpenCorporates] Searching for: ${query} (page ${page})`);
  
  const url = new URL(`${BASE_URL}/companies/search`);
  url.searchParams.append('q', query);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('per_page', perPage.toString());
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
    console.log(`[OpenCorporates] Found ${data.results.total_count} companies`);
    
    return data.results;
  } catch (error) {
    console.error('[OpenCorporates] Search error:', error);
    throw error;
  }
}

export async function getCompanyDetails(
  jurisdictionCode: string,
  companyNumber: string
): Promise<OpenCorporatesCompany> {
  console.log(`[OpenCorporates] Getting details for: ${jurisdictionCode}/${companyNumber}`);
  
  const url = `${BASE_URL}/companies/${jurisdictionCode}/${companyNumber}`;

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
    console.error('[OpenCorporates] Details error:', error);
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
