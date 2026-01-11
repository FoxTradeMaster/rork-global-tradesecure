export interface BrandFetchCompany {
  name: string;
  domain: string;
  claimed: boolean;
  description?: string;
  longDescription?: string;
  links?: {
    name: string;
    url: string;
  }[];
  logos?: {
    type: string;
    theme: string;
    formats: {
      src: string;
      background: string;
      format: string;
      size: number;
      width: number;
      height: number;
    }[];
  }[];
  colors?: {
    hex: string;
    type: string;
    brightness: number;
  }[];
  fonts?: {
    name: string;
    type: string;
    origin: string;
    originId: string;
  }[];
  images?: {
    type: string;
    formats: {
      src: string;
      format: string;
      size: number;
      width: number;
      height: number;
    }[];
  }[];
}

export class BrandFetchClient {
  private apiKey: string;
  private baseUrl = 'https://api.brandfetch.io/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchByDomain(domain: string): Promise<BrandFetchCompany | null> {
    try {
      console.log(`[BrandFetch] Searching for domain: ${domain}`);
      
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      
      const response = await fetch(`${this.baseUrl}/brands/${cleanDomain}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`[BrandFetch] Brand not found for domain: ${cleanDomain}`);
          return null;
        }
        throw new Error(`BrandFetch API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[BrandFetch] Found brand data for: ${cleanDomain}`);
      return data;
    } catch (error) {
      console.error('[BrandFetch] Search error:', error);
      throw error;
    }
  }

  async searchByName(companyName: string): Promise<BrandFetchCompany[]> {
    try {
      console.log(`[BrandFetch] Searching for company: ${companyName}`);
      
      const response = await fetch(`${this.baseUrl}/search/${encodeURIComponent(companyName)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`BrandFetch API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[BrandFetch] Found ${data.length || 0} results for: ${companyName}`);
      return data || [];
    } catch (error) {
      console.error('[BrandFetch] Search error:', error);
      throw error;
    }
  }

  getLogo(company: BrandFetchCompany, theme: 'light' | 'dark' = 'light'): string | null {
    if (!company.logos || company.logos.length === 0) return null;
    
    const logo = company.logos.find(l => l.theme === theme) || company.logos[0];
    if (!logo || !logo.formats || logo.formats.length === 0) return null;
    
    const format = logo.formats.find(f => f.format === 'png') || logo.formats[0];
    return format?.src || null;
  }

  getPrimaryColor(company: BrandFetchCompany): string | null {
    if (!company.colors || company.colors.length === 0) return null;
    const primary = company.colors.find(c => c.type === 'primary');
    return primary?.hex || company.colors[0]?.hex || null;
  }
}

export function createBrandFetchClient(): BrandFetchClient | null {
  const apiKey = process.env.BRANDFETCH_API_KEY;
  
  if (!apiKey) {
    console.warn('[BrandFetch] API key not configured');
    return null;
  }

  return new BrandFetchClient(apiKey);
}
