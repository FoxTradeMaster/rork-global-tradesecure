// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TradingProvider } from "@/contexts/TradingContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="role-select" options={{ headerShown: false }} />
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
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SubscriptionProvider>
        <TradingProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </TradingProvider>
      </SubscriptionProvider>
    </QueryClientProvider>
  );
}
