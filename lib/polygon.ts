import { CommodityType } from '@/types';

interface PolygonPriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

const COMMODITY_SYMBOL_MAP: Record<CommodityType, string> = {
  gold: 'C:GCUSD',
  fuel_oil: 'C:HOUSD',
  steam_coal: 'C:MTUSD',
  anthracite_coal: 'C:MTUSD',
  urea: 'C:NGUSD',
  edible_oils: 'C:ZLOUSD',
};

const priceCache: Record<string, { data: PolygonPriceData | null; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000;
const RATE_LIMIT_DELAY = 250;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getCommodityPrice(
  commodity: CommodityType,
  retryCount = 0
): Promise<PolygonPriceData | null> {
  try {
    const cached = priceCache[commodity];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`[Polygon] Using cached price for ${commodity}`);
      return cached.data;
    }

    const symbol = COMMODITY_SYMBOL_MAP[commodity];
    const apiKey = process.env.EXPO_PUBLIC_POLYGON_API_KEY;
    
    if (!apiKey) {
      console.error('[Polygon] API key not found');
      return null;
    }

    console.log(`[Polygon] Fetching price for ${commodity}...`);
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`
    );

    const data = await response.json();

    if (response.status === 429) {
      console.warn(`[Polygon] Rate limit hit for ${commodity}, attempt ${retryCount + 1}`);
      
      if (retryCount < 3) {
        const backoffDelay = Math.pow(2, retryCount) * 1000;
        console.log(`[Polygon] Retrying in ${backoffDelay}ms...`);
        await delay(backoffDelay);
        return getCommodityPrice(commodity, retryCount + 1);
      } else {
        console.error('[Polygon] Max retries reached for rate limit');
        return cached?.data || null;
      }
    }

    if (!response.ok) {
      console.error('[Polygon] API error:', response.status, data?.status || data?.error || 'Unknown error');
      return cached?.data || null;
    }
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const priceData: PolygonPriceData = {
        symbol: commodity,
        price: result.c,
        change: result.c - result.o,
        changePercent: ((result.c - result.o) / result.o) * 100,
        timestamp: result.t,
      };
      
      priceCache[commodity] = {
        data: priceData,
        timestamp: Date.now()
      };
      
      console.log(`[Polygon] Successfully fetched price for ${commodity}`);
      return priceData;
    }

    console.warn(`[Polygon] No results for ${commodity}`);
    return cached?.data || null;
  } catch (error) {
    console.error(`[Polygon] Error fetching ${commodity}:`, error);
    const cached = priceCache[commodity];
    return cached?.data || null;
  }
}

export async function getMultipleCommodityPrices(
  commodities: CommodityType[]
): Promise<Record<CommodityType, PolygonPriceData | null>> {
  const results: Record<CommodityType, PolygonPriceData | null> = {} as any;

  console.log(`[Polygon] Fetching prices for ${commodities.length} commodities`);
  
  for (const commodity of commodities) {
    results[commodity] = await getCommodityPrice(commodity);
    
    if (commodities.indexOf(commodity) < commodities.length - 1) {
      await delay(RATE_LIMIT_DELAY);
    }
  }

  return results;
}

export function formatPrice(price: number, commodity: CommodityType): string {
  if (commodity === 'gold') {
    return `$${price.toFixed(2)}/oz`;
  }
  return `$${price.toFixed(2)}/MT`;
}

export function getPriceChangeColor(changePercent: number): string {
  if (changePercent > 0) return '#10B981';
  if (changePercent < 0) return '#EF4444';
  return '#9CA3AF';
}
