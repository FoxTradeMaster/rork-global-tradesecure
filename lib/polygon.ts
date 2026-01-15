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

export async function getCommodityPrice(commodity: CommodityType): Promise<PolygonPriceData | null> {
  try {
    const symbol = COMMODITY_SYMBOL_MAP[commodity];
    const apiKey = process.env.EXPO_PUBLIC_POLYGON_API_KEY;
    
    if (!apiKey) {
      console.error('Polygon API key not found');
      return null;
    }

    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`
    );

    if (!response.ok) {
      console.error('Polygon API error:', response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        symbol: commodity,
        price: result.c,
        change: result.c - result.o,
        changePercent: ((result.c - result.o) / result.o) * 100,
        timestamp: result.t,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching commodity price:', error);
    return null;
  }
}

export async function getMultipleCommodityPrices(
  commodities: CommodityType[]
): Promise<Record<CommodityType, PolygonPriceData | null>> {
  const results: Record<CommodityType, PolygonPriceData | null> = {} as any;

  await Promise.all(
    commodities.map(async (commodity) => {
      results[commodity] = await getCommodityPrice(commodity);
    })
  );

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
