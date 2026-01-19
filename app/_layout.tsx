import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { TradingProvider } from "@/contexts/TradingContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { MarketProvider } from "@/contexts/MarketContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { AIMarketUpdaterProvider } from "@/contexts/AIMarketUpdaterContext";
import { trpc, trpcClient } from "@/lib/trpc";
import { loadImportedParticipants } from "@/mocks/market-participants";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5000,
    },
  },
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        console.log('[RootLayout] 🚀 Initializing app...');
        await loadImportedParticipants();
        console.log('[RootLayout] ✅ Preloaded market participants');
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('[RootLayout] ❌ Error during initialization:', error);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    };

    prepare().catch(err => {
      console.error('[RootLayout] Uncaught preparation error:', err);
      setIsReady(true);
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0E27' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <AdminAuthProvider>
          <TradingProvider>
            <SubscriptionProvider>
              <MarketProvider>
                <AIMarketUpdaterProvider>
                  <Slot />
                </AIMarketUpdaterProvider>
              </MarketProvider>
            </SubscriptionProvider>
          </TradingProvider>
        </AdminAuthProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}
