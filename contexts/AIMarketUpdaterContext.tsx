import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateObject } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';
import type { MarketParticipant, TradingHouse, CommodityType } from '@/types';
import { addMarketParticipants } from '@/mocks/market-participants';

const CompanySchema = z.object({
  name: z.string().describe('Company name'),
  headquarters: z.string().describe('Headquarters location (city, country)'),
  description: z.string().describe('Brief description of the company and their trading activities'),
  website: z.string().optional().describe('Company website URL'),
  specialization: z.string().describe('Main specialization or trading focus'),
  businessType: z.enum(['buyer', 'seller', 'both']).describe('Whether they buy, sell, or both'),
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
  updateIntervalHours: 24,
  companiesPerUpdate: 5,
  selectedCommodities: ['edible_oils', 'fuel_oil', 'gold', 'steam_coal'],
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

  const updateMarketForCommodity = useCallback(async (commodity: CommodityType) => {
    console.log(`[AIMarketUpdater] Updating market for ${commodity}`);
    setCurrentCommodity(commodity);

    try {
      const prompt = `Generate ${settings.companiesPerUpdate} real, verified companies that trade in ${commodity}. 
      
Include a mix of buyers and sellers from different regions globally. 
Focus on legitimate companies with actual market presence.
For edible_oils, include food manufacturers, retailers, distributors, and trading companies.
For fuel_oil, include energy traders, refiners, and logistics companies.
For gold, include bullion dealers, refiners, and trading houses.
For coal, include mining companies, power utilities, and traders.

Provide accurate headquarters locations with city and country.
Write professional descriptions that explain their role in the market.`;

      const result = await generateObject({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        schema: MarketUpdateSchema,
      });

      const newParticipants: MarketParticipant[] = result.companies.map((company, index) => {
        const baseParticipant = {
          id: `ai_generated_${commodity}_${Date.now()}_${index}`,
          name: company.name,
          headquarters: company.headquarters,
          description: company.description,
          verified: false,
          website: company.website,
          commodities: [commodity] as CommodityType[],
        };

        return {
          ...baseParticipant,
          type: 'trading_house' as const,
          category: ['diversified' as const],
          offices: [company.headquarters],
          licenses: [],
          specialization: company.specialization,
          businessType: company.businessType,
        } as TradingHouse;
      });

      addMarketParticipants(newParticipants);

      addLog({
        commodity,
        companiesAdded: newParticipants.length,
        success: true,
      });

      console.log(`[AIMarketUpdater] Successfully added ${newParticipants.length} companies for ${commodity}`);
      return newParticipants.length;
    } catch (error) {
      console.error(`[AIMarketUpdater] Error updating ${commodity}:`, error);
      addLog({
        commodity,
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

    for (const commodity of settings.selectedCommodities) {
      if (settings.isPaused) {
        console.log('[AIMarketUpdater] Update paused mid-cycle');
        break;
      }

      const added = await updateMarketForCommodity(commodity);
      totalAdded += added;

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await saveSettings({
      ...settings,
      lastUpdateTime: new Date(),
    });

    setIsUpdating(false);
    console.log(`[AIMarketUpdater] Update cycle complete. Total companies added: ${totalAdded}`);
  }, [isUpdating, settings, updateMarketForCommodity, saveSettings]);

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
