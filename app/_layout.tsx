import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { TradingProvider } from "@/contexts/TradingContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { MarketProvider } from "@/contexts/MarketContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { AIMarketUpdaterProvider } from "@/contexts/AIMarketUpdaterContext";
import { trpc, trpcClient } from "@/lib/trpc";
import { loadImportedParticipants } from "@/mocks/market-participants";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <AdminAuthProvider>
          <TradingProvider>
            <SubscriptionProvider>
              <MarketProvider>
                <AIMarketUpdaterProvider>
                  {children}
                </AIMarketUpdaterProvider>
              </MarketProvider>
            </SubscriptionProvider>
          </TradingProvider>
        </AdminAuthProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="counterparty/[id]" 
        options={{ 
          presentation: "card",
          headerShown: true,
          title: "Counterparty Details"
        }} 
      />
      <Stack.Screen 
        name="trade/[id]" 
        options={{ 
          presentation: "card",
          headerShown: true,
          title: "Trade Details"
        }} 
      />
      <Stack.Screen 
        name="trade/create" 
        options={{ 
          presentation: "modal",
          headerShown: true,
          title: "New Trade",
          headerStyle: {
            backgroundColor: '#0A0E27',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            color: '#FFFFFF',
          },
        }} 
      />
      <Stack.Screen 
        name="user-manual" 
        options={{ 
          presentation: "card",
          headerShown: true,
          title: "User Manual",
          headerStyle: {
            backgroundColor: '#0A0E27',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="support" 
        options={{ 
          presentation: "card",
          headerShown: true,
          title: "Support"
        }} 
      />
      <Stack.Screen 
        name="privacy-policy" 
        options={{ 
          presentation: "card",
          headerShown: true,
          title: "Privacy Policy"
        }} 
      />
      <Stack.Screen 
        name="terms-of-service" 
        options={{ 
          presentation: "card",
          headerShown: true,
          title: "Terms of Service"
        }} 
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
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
        SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  );
}
