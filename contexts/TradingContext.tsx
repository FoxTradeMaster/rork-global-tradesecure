import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Counterparty, Trade, WalletBalance, Transaction } from '@/types';
import { supabase } from '@/lib/supabase';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal';

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
      { id: 'd1', type: 'corporate_docs', name: 'Trade License', uploadedAt: new Date(), uploadedBy: 'Admin', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', verified: true },
      { id: 'd2', type: 'financial_statement', name: 'FY2024 Audit', uploadedAt: new Date(), uploadedBy: 'Admin', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', verified: true }
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
      { id: 'd3', type: 'license', name: 'Trading License', uploadedAt: new Date(), uploadedBy: 'Compliance', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', verified: true }
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
      { id: 'td1', type: 'loi', name: 'Letter of Intent', uploadedAt: new Date(), uploadedBy: 'John Smith', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', verified: true },
      { id: 'td2', type: 'lc', name: 'Letter of Credit', uploadedAt: new Date(), uploadedBy: 'Bank', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', verified: true }
    ],
    riskLevel: 'green',
    alerts: [],
    commissionRate: 1.0,
    commissionAmount: 625000,
    commissionPaid: false
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
      { id: 'td3', type: 'spa', name: 'Sales & Purchase Agreement', uploadedAt: new Date(), uploadedBy: 'Legal', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', verified: true }
    ],
    riskLevel: 'amber',
    alerts: [
      { id: 'a1', type: 'warning', message: 'LC documentation pending', timestamp: new Date(), resolved: false }
    ],
    commissionRate: 1.5,
    commissionAmount: 390000,
    commissionPaid: false
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
    alerts: [],
    commissionRate: 0.5,
    commissionAmount: 54375,
    commissionPaid: false
  },
  {
    id: 't4',
    commodity: 'edible_oils',
    counterpartyId: 'cp1',
    counterpartyName: 'Emirates Gold Trading LLC',
    quantity: 25000,
    unit: 'MT',
    pricePerUnit: 1250,
    totalValue: 31250000,
    currency: 'USD',
    incoterm: 'CIF Dubai',
    deliveryWindow: { start: new Date('2025-02-10'), end: new Date('2025-02-25') },
    status: 'settled',
    createdAt: new Date('2024-12-29'),
    createdBy: 'John Smith',
    documents: [],
    riskLevel: 'green',
    alerts: [],
    commissionRate: 2.0,
    commissionAmount: 625000,
    commissionPaid: true,
    commissionPaidAt: new Date('2024-12-30')
  }
];

export const [TradingProvider, useTrading] = createContextHook(() => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({ available: 0, pending: 0, total: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      console.log('[TradingContext] Starting to load data...');
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('[TradingContext] Found existing Supabase session');
          const user: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || 'Trade User',
            role: session.user.user_metadata?.role || 'trade_originator',
            email: session.user.email || '',
          };
          setCurrentUser(user);
          await AsyncStorage.setItem('current_user', JSON.stringify(user));
          console.log('[TradingContext] Restored user from session:', user.email);
        } else {
          console.log('[TradingContext] No valid session found, clearing stored user');
          await AsyncStorage.removeItem('current_user');
          setCurrentUser(null);
        }

        const { data: counterpartiesData, error: counterpartiesError } = await supabase
          .from('counterparties')
          .select('*')
          .order('onboarded_at', { ascending: false });

        if (counterpartiesError) {
          console.error('[TradingContext] Error loading counterparties:', counterpartiesError);
          setCounterparties(MOCK_COUNTERPARTIES);
        } else if (counterpartiesData && counterpartiesData.length > 0) {
          const mappedCounterparties: Counterparty[] = counterpartiesData.map((cp: any) => ({
            id: cp.id,
            name: cp.name,
            country: cp.country,
            type: cp.type,
            email: cp.email || '',
            onboardedAt: new Date(cp.onboarded_at),
            riskScore: cp.risk_score,
            documents: cp.documents || [],
            approved: cp.approved,
            approvalConditions: cp.approval_conditions,
            status: cp.status,
          }));
          setCounterparties(mappedCounterparties);
          console.log('[TradingContext] Loaded', mappedCounterparties.length, 'counterparties from Supabase');
        } else {
          setCounterparties(MOCK_COUNTERPARTIES);
          console.log('[TradingContext] No counterparties in DB, using mock data');
        }

        const { data: tradesData, error: tradesError } = await supabase
          .from('trades')
          .select('*')
          .order('created_at', { ascending: false });

        if (tradesError) {
          console.error('[TradingContext] Error loading trades:', tradesError);
          setTrades(MOCK_TRADES);
        } else if (tradesData && tradesData.length > 0) {
          const mappedTrades: Trade[] = tradesData.map((t: any) => ({
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
            commissionRate: t.commission_rate || 0,
            commissionAmount: t.commission_amount || 0,
            commissionPaid: t.commission_paid || false,
            commissionPaidAt: t.commission_paid_at ? new Date(t.commission_paid_at) : undefined,
            paypalOrderId: t.paypal_order_id,
          }));
          setTrades(mappedTrades);
          console.log('[TradingContext] Loaded', mappedTrades.length, 'trades from Supabase');
        } else {
          setTrades(MOCK_TRADES);
          console.log('[TradingContext] No trades in DB, using mock data');
        }

        console.log('[TradingContext] Finished loading all data');
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

  const clearUser = async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem('current_user');
    await supabase.auth.signOut();
    console.log('[TradingContext] User logged out and session cleared');
  };

  const addCounterparties = async (newCounterparties: Counterparty[]) => {
    console.log('[TradingContext] Adding', newCounterparties.length, 'counterparties');
    
    for (const counterparty of newCounterparties) {
      const { error } = await supabase
        .from('counterparties')
        .insert({
          user_id: 'anonymous',
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
        user_id: 'anonymous',
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
          user_id: 'anonymous',
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
        user_id: 'anonymous',
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
    if (updates.commissionPaid !== undefined) dbUpdates.commission_paid = updates.commissionPaid;
    if (updates.paypalOrderId) dbUpdates.paypal_order_id = updates.paypalOrderId;

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

  const payPlatformFee = async (tradeId: string, amount: number): Promise<{ approvalUrl: string; orderId: string }> => {
    try {
      const trade = trades.find(t => t.id === tradeId);
      const order = await createPayPalOrder(
        amount.toFixed(2),
        'USD',
        `Platform fee for trade ${trade?.commodity || tradeId}`
      );

      const approvalLink = order.links?.find((link: any) => link.rel === 'approve');
      if (!approvalLink) {
        throw new Error('No approval URL found');
      }

      await updateTrade(tradeId, { paypalOrderId: order.id });

      return { approvalUrl: approvalLink.href, orderId: order.id };
    } catch (error) {
      console.error('[Trading] Error creating platform fee payment:', error);
      throw error;
    }
  };

  const confirmPlatformFeePayment = async (tradeId: string, orderId: string) => {
    try {
      const capture = await capturePayPalOrder(orderId);
      
      if (capture.status === 'COMPLETED') {
        await updateTrade(tradeId, { 
          commissionPaid: true, 
          commissionPaidAt: new Date() 
        });

        const transaction: Transaction = {
          id: `txn_${Date.now()}`,
          type: 'platform_fee',
          amount: parseFloat(capture.purchase_units?.[0]?.amount?.value || '0'),
          currency: 'USD',
          status: 'completed',
          description: `Platform fee for trade ${tradeId}`,
          timestamp: new Date(),
          paypalOrderId: orderId,
          tradeId: tradeId,
        };

        setTransactions(prev => [transaction, ...prev]);
        console.log('[Trading] Platform fee payment completed');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[Trading] Error confirming payment:', error);
      throw error;
    }
  };

  const addDeposit = async (amount: number): Promise<{ approvalUrl: string; orderId: string }> => {
    try {
      const order = await createPayPalOrder(
        amount.toFixed(2),
        'USD',
        'Wallet deposit'
      );

      const approvalLink = order.links?.find((link: any) => link.rel === 'approve');
      if (!approvalLink) {
        throw new Error('No approval URL found');
      }

      return { approvalUrl: approvalLink.href, orderId: order.id };
    } catch (error) {
      console.error('[Trading] Error creating deposit:', error);
      throw error;
    }
  };

  const confirmDeposit = async (orderId: string) => {
    try {
      const capture = await capturePayPalOrder(orderId);
      
      if (capture.status === 'COMPLETED') {
        const amount = parseFloat(capture.purchase_units?.[0]?.amount?.value || '0');
        
        setWalletBalance(prev => ({
          available: prev.available + amount,
          pending: prev.pending,
          total: prev.total + amount,
        }));

        const transaction: Transaction = {
          id: `txn_${Date.now()}`,
          type: 'deposit',
          amount: amount,
          currency: 'USD',
          status: 'completed',
          description: 'Wallet deposit via PayPal',
          timestamp: new Date(),
          paypalOrderId: orderId,
        };

        setTransactions(prev => [transaction, ...prev]);
        console.log('[Trading] Deposit completed');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[Trading] Error confirming deposit:', error);
      throw error;
    }
  };

  return {
    currentUser,
    setUser,
    clearUser,
    counterparties,
    trades,
    walletBalance,
    transactions,
    isLoading,
    addCounterparty,
    addCounterparties,
    updateCounterparty,
    addTrade,
    addTrades,
    updateTrade,
    payPlatformFee,
    confirmPlatformFeePayment,
    addDeposit,
    confirmDeposit,
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
    
    const totalCommissionEarned = trades
      .filter(t => t.commissionPaid)
      .reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
    
    const pendingCommission = trades
      .filter(t => ['delivered', 'settled'].includes(t.status) && !t.commissionPaid)
      .reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
    
    const potentialCommission = trades
      .filter(t => ['active', 'in_transit', 'financing_pending'].includes(t.status))
      .reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
    
    return {
      totalValue,
      activeTrades,
      pendingApprovals,
      criticalAlerts,
      approvedCounterparties,
      totalCounterparties: counterparties.length,
      totalCommissionEarned,
      pendingCommission,
      potentialCommission
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
