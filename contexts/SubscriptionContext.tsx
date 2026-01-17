import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUBSCRIPTION_PLANS, PayPalSubscriptionPlan, createPayPalSubscription, getPayPalSubscription, cancelPayPalSubscription } from '@/lib/paypal';
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
  paypalSubscriptionId?: string;
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

const STORAGE_KEY = 'subscription_status';

export const [SubscriptionProvider, useSubscription] = createContextHook(() => {
  const { isDemoMode } = useTrading();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    tier: 'free',
    features: FREE_FEATURES,
    expiresAt: null,
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [plans] = useState<PayPalSubscriptionPlan[]>(SUBSCRIPTION_PLANS);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('[Subscription] Loading subscription status...');
        
        if (isDemoMode) {
          console.log('[Subscription] Demo mode detected, granting premium features');
          setSubscriptionStatus({
            tier: 'premium',
            features: PREMIUM_FEATURES,
            expiresAt: null,
            isActive: true,
          });
          setIsLoading(false);
          return;
        }
        
        const storagePromise = AsyncStorage.getItem(STORAGE_KEY);
        const timeoutPromise = new Promise<null>((resolve) => 
          setTimeout(() => resolve(null), 3000)
        );
        
        const stored = await Promise.race([storagePromise, timeoutPromise]);
        
        if (stored) {
          const parsed = JSON.parse(stored);
          const status: SubscriptionStatus = {
            ...parsed,
            expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
          };
          
          if (status.paypalSubscriptionId) {
            try {
              const paypalCheckPromise = getPayPalSubscription(status.paypalSubscriptionId);
              const paypalTimeout = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('PayPal check timeout')), 3000)
              );
              
              const paypalSub = await Promise.race([paypalCheckPromise, paypalTimeout]) as any;
              
              if (paypalSub.status === 'ACTIVE') {
                setSubscriptionStatus(status);
                console.log('[Subscription] Active PayPal subscription loaded');
              } else {
                console.log('[Subscription] PayPal subscription not active:', paypalSub.status);
                await AsyncStorage.removeItem(STORAGE_KEY);
              }
            } catch (error) {
              console.error('[Subscription] Error checking PayPal subscription:', error);
              await AsyncStorage.removeItem(STORAGE_KEY);
            }
          } else {
            setSubscriptionStatus(status);
          }
        }
      } catch (error) {
        console.error('[Subscription] Error loading subscription:', error);
      } finally {
        setIsLoading(false);
        console.log('[Subscription] Initialization complete');
      }
    };
    init();
  }, [isDemoMode]);

  const saveSubscriptionStatus = async (status: SubscriptionStatus) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(status));
      setSubscriptionStatus(status);
      console.log('[Subscription] Status saved:', status.tier);
    } catch (error) {
      console.error('[Subscription] Error saving status:', error);
    }
  };

  const purchaseSubscription = async (planId: string): Promise<{ approvalUrl: string }> => {
    try {
      console.log('[Subscription] Creating PayPal subscription:', planId);
      
      const subscription = await createPayPalSubscription(planId);
      
      const approvalLink = subscription.links?.find((link: any) => link.rel === 'approve');
      if (!approvalLink) {
        throw new Error('No approval URL found');
      }

      return { approvalUrl: approvalLink.href };
    } catch (error) {
      console.error('[Subscription] Error creating subscription:', error);
      throw error;
    }
  };

  const confirmSubscription = async (subscriptionId: string) => {
    try {
      const subscription = await getPayPalSubscription(subscriptionId);
      
      if (subscription.status === 'ACTIVE') {
        const plan = plans.find(p => subscription.plan_id === p.id);
        const expiresAt = new Date();
        
        if (plan?.interval === 'MONTH') {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else if (plan?.interval === 'YEAR') {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }

        const status: SubscriptionStatus = {
          tier: 'premium',
          features: PREMIUM_FEATURES,
          expiresAt,
          isActive: true,
          paypalSubscriptionId: subscriptionId,
        };

        await saveSubscriptionStatus(status);
        console.log('[Subscription] PayPal subscription activated');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[Subscription] Error confirming subscription:', error);
      throw error;
    }
  };

  const cancelSubscription = async () => {
    try {
      if (!subscriptionStatus.paypalSubscriptionId) {
        throw new Error('No active subscription');
      }

      await cancelPayPalSubscription(subscriptionStatus.paypalSubscriptionId);
      
      const status: SubscriptionStatus = {
        tier: 'free',
        features: FREE_FEATURES,
        expiresAt: null,
        isActive: true,
      };

      await saveSubscriptionStatus(status);
      console.log('[Subscription] Subscription cancelled');
    } catch (error) {
      console.error('[Subscription] Error cancelling subscription:', error);
      throw error;
    }
  };

  const manageSubscription = () => {
    const url = __DEV__
      ? 'https://www.sandbox.paypal.com/myaccount/autopay/'
      : 'https://www.paypal.com/myaccount/autopay/';
    
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
    } else {
      console.log('[Subscription] Open PayPal management:', url);
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
    isPremium: subscriptionStatus.tier === 'premium' || isDemoMode,
    plans,
    purchaseSubscription,
    confirmSubscription,
    cancelSubscription,
    manageSubscription,
    checkFeatureAccess,
    getFeatureLimit,
  };
});
