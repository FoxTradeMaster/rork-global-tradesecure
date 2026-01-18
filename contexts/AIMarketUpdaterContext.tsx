import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateObject } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';
import type { MarketParticipant, TradingHouse, CommodityType } from '@/types';
import { addMarketParticipants } from '@/mocks/market-participants';
import { trpcClient } from '@/lib/trpc';

const CompanySchema = z.object({
  name: z.string().describe('Real company name - must be an actual existing company'),
  headquarters: z.string().describe('Headquarters location (city, country)'),
  description: z.string().describe('Factual description of the company and their trading activities'),
  website: z.string().optional().describe('Company website URL if known'),
  specialization: z.string().describe('Main specialization or trading focus'),
  businessType: z.enum(['buyer', 'seller', 'both']).describe('Whether they buy, sell, or both'),
  companyType: z.string().describe('Type of company (e.g., Trading Company, Refinery, Distributor)'),
  jurisdiction: z.string().describe('Country or jurisdiction code (e.g., US, GB, SG)'),
});

const MarketUpdateSchema = z.object({
  companies: z.array(CompanySchema).describe('List of new companies in this commodity market'),
});

interface UpdateLog {
  id: string;
  timestamp: Date;
  commodity: string;
  companiesAdded: number;
  success: boolean;
  error?: string;
  isSummary?: boolean;
  details?: { name: string; count: number }[];
}

interface UpdaterSettings {
  isEnabled: boolean;
  isPaused: boolean;
  updateIntervalHours: number;
  companiesPerUpdate: number;
  lastUpdateTime?: Date;
  selectedCommodities: CommodityType[];
}

const DEFAULT_SETTINGS: UpdaterSettings = {
  isEnabled: false,
  isPaused: false,
  updateIntervalHours: 1,
  companiesPerUpdate: 10,
  selectedCommodities: ['edible_oils', 'fuel_oil', 'gold', 'steam_coal', 'anthracite_coal', 'urea', 'bio_fuels', 'iron_ore'],
};

