import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Counterparty, Trade } from '@/types';
import { supabase } from '@/lib/supabase';

const MOCK_COUNTERPARTIES: Counterparty[] = [
  {
    id: 'cp1',
    name: 'Emirates Gold Trading LLC',
    country: 'UAE',
    type: 'buyer',
    onboardedAt: new Date('2024-11-15'),
    riskScore: {
      legal_licensing: 92,
      financial_strength: 88,
      compliance_sanctions: 95,
      operations_logistics: 85,
      commodity_specific: 90,
      overall: 90,
      level: 'green'
    },
    documents: [
      { id: 'd1', type: 'corporate_docs', name: 'Trade License', uploadedAt: new Date(), uploadedBy: 'Admin', url: '', verified: true },
      { id: 'd2', type: 'financial_statement', name: 'FY2024 Audit', uploadedAt: new Date(), uploadedBy: 'Admin', url: '', verified: true }
    ],
    approved: true,
    status: 'approved'
  },
  {
    id: 'cp2',
    name: 'Petro Energy International',
    country: 'Singapore',
    type: 'seller',
    onboardedAt: new Date('2024-12-01'),
    riskScore: {
      legal_licensing: 78,
      financial_strength: 72,
      compliance_sanctions: 85,
      operations_logistics: 80,
      commodity_specific: 75,
      overall: 78,
      level: 'amber'
    },
    documents: [
      { id: 'd3', type: 'license', name: 'Trading License', uploadedAt: new Date(), uploadedBy: 'Compliance', url: '', verified: true }
    ],
    approved: true,
    approvalConditions: ['Escrow required', 'Bank confirmation required'],
    status: 'approved'
  },
  {
    id: 'cp3',
    name: 'Global Coal Resources Ltd',
    country: 'Australia',
    type: 'seller',
    onboardedAt: new Date('2024-12-20'),
    riskScore: {
      legal_licensing: 95,
      financial_strength: 91,
      compliance_sanctions: 98,
      operations_logistics: 88,
      commodity_specific: 92,
      overall: 93,
      level: 'green'
    },
    documents: [],
    approved: true,
    status: 'approved'
  }
];

const MOCK_TRADES: Trade[] = [
  {
    id: 't1',
    commodity: 'gold',
    counterpartyId: 'cp1',
    counterpartyName: 'Emirates Gold Trading LLC',
    quantity: 1000,
    unit: 'kg',
    pricePerUnit: 62500,
    totalValue: 62500000,
    currency: 'USD',
    incoterm: 'CIF Dubai',
    deliveryWindow: { start: new Date('2025-02-01'), end: new Date('2025-02-15') },
    status: 'active',
    createdAt: new Date('2024-12-15'),
    createdBy: 'John Smith',
    documents: [
      { id: 'td1', type: 'loi', name: 'Letter of Intent', uploadedAt: new Date(), uploadedBy: 'John Smith', url: '', verified: true },
      { id: 'td2', type: 'lc', name: 'Letter of Credit', uploadedAt: new Date(), uploadedBy: 'Bank', url: '', verified: true }
    ],
    riskLevel: 'green',
    alerts: []
  },
  {
    id: 't2',
    commodity: 'fuel_oil',
    counterpartyId: 'cp2',
    counterpartyName: 'Petro Energy International',
    quantity: 50000,
    unit: 'MT',
    pricePerUnit: 520,
    totalValue: 26000000,
    currency: 'USD',
    incoterm: 'FOB Singapore',
    deliveryWindow: { start: new Date('2025-01-20'), end: new Date('2025-01-31') },
    status: 'financing_pending',
    createdAt: new Date('2024-12-22'),
    createdBy: 'Sarah Johnson',
    documents: [
      { id: 'td3', type: 'spa', name: 'Sales & Purchase Agreement', uploadedAt: new Date(), uploadedBy: 'Legal', url: '', verified: true }
    ],
    riskLevel: 'amber',
    alerts: [
      { id: 'a1', type: 'warning', message: 'LC documentation pending', timestamp: new Date(), resolved: false }
    ]
  },
  {
    id: 't3',
    commodity: 'steam_coal',
    counterpartyId: 'cp3',
    counterpartyName: 'Global Coal Resources Ltd',
    quantity: 75000,
    unit: 'MT',
    pricePerUnit: 145,
    totalValue: 10875000,
    currency: 'USD',
    incoterm: 'FOB Newcastle',
    deliveryWindow: { start: new Date('2025-03-01'), end: new Date('2025-03-15') },
    status: 'legal_review',
    createdAt: new Date('2024-12-28'),
    createdBy: 'Michael Chen',
    documents: [],
    riskLevel: 'green',
    alerts: []
  }
];

