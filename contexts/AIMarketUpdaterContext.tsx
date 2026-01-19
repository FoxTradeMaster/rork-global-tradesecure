import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateObject } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';
import type { TradingHouse, CommodityType } from '@/types';
import { supabase, supabaseAdmin } from '@/lib/supabase';
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
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await loadSettings();
        await loadLogs();
      } catch (error) {
        console.error('[AIMarketUpdater] Initialization error:', error);
        setInitError(error instanceof Error ? error.message : 'Initialization failed');
      }
    };
    init().catch(err => {
      console.error('[AIMarketUpdater] Uncaught init error:', err);
    });
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await Promise.race([
        AsyncStorage.getItem('ai_market_updater_settings'),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
      ]);
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
      const stored = await Promise.race([
        AsyncStorage.getItem('ai_market_updater_logs'),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
      ]);
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
      setSettings(newSettings);
      AsyncStorage.setItem('ai_market_updater_settings', JSON.stringify(newSettings)).catch(err => {
        console.error('[AIMarketUpdater] Error persisting settings:', err);
      });
    } catch (error) {
      console.error('[AIMarketUpdater] Error saving settings:', error);
    }
  }, []);

  const saveLogs = async (logs: UpdateLog[]) => {
    try {
      setUpdateLogs(logs);
      AsyncStorage.setItem('ai_market_updater_logs', JSON.stringify(logs)).catch(err => {
        console.error('[AIMarketUpdater] Error persisting logs:', err);
      });
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
      if (!settings.isEnabled || settings.isPaused) {
        console.log(`[AIMarketUpdater] Update cancelled for ${commodityLabel} - updater disabled or paused`);
        return 0;
      }

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

      let generationResult: z.infer<typeof MarketUpdateSchema> | undefined;
      let retryCount = 0;
      const maxRetries = 5;
      const errors: string[] = [];

      while (retryCount < maxRetries) {
        try {
          if (retryCount > 0) {
            console.log(`[AIMarketUpdater] Retry ${retryCount}/${maxRetries} for ${commodityLabel} after network error`);
          }
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
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout after 90s')), 90000)
            )
          ]);
          if (retryCount > 0) {
            console.log(`[AIMarketUpdater] Successfully recovered for ${commodityLabel} after ${retryCount} retries`);
          }
          break;
        } catch (err) {
          retryCount++;
          const errorMsg = err instanceof Error ? err.message : 'Unknown error';
          errors.push(errorMsg);
          
          if (retryCount >= maxRetries) {
            console.error(`[AIMarketUpdater] All ${maxRetries} attempts failed for ${commodityLabel}:`, errors);
            throw new Error(`Network error - all ${maxRetries} attempts failed. Last error: ${errorMsg}`);
          }
          
          const delayMs = Math.min(3000 * Math.pow(1.5, retryCount), 15000);
          console.log(`[AIMarketUpdater] Waiting ${delayMs/1000}s before retry ${retryCount + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }

      if (!generationResult) {
        throw new Error('Generation failed - no result returned');
      }

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

      const { data: existingParticipants, error: fetchError } = await supabase
        .from('market_participants')
        .select('name')
        .returns<{ name: string }[]>();

      if (fetchError) {
        console.error(`[AIMarketUpdater] Error fetching existing companies:`, fetchError);
        throw new Error('Failed to check for duplicates');
      }

      const existingNames = new Set(
        (existingParticipants || []).map(p => p.name.toLowerCase().trim())
      );
      
      console.log(`[AIMarketUpdater] Checking for duplicates against ${existingNames.size} existing companies`);

      const newParticipants: TradingHouse[] = await Promise.all(
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

      const uniqueParticipants = newParticipants.filter(p => {
        const normalizedName = p.name.toLowerCase().trim();
        if (existingNames.has(normalizedName)) {
          console.log(`[AIMarketUpdater] 🚫 Duplicate detected: "${p.name}" - skipping`);
          return false;
        }
        return true;
      });

      const duplicatesCount = newParticipants.length - uniqueParticipants.length;
      if (duplicatesCount > 0) {
        console.log(`[AIMarketUpdater] ⚠️ Filtered out ${duplicatesCount} duplicate companies`);
      }

      if (uniqueParticipants.length === 0) {
        console.log(`[AIMarketUpdater] ⚠️ All ${newParticipants.length} companies were duplicates, nothing to add`);
        addLog({
          commodity: commodityLabel,
          companiesAdded: 0,
          success: true,
          error: `All ${newParticipants.length} generated companies were duplicates`,
        });
        return 0;
      }

      const companiesForDb = uniqueParticipants.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        headquarters: p.headquarters,
        description: p.description,
        verified: p.verified,
        website: p.website || undefined,
        commodities: p.commodities,
        category: p.category || undefined,
        offices: p.offices || undefined,
        licenses: p.licenses || undefined,
        specialization: p.specialization || undefined,
        business_type: p.businessType || undefined,
        logo: p.logo || undefined,
        brand_color: p.brandColor || undefined,
        email: p.email || undefined,
        contact_links: p.contactLinks || undefined,
        founded: p.founded || undefined,
        trading_volume: p.tradingVolume || undefined,
      }));

      const { error: insertError } = await supabaseAdmin
        .from('market_participants')
        .insert(companiesForDb as any);

      if (insertError) {
        console.error(`[AIMarketUpdater] Error saving to Supabase:`, JSON.stringify(insertError, null, 2));
        console.error(`[AIMarketUpdater] Error details - Code: ${insertError.code}, Message: ${insertError.message}, Details: ${insertError.details}`);
        console.error(`[AIMarketUpdater] Failed data sample:`, JSON.stringify(companiesForDb[0], null, 2));
        throw new Error(`Failed to save companies to database: ${insertError.message || 'Unknown error'}`);
      }

      console.log(`[AIMarketUpdater] ✅ Successfully saved ${uniqueParticipants.length} companies to shared database`);

      const logMessage = duplicatesCount > 0 
        ? `Added ${uniqueParticipants.length}, skipped ${duplicatesCount} duplicates`
        : undefined;

      addLog({
        commodity: commodityLabel,
        companiesAdded: uniqueParticipants.length,
        success: true,
        error: logMessage,
      });

      console.log(`[AIMarketUpdater] ✅ Successfully added ${uniqueParticipants.length} real companies for ${commodityLabel}${duplicatesCount > 0 ? ` (${duplicatesCount} duplicates filtered)` : ''}`);
      return uniqueParticipants.length;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[AIMarketUpdater] Error updating ${commodityLabel}:`, errorMessage);
      
      let userFriendlyError = errorMessage;
      if (errorMessage.includes('Load failed') || errorMessage.includes('Network request failed') || errorMessage.includes('Network error')) {
        userFriendlyError = 'Network unstable - skipping this cycle';
      } else if (errorMessage.includes('timeout')) {
        userFriendlyError = 'Request timed out - skipping this cycle';
      } else if (errorMessage.includes('attempts failed')) {
        userFriendlyError = 'Multiple connection failures - check network';
      }
      
      addLog({
        commodity: commodityLabel,
        companiesAdded: 0,
        success: false,
        error: userFriendlyError,
      });
      
      return 0;
    } finally {
      setCurrentCommodity(null);
    }
  }, [settings.companiesPerUpdate, settings.isEnabled, settings.isPaused, addLog]);

  const runUpdate = useCallback(async () => {
    if (isUpdating || settings.isPaused) {
      console.log('[AIMarketUpdater] Update skipped - already updating or paused');
      return;
    }

    setIsUpdating(true);
    console.log('[AIMarketUpdater] Starting market update cycle');

    let totalAdded = 0;
    const commodityResults: { name: string; count: number }[] = [];

    try {
      for (const commodity of settings.selectedCommodities) {
        if (settings.isPaused || !settings.isEnabled) {
          console.log('[AIMarketUpdater] Update paused mid-cycle');
          break;
        }

        try {
          const added = await updateMarketForCommodity(commodity);
          totalAdded += added;
          commodityResults.push({ name: getCommodityLabel(commodity), count: added });
        } catch (error) {
          console.error(`[AIMarketUpdater] Failed to update ${commodity}, continuing with next commodity:`, error);
          commodityResults.push({ name: getCommodityLabel(commodity), count: 0 });
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('[AIMarketUpdater] Critical error in update cycle:', error);
    }

    try {
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
    } catch (error) {
      console.error('[AIMarketUpdater] Error saving update results:', error);
    } finally {
      setIsUpdating(false);
      console.log(`[AIMarketUpdater] Update cycle complete. Total companies added: ${totalAdded}`);
    }
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
    initError,
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
