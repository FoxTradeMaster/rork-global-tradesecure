import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CommodityType } from '@/types';
import { trpcClient } from '@/lib/trpc';



interface UpdateLog {
  id: string;
  timestamp: Date;
  commodity: string;
  companiesAdded: number;
  success: boolean;
  error?: string;
  isSummary?: boolean;
  details?: { name: string; count: number }[];
  qualityScore?: number;
  verifiedCount?: number;
  totalAttempted?: number;
  brandfetchSuccess?: number;
  brandfetchErrors?: number;
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
    console.log(`[AIMarketUpdater] Updating market for ${commodityLabel}`);
    setCurrentCommodity(commodityLabel);

    try {
      if (!settings.isEnabled || settings.isPaused) {
        console.log(`[AIMarketUpdater] Update cancelled for ${commodityLabel} - updater disabled or paused`);
        return 0;
      }

      const commodityDescription = getCommodityDescription(commodity);
      
      console.log(`[AIMarketUpdater] Calling backend to generate and save ${settings.companiesPerUpdate} companies for ${commodityLabel}`);
      
      const result = await trpcClient.aiMarketUpdater.generateAndSaveCompanies.mutate({
        commodity,
        commodityLabel,
        commodityDescription,
        companiesPerUpdate: settings.companiesPerUpdate,
      });

      if (!result.success) {
        console.log(`[AIMarketUpdater] Backend returned error: ${result.error}`);
        addLog({
          commodity: commodityLabel,
          companiesAdded: 0,
          success: false,
          error: result.error || 'Backend operation failed',
        });
        return 0;
      }

      let logMessage = '';
      if (result.added > 0) {
        const qualityInfo = result.qualityScore ? ` (Quality: ${result.qualityScore}/100)` : '';
        const verifiedInfo = result.verifiedCount !== undefined ? ` (Verified: ${result.verifiedCount}/${result.added})` : '';
        logMessage = `${qualityInfo}${verifiedInfo}`;
        
        if (result.duplicates && result.duplicates > 0) {
          logMessage += ` - ${result.duplicates} duplicates filtered`;
        }
        
        if (result.brandfetchSuccess !== undefined && result.totalAttempted !== undefined) {
          logMessage += ` - BrandFetch: ${result.brandfetchSuccess}/${result.totalAttempted} successful`;
        }
      } else if (result.duplicates) {
        logMessage = `All ${result.duplicates} companies already exist`;
      }

      addLog({
        commodity: commodityLabel,
        companiesAdded: result.added,
        success: true,
        error: logMessage || undefined,
        qualityScore: result.qualityScore,
        verifiedCount: result.verifiedCount,
        totalAttempted: result.totalAttempted,
        brandfetchSuccess: result.brandfetchSuccess,
        brandfetchErrors: result.brandfetchErrors,
      });

      console.log(`[AIMarketUpdater] ✅ Successfully added ${result.added} companies for ${commodityLabel}${logMessage ? ` ${logMessage}` : ''}`);
      return result.added;
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