export const [TradingProvider, useTrading] = createContextHook(() => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      console.log('[TradingContext] Starting to load data...');
      
      try {
        setCounterparties(MOCK_COUNTERPARTIES);
        setTrades(MOCK_TRADES);
        console.log('[TradingContext] Loaded mock data immediately');

        try {
          const storedUser = await Promise.race([
            AsyncStorage.getItem('current_user'),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Storage timeout')), 500))
          ]) as string | null;
          
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
            console.log('[TradingContext] Loaded user from storage');
          }
        } catch (storageError) {
          console.log('[TradingContext] Storage error/timeout:', storageError);
        }

        console.log('[TradingContext] Finished loading user data');

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Supabase timeout')), 1000)
        );

        try {
          const cpPromise = supabase
            .from('counterparties')
            .select('*');
          
          const { data: cpData, error: cpError } = await Promise.race([
            cpPromise,
            timeoutPromise
          ]) as any;
          
          if (!cpError && cpData && cpData.length > 0) {
            console.log('[TradingContext] Loaded counterparties from Supabase:', cpData.length);
            setCounterparties(cpData.map((cp: any) => ({
              id: cp.id,
              name: cp.name,
              country: cp.country,
              type: cp.type,
              onboardedAt: new Date(cp.onboarded_at),
              riskScore: cp.risk_score,
              documents: cp.documents || [],
              approved: cp.approved,
              approvalConditions: cp.approval_conditions,
              status: cp.status,
            })));
          }
        } catch (cpError) {
          console.log('[TradingContext] Supabase counterparties error/timeout, keeping mocks:', cpError);
        }

        try {
          const tradesPromise = supabase
            .from('trades')
            .select('*');
          
          const { data: tradesData, error: tradesError } = await Promise.race([
            tradesPromise,
            timeoutPromise
          ]) as any;
          
          if (!tradesError && tradesData && tradesData.length > 0) {
            console.log('[TradingContext] Loaded trades from Supabase:', tradesData.length);
            setTrades(tradesData.map((t: any) => ({
              id: t.id,
              commodity: t.commodity,
              counterpartyId: t.counterparty_id,
              counterpartyName: t.counterparty_name,
              quantity: t.quantity,
              unit: t.unit,
              pricePerUnit: t.price_per_unit,
              totalValue: t.total_value,
              currency: t.currency,
              incoterm: t.incoterm,
              deliveryWindow: t.delivery_window,
              status: t.status,
              createdAt: new Date(t.created_at),
              createdBy: t.created_by,
              documents: t.documents || [],
              riskLevel: t.risk_level,
              alerts: t.alerts || [],
            })));
          }
        } catch (tradesError) {
          console.log('[TradingContext] Supabase trades error/timeout, keeping mocks:', tradesError);
        }
      } catch (error) {
        console.error('[TradingContext] Error loading data:', error);
        setCounterparties(MOCK_COUNTERPARTIES);
        setTrades(MOCK_TRADES);
      } finally {
        setIsLoading(false);
        console.log('[TradingContext] Loading complete');
      }
    };

    loadData();
  }, []);

  const setUser = async (user: User) => {
    setCurrentUser(user);
    await AsyncStorage.setItem('current_user', JSON.stringify(user));
  };

  const addCounterparties = async (newCounterparties: Counterparty[]) => {
    console.log('[TradingContext] Adding', newCounterparties.length, 'counterparties');
    
    for (const counterparty of newCounterparties) {
      const { error } = await supabase
        .from('counterparties')
        .insert({
          name: counterparty.name,
          country: counterparty.country,
          type: counterparty.type,
          email: '',
          onboarded_at: counterparty.onboardedAt.toISOString(),
          risk_score: counterparty.riskScore,
          documents: counterparty.documents,
          approved: counterparty.approved,
          approval_conditions: counterparty.approvalConditions,
          status: counterparty.status,
        });

      if (error) {
        console.error('Error adding counterparty:', error);
      }
    }
    
    setCounterparties(prev => [...prev, ...newCounterparties]);
  };

  const addCounterparty = async (counterparty: Counterparty) => {
    const { data, error } = await supabase
      .from('counterparties')
      .insert({
        name: counterparty.name,
        country: counterparty.country,
        type: counterparty.type,
        email: '',
        onboarded_at: counterparty.onboardedAt.toISOString(),
        risk_score: counterparty.riskScore,
        documents: counterparty.documents,
        approved: counterparty.approved,
        approval_conditions: counterparty.approvalConditions,
        status: counterparty.status,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding counterparty:', error);
      const updated = [...counterparties, counterparty];
      setCounterparties(updated);
    } else if (data) {
      const updated = [...counterparties, { ...counterparty, id: data.id }];
      setCounterparties(updated);
    }
  };

  const updateCounterparty = async (id: string, updates: Partial<Counterparty>) => {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.country) dbUpdates.country = updates.country;
    if (updates.riskScore) dbUpdates.risk_score = updates.riskScore;
    if (updates.documents) dbUpdates.documents = updates.documents;
    if (updates.approved !== undefined) dbUpdates.approved = updates.approved;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.approvalConditions) dbUpdates.approval_conditions = updates.approvalConditions;

    const { error } = await supabase
      .from('counterparties')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating counterparty:', error);
    }

    const updated = counterparties.map(cp => cp.id === id ? { ...cp, ...updates } : cp);
    setCounterparties(updated);
  };

  const addTrades = async (newTrades: Trade[]) => {
    console.log('[TradingContext] Adding', newTrades.length, 'trades');
    
    for (const trade of newTrades) {
      const { error } = await supabase
        .from('trades')
        .insert({
          commodity: trade.commodity,
          counterparty_id: trade.counterpartyId,
          counterparty_name: trade.counterpartyName,
          quantity: trade.quantity,
          unit: trade.unit,
          price_per_unit: trade.pricePerUnit,
          total_value: trade.totalValue,
          currency: trade.currency,
          incoterm: trade.incoterm,
          delivery_window: trade.deliveryWindow,
          status: trade.status,
          created_by: trade.createdBy,
          documents: trade.documents,
          risk_level: trade.riskLevel,
          alerts: trade.alerts,
        });

      if (error) {
        console.error('Error adding trade:', error);
      }
    }
    
    setTrades(prev => [...prev, ...newTrades]);
  };

  const addTrade = async (trade: Trade) => {
    const { data, error } = await supabase
      .from('trades')
      .insert({
        commodity: trade.commodity,
        counterparty_id: trade.counterpartyId,
        counterparty_name: trade.counterpartyName,
        quantity: trade.quantity,
        unit: trade.unit,
        price_per_unit: trade.pricePerUnit,
        total_value: trade.totalValue,
        currency: trade.currency,
        incoterm: trade.incoterm,
        delivery_window: trade.deliveryWindow,
        status: trade.status,
        created_by: trade.createdBy,
        documents: trade.documents,
        risk_level: trade.riskLevel,
        alerts: trade.alerts,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding trade:', error);
      const updated = [...trades, trade];
      setTrades(updated);
    } else if (data) {
      const updated = [...trades, { ...trade, id: data.id }];
      setTrades(updated);
    }
  };

  const updateTrade = async (id: string, updates: Partial<Trade>) => {
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.documents) dbUpdates.documents = updates.documents;
    if (updates.riskLevel) dbUpdates.risk_level = updates.riskLevel;
    if (updates.alerts) dbUpdates.alerts = updates.alerts;
    if (updates.pricePerUnit) dbUpdates.price_per_unit = updates.pricePerUnit;
    if (updates.totalValue) dbUpdates.total_value = updates.totalValue;

    const { error } = await supabase
      .from('trades')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating trade:', error);
    }

    const updated = trades.map(t => t.id === id ? { ...t, ...updates } : t);
    setTrades(updated);
  };

  return {
    currentUser,
    setUser,
    counterparties,
    trades,
    isLoading,
    addCounterparty,
    addCounterparties,
    updateCounterparty,
    addTrade,
    addTrades,
    updateTrade
  };
});

export function usePortfolioMetrics() {
  const { trades, counterparties } = useTrading();
  
  return useMemo(() => {
    const totalValue = trades.reduce((sum, t) => sum + t.totalValue, 0);
    const activeTrades = trades.filter(t => ['active', 'in_transit', 'financing_pending'].includes(t.status)).length;
    const pendingApprovals = trades.filter(t => ['counterparty_review', 'risk_approval', 'legal_review', 'compliance_check'].includes(t.status)).length;
    const criticalAlerts = trades.reduce((sum, t) => sum + t.alerts.filter(a => a.type === 'critical' && !a.resolved).length, 0);
    const approvedCounterparties = counterparties.filter(cp => cp.approved).length;
    
    return {
      totalValue,
      activeTrades,
      pendingApprovals,
      criticalAlerts,
      approvedCounterparties,
      totalCounterparties: counterparties.length
    };
  }, [trades, counterparties]);
}

export function useTradesByStatus() {
  const { trades } = useTrading();
  
  return useMemo(() => {
    const statusCounts: Record<string, number> = {};
    trades.forEach(trade => {
      statusCounts[trade.status] = (statusCounts[trade.status] || 0) + 1;
    });
    return statusCounts;
  }, [trades]);
}
