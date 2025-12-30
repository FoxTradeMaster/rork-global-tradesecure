import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import Purchases, { CustomerInfo, PurchasesOffering } from 'react-native-purchases';
import { Platform } from 'react-native';

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
};

const ENTITLEMENT_ID = 'fox_trade_master_global_trading_app_pro';
const REVENUECAT_API_KEY = 'test_GqTiMdqiPOKKbWazgQuZgiMTztZ';

export const [SubscriptionProvider, useSubscription] = createContextHook(() => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    tier: 'free',
    features: FREE_FEATURES,
    expiresAt: null,
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('[RevenueCat] Configuring SDK...');
        
        if (Platform.OS === 'web') {
          console.log('[RevenueCat] Web platform detected, using mock subscription');
          setIsLoading(false);
          return;
        }

        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
        
        console.log('[RevenueCat] SDK configured successfully');

        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
        updateSubscriptionFromCustomerInfo(info);

        const offers = await Purchases.getOfferings();
        if (offers.current) {
          setOfferings(offers.current);
          console.log('[RevenueCat] Loaded offerings:', offers.current.identifier);
        }

        Purchases.addCustomerInfoUpdateListener((info) => {
          console.log('[RevenueCat] Customer info updated');
          setCustomerInfo(info);
          updateSubscriptionFromCustomerInfo(info);
        });

        setIsLoading(false);
      } catch (error) {
        console.error('[RevenueCat] Configuration error:', error);
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const updateSubscriptionFromCustomerInfo = (info: CustomerInfo) => {
    const hasProEntitlement = typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
    
    if (hasProEntitlement) {
      const entitlement = info.entitlements.active[ENTITLEMENT_ID];
      const expiresAt = entitlement.expirationDate ? new Date(entitlement.expirationDate) : null;
      
      setSubscriptionStatus({
        tier: 'premium',
        features: PREMIUM_FEATURES,
        expiresAt,
        isActive: true,
      });
      console.log('[RevenueCat] Premium subscription active until:', expiresAt);
    } else {
      setSubscriptionStatus({
        tier: 'free',
        features: FREE_FEATURES,
        expiresAt: null,
        isActive: true,
      });
      console.log('[RevenueCat] Free tier active');
    }
  };

  const purchasePackage = async (packageId: string) => {
    try {
      if (Platform.OS === 'web') {
        console.log('[RevenueCat] Mock purchase on web');
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        setSubscriptionStatus({
          tier: 'premium',
          features: PREMIUM_FEATURES,
          expiresAt,
          isActive: true,
        });
        return { customerInfo: null };
      }

      if (!offerings) {
        throw new Error('No offerings available');
      }

      const packageToPurchase = offerings.availablePackages.find(
        pkg => pkg.identifier === packageId
      );

      if (!packageToPurchase) {
        throw new Error(`Package ${packageId} not found`);
      }

      console.log('[RevenueCat] Purchasing package:', packageId);
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      setCustomerInfo(customerInfo);
      updateSubscriptionFromCustomerInfo(customerInfo);
      
      return { customerInfo };
    } catch (error: any) {
      if (error.userCancelled) {
        console.log('[RevenueCat] Purchase cancelled by user');
      } else {
        console.error('[RevenueCat] Purchase error:', error);
      }
      throw error;
    }
  };

  const restorePurchases = async () => {
    try {
      if (Platform.OS === 'web') {
        console.log('[RevenueCat] Restore not available on web');
        return null;
      }

      console.log('[RevenueCat] Restoring purchases...');
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      updateSubscriptionFromCustomerInfo(info);
      return info;
    } catch (error) {
      console.error('[RevenueCat] Restore error:', error);
      throw error;
    }
  };

  const openCustomerCenter = async () => {
    try {
      if (Platform.OS === 'web') {
        console.log('[RevenueCat] Customer center not available on web');
        return;
      }

      console.log('[RevenueCat] Customer center available via presentCustomerCenter in native code');
    } catch (error) {
      console.error('[RevenueCat] Customer center error:', error);
    }
  };

  const checkFeatureAccess = (feature: keyof SubscriptionFeatures): boolean => {
    return subscriptionStatus.features[feature] === true;
  };

  const getFeatureLimit = (feature: keyof SubscriptionFeatures): number | null => {
    const value = subscriptionStatus.features[feature];
    return typeof value === 'number' ? value : null;
  };

  return {
    subscriptionStatus,
    isLoading,
    isPremium: subscriptionStatus.tier === 'premium',
    customerInfo,
    offerings,
    purchasePackage,
    restorePurchases,
    openCustomerCenter,
    checkFeatureAccess,
    getFeatureLimit,
  };
});
