import type { CommodityType } from '@/types';

export interface CompanyGeneration {
  name: string;
  type: string;
  region: string;
}

export async function generateCompanies(
  commodity: CommodityType,
  count: number = 10
): Promise<CompanyGeneration[]> {
  const commodityLabels: Record<CommodityType, string> = {
    gold: 'Gold Mining',
    fuel_oil: 'Fuel Oil Trading',
    steam_coal: 'Steam Coal',
    anthracite_coal: 'Anthracite Coal',
    urea: 'Urea/Fertilizer',
    edible_oils: 'Edible Oils',
    bio_fuels: 'Bio-Fuels',
    iron_ore: 'Iron Ore',
  };

  const commodityLabel = commodityLabels[commodity];

  const prompt = `List ${count} well-known, REAL companies that operate in the ${commodityLabel} market.

Provide only:
- Exact company name (as it appears publicly)
- Company type (Trading Company, Refinery, Distributor, Mining Company, Producer, etc.)
- Primary region (Asia, Europe, Americas, Middle East, Africa)

These will be looked up in BrandFetch to get verified business data, logos, and contact information.
Only include major, established companies that would have a public brand presence.
Focus on companies that haven't been added yet - try to find diverse companies from different regions.

Respond with valid JSON only: {"companies": [{"name": "...", "type": "...", "region": "..."}]}`;

  try {
    // Use Vercel serverless function to proxy OpenAI requests
    const response = await fetch('/api/generate-companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commodity,
        commodityLabel,
        count,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.companies || [];
  } catch (error) {
    console.error('[OpenAI Client] Error:', error);
    throw error;
  }
}
