// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TradingProvider } from "@/contexts/TradingContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { MarketProvider } from "@/contexts/MarketContext";
import { AIMarketUpdaterProvider } from "@/contexts/AIMarketUpdaterContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { trpc, trpcClient } from "@/lib/trpc";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

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
          title: "New Trade"
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
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AdminAuthProvider>
          <SubscriptionProvider>
            <TradingProvider>
              <MarketProvider>
                <AIMarketUpdaterProvider>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    {isReady ? <RootLayoutNav /> : null}
                  </GestureHandlerRootView>
                </AIMarketUpdaterProvider>
              </MarketProvider>
            </TradingProvider>
          </SubscriptionProvider>
        </AdminAuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
