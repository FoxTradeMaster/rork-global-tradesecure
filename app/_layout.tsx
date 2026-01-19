import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, Component, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
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

class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('[ErrorBoundary] Caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[ErrorBoundary] Error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View style={errorStyles.container}>
          <Text style={errorStyles.title}>Something went wrong</Text>
          <Text style={errorStyles.message}>{this.state.error?.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

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

    prepare().catch(err => {
      console.error('[RootLayout] Uncaught preparation error:', err);
      SplashScreen.hideAsync();
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <AdminAuthProvider>
          <TradingProvider>
            <SubscriptionProvider>
              <MarketProvider>
                <AIMarketUpdaterProvider>
                  <ErrorBoundary>
                    <RootLayoutNav />
                  </ErrorBoundary>
                </AIMarketUpdaterProvider>
              </MarketProvider>
            </SubscriptionProvider>
          </TradingProvider>
        </AdminAuthProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}
