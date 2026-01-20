import React, { createContext, useContext, ReactNode } from 'react';
import { Platform } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useTrading } from './TradingContext';

export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionFeatures {
  maxCounterparties: number | null;
  maxActiveTrades: number | null;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  documentScanning: boolean;
  customReports: boolean;
  apiAccess: boolean;
  bulkImport: boolean;
  marketInsights: boolean;
  commissionRate: number;
  platformFee: number;
}

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  features: SubscriptionFeatures;
  expiresAt: Date | null;
  isActive: boolean;
}

const FREE_FEATURES: SubscriptionFeatures = {
  maxCounterparties: 5,
  maxActiveTrades: 10,
  advancedAnalytics: false,
  prioritySupport: false,
  documentScanning: false,
  customReports: false,
  apiAccess: false,
  bulkImport: false,
  marketInsights: false,
  commissionRate: 2.0,
  platformFee: 0,
};

const PREMIUM_FEATURES: SubscriptionFeatures = {
  maxCounterparties: null,
  maxActiveTrades: null,
  advancedAnalytics: true,
  prioritySupport: true,
  documentScanning: true,
  customReports: true,
  apiAccess: true,
  bulkImport: true,
  marketInsights: true,
  commissionRate: 0.5,
  platformFee: 99,
};

const ENTITLEMENT_ID = 'Fox Trade Master™ Global Trading App Pro';

interface SubscriptionContextValue {
  subscriptionStatus: SubscriptionStatus;
  isLoading: boolean;
  isPremium: boolean;
  offerings: any;
  purchasePackage: (rcPackage: PurchasesPackage) => Promise<any>;
  isPurchasing: boolean;
  restorePurchases: () => Promise<any>;
  isRestoring: boolean;
  manageSubscription: () => Promise<void>;
  checkFeatureAccess: (feature: keyof SubscriptionFeatures) => boolean;
  getFeatureLimit: (feature: keyof SubscriptionFeatures) => number | null;
  customerInfo: any;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { isDemoMode } = useTrading();

  const customerInfoQuery = useQuery({
    queryKey: ['customerInfo'],
    queryFn: async () => {
      if (Platform.OS === 'web') {
        console.log('[RevenueCat] Skipping on web');
        return null;
      }
      try {
        const info = await Purchases.getCustomerInfo();
        console.log('[RevenueCat] Customer info loaded');
        return info;
      } catch (error) {
        console.error('[RevenueCat] Error loading customer info:', error);
        return null;
      }
    },
    staleTime: 60000,
    retry: false,
  });

  const offeringsQuery = useQuery({
    queryKey: ['offerings'],
    queryFn: async () => {
      if (Platform.OS === 'web') {
        console.log('[RevenueCat] Skipping on web');
        return null;
      }
      try {
        const offerings = await Purchases.getOfferings();
        console.log('[RevenueCat] Offerings loaded:', offerings);
        return offerings;
      } catch (error) {
        console.error('[RevenueCat] Error loading offerings:', error);
        return null;
      }
    },
    staleTime: 300000,
    retry: false,
  });

  const getSubscriptionStatus = (): SubscriptionStatus => {
    if (isDemoMode) {
      return {
        tier: 'premium',
        features: PREMIUM_FEATURES,
        expiresAt: null,
        isActive: true,
      };
    }

    const customerInfo = customerInfoQuery.data;
    if (!customerInfo) {
      return {
        tier: 'free',
        features: FREE_FEATURES,
        expiresAt: null,
        isActive: true,
      };
    }

    const hasEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
    if (hasEntitlement) {
      return {
        tier: 'premium',
        features: PREMIUM_FEATURES,
        expiresAt: hasEntitlement.expirationDate ? new Date(hasEntitlement.expirationDate) : null,
        isActive: true,
      };
    }

    return {
      tier: 'free',
      features: FREE_FEATURES,
      expiresAt: null,
      isActive: true,
    };
  };

  const purchaseMutation = useMutation({
    mutationFn: async (rcPackage: PurchasesPackage) => {
      try {
        console.log('[RevenueCat] Purchasing package:', rcPackage.identifier);
        const result = await Purchases.purchasePackage(rcPackage);
        console.log('[RevenueCat] Purchase successful');
        return result;
      } catch (error: any) {
        console.error('[RevenueCat] Purchase error:', error);
        if (error.userCancelled) {
          throw new Error('Purchase cancelled');
        }
        throw error;
      }
    },
    onSuccess: () => {
      customerInfoQuery.refetch();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      try {
        console.log('[RevenueCat] Restoring purchases');
        const customerInfo = await Purchases.restorePurchases();
        console.log('[RevenueCat] Purchases restored');
        return customerInfo;
      } catch (error) {
        console.error('[RevenueCat] Restore error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      customerInfoQuery.refetch();
    },
  });

  const manageSubscription = async () => {
    try {
      console.log('[RevenueCat] Opening subscription management');
      const info = await Purchases.getCustomerInfo();
      if (info.managementURL) {
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') {
            window.open(info.managementURL, '_blank');
          }
        } else {
          console.log('[RevenueCat] Management URL:', info.managementURL);
        }
      }
    } catch (error) {
      console.error('[RevenueCat] Error getting management URL:', error);
    }
  };

  const subscriptionStatus = getSubscriptionStatus();

  const checkFeatureAccess = (feature: keyof SubscriptionFeatures): boolean => {
    return subscriptionStatus.features[feature] === true;
  };

  const getFeatureLimit = (feature: keyof SubscriptionFeatures): number | null => {
    const value = subscriptionStatus.features[feature];
    return typeof value === 'number' ? value : null;
  };

  const value: SubscriptionContextValue = {
    subscriptionStatus,
    isLoading: customerInfoQuery.isLoading || offeringsQuery.isLoading,
    isPremium: subscriptionStatus.tier === 'premium' || isDemoMode,
    offerings: offeringsQuery.data,
    purchasePackage: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    restorePurchases: restoreMutation.mutateAsync,
    isRestoring: restoreMutation.isPending,
    manageSubscription,
    checkFeatureAccess,
    getFeatureLimit,
    customerInfo: customerInfoQuery.data,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextValue {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}