export const [AIMarketUpdaterProvider, useAIMarketUpdater] = createContextHook(() => {
  const [settings, setSettings] = useState<UpdaterSettings>(DEFAULT_SETTINGS);
  const [updateLogs, setUpdateLogs] = useState<UpdateLog[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [currentCommodity, setCurrentCommodity] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
    loadLogs();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('ai_market_updater_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({
          ...parsed,
          lastUpdateTime: parsed.lastUpdateTime ? new Date(parsed.lastUpdateTime) : undefined,
        });
      }
    } catch (error) {
      console.error('[AIMarketUpdater] Error loading settings:', error);
    }
  };

  const loadLogs = async () => {
    try {
      const stored = await AsyncStorage.getItem('ai_market_updater_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUpdateLogs(parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        })));
      }
    } catch (error) {
      console.error('[AIMarketUpdater] Error loading logs:', error);
    }
  };

  const saveSettings = useCallback(async (newSettings: UpdaterSettings) => {
    try {
      await AsyncStorage.setItem('ai_market_updater_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('[AIMarketUpdater] Error saving settings:', error);
    }
  }, []);

  const saveLogs = async (logs: UpdateLog[]) => {
    try {
      await AsyncStorage.setItem('ai_market_updater_logs', JSON.stringify(logs));
      setUpdateLogs(logs);
    } catch (error) {
      console.error('[AIMarketUpdater] Error saving logs:', error);
    }
  };

  const addLog = useCallback((log: Omit<UpdateLog, 'id' | 'timestamp'>) => {
    const newLog: UpdateLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date(),
    };
    const updatedLogs = [newLog, ...updateLogs].slice(0, 50);
    saveLogs(updatedLogs);
  }, [updateLogs]);

  const getCommodityLabel = (commodity: CommodityType): string => {
    const commodityLabels: Record<string, string> = {
      edible_oils: 'Edible Oils',
      fuel_oil: 'Fuel Oil',
      gold: 'Gold',
      steam_coal: 'Steam Coal',
      anthracite_coal: 'Anthracite Coal',
      urea: 'Urea',
      bio_fuels: 'Bio-Fuels',
      iron_ore: 'Iron Ore',
    };
    return commodityLabels[commodity] || commodity.replace(/_/g, ' ');
  };

  const getCommodityDescription = (commodity: CommodityType): string => {
    const commodityDescriptions: Record<string, string> = {
      edible_oils: 'edible oils (vegetable oil, palm oil, cooking oil)',
      fuel_oil: 'fuel oil and petroleum products',
      gold: 'gold bullion and precious metals',
      steam_coal: 'steam coal and thermal coal',
      anthracite_coal: 'anthracite coal',
      urea: 'urea and fertilizers',
      bio_fuels: 'bio-fuels (biodiesel, ethanol, renewable fuels)',
      iron_ore: 'iron ore and steel raw materials',
    };
    return commodityDescriptions[commodity] || commodity.replace(/_/g, ' ');
  };

  const updateMarketForCommodity = useCallback(async (commodity: CommodityType) => {
    const commodityLabel = getCommodityLabel(commodity);
    console.log(`[AIMarketUpdater] Updating market for ${commodityLabel} using AI generation`);
    setCurrentCommodity(commodityLabel);

    try {

      const commodityDescription = getCommodityDescription(commodity);
      
      console.log(`[AIMarketUpdater] Generating ${settings.companiesPerUpdate} real companies for ${commodityLabel}`);
      
      const generationPrompt = `Generate ${settings.companiesPerUpdate} REAL, EXISTING companies that are actively involved in the ${commodityDescription} market.

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

      const generationResult = await generateObject({
        messages: [
          {
            role: 'user',
            content: generationPrompt,
          },
        ],
        schema: MarketUpdateSchema,
      });

      if (!generationResult.companies || generationResult.companies.length === 0) {
        console.log(`[AIMarketUpdater] No companies generated for ${commodityLabel}`);
        addLog({
          commodity: commodityLabel,
          companiesAdded: 0,
          success: false,
          error: 'No companies generated by AI',
        });
        return 0;
      }

      const newParticipants: MarketParticipant[] = await Promise.all(
        generationResult.companies.map(async (company, index) => {
          const baseParticipant = {
            id: `ai_generated_${commodity}_${Date.now()}_${index}`,
            name: company.name,
            headquarters: company.headquarters,
            description: company.description,
            verified: true,
            website: company.website,
            commodities: [commodity] as CommodityType[],
          };

          let enrichedData = null;
          try {
            if (company.website) {
              console.log(`[AIMarketUpdater] Enriching ${company.name} with BrandFetch`);
              enrichedData = await trpcClient.brandfetch.enrichCompany.query({
                name: company.name,
                website: company.website,
              });
            }
          } catch {
            console.log(`[AIMarketUpdater] BrandFetch enrichment failed for ${company.name}, continuing without enrichment`);
          }

          return {
            ...baseParticipant,
            type: 'trading_house' as const,
            category: ['diversified' as const],
            offices: [company.headquarters],
            licenses: [`${company.jurisdiction.toUpperCase()}: ${company.companyType}`],
            specialization: company.specialization,
            businessType: company.businessType,
            logo: enrichedData?.logo,
            brandColor: enrichedData?.primaryColor,
            email: enrichedData?.email,
            contactLinks: enrichedData?.links,
            verified: enrichedData?.verified || true,
          } as TradingHouse;
        })
      );

      addMarketParticipants(newParticipants);

      addLog({
        commodity: commodityLabel,
        companiesAdded: newParticipants.length,
        success: true,
      });

      console.log(`[AIMarketUpdater] Successfully added ${newParticipants.length} real companies for ${commodityLabel}`);
      return newParticipants.length;
    } catch (error) {
      console.error(`[AIMarketUpdater] Error updating ${commodityLabel}:`, error);
      addLog({
        commodity: commodityLabel,
        companiesAdded: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return 0;
    } finally {
      setCurrentCommodity(null);
    }
  }, [settings.companiesPerUpdate, addLog]);

  const runUpdate = useCallback(async () => {
    if (isUpdating || settings.isPaused) {
      console.log('[AIMarketUpdater] Update skipped - already updating or paused');
      return;
    }

    setIsUpdating(true);
    console.log('[AIMarketUpdater] Starting market update cycle');

    let totalAdded = 0;
    const commodityResults: { name: string; count: number }[] = [];

    for (const commodity of settings.selectedCommodities) {
      if (settings.isPaused) {
        console.log('[AIMarketUpdater] Update paused mid-cycle');
        break;
      }

      const added = await updateMarketForCommodity(commodity);
      totalAdded += added;
      commodityResults.push({ name: getCommodityLabel(commodity), count: added });

      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    if (totalAdded > 0) {
      const summaryMessage = commodityResults
        .filter(r => r.count > 0)
        .map(r => `${r.name}: ${r.count}`)
        .join(', ');
      
      addLog({
        commodity: `Update Complete - ${summaryMessage}`,
        companiesAdded: totalAdded,
        success: true,
        isSummary: true,
        details: commodityResults,
      });
    }

    await saveSettings({
      ...settings,
      lastUpdateTime: new Date(),
    });

    setIsUpdating(false);
    console.log(`[AIMarketUpdater] Update cycle complete. Total companies added: ${totalAdded}`);
  }, [isUpdating, settings, updateMarketForCommodity, saveSettings, addLog]);

  const scheduleNextUpdate = useCallback(() => {
    if (!settings.isEnabled || settings.isPaused) return;

    const now = new Date().getTime();
    const lastUpdate = settings.lastUpdateTime?.getTime() || 0;
    const intervalMs = settings.updateIntervalHours * 60 * 60 * 1000;
    const nextUpdate = lastUpdate + intervalMs;
    const timeUntilNext = Math.max(0, nextUpdate - now);

    console.log(`[AIMarketUpdater] Next update in ${Math.round(timeUntilNext / 1000 / 60)} minutes`);

    const timeout = setTimeout(() => {
      runUpdate();
    }, timeUntilNext);

    return () => clearTimeout(timeout);
  }, [settings.isEnabled, settings.isPaused, settings.lastUpdateTime, settings.updateIntervalHours, runUpdate]);

  useEffect(() => {
    if (settings.isEnabled && !settings.isPaused) {
      return scheduleNextUpdate();
    }
  }, [scheduleNextUpdate, settings.isEnabled, settings.isPaused]);

  const toggleEnabled = async () => {
    const newSettings = { ...settings, isEnabled: !settings.isEnabled };
    await saveSettings(newSettings);
  };

  const togglePaused = async () => {
    const newSettings = { ...settings, isPaused: !settings.isPaused };
    await saveSettings(newSettings);
  };

  const updateInterval = async (hours: number) => {
    const newSettings = { ...settings, updateIntervalHours: hours };
    await saveSettings(newSettings);
  };

  const updateCompaniesPerUpdate = async (count: number) => {
    const newSettings = { ...settings, companiesPerUpdate: count };
    await saveSettings(newSettings);
  };

  const updateSelectedCommodities = async (commodities: CommodityType[]) => {
    const newSettings = { ...settings, selectedCommodities: commodities };
    await saveSettings(newSettings);
  };

  const manualUpdate = async () => {
    await runUpdate();
  };

  const clearLogs = async () => {
    await saveLogs([]);
  };

  const getNextUpdateTime = useCallback(() => {
    if (!settings.lastUpdateTime) return null;
    const next = new Date(settings.lastUpdateTime);
    next.setHours(next.getHours() + settings.updateIntervalHours);
    return next;
  }, [settings.lastUpdateTime, settings.updateIntervalHours]);

  const getTimeUntilNextUpdate = useCallback(() => {
    const next = getNextUpdateTime();
    if (!next) return null;
    const now = new Date();
    const diff = next.getTime() - now.getTime();
    if (diff <= 0) return 'Ready to update';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, [getNextUpdateTime]);

  return {
    settings,
    updateLogs,
    isUpdating,
    currentCommodity,
    toggleEnabled,
    togglePaused,
    updateInterval,
    updateCompaniesPerUpdate,
    updateSelectedCommodities,
    manualUpdate,
    clearLogs,
    getNextUpdateTime,
    getTimeUntilNextUpdate,
  };
});
