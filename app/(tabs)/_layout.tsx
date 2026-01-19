import { Tabs } from "expo-router";
import { LayoutDashboard, Users, FileText, TrendingUp, Building, Settings, Wallet } from "lucide-react-native";
import React from "react";
import { useTrading } from '@/contexts/TradingContext';
import { AIMarketUpdaterProvider } from '@/contexts/AIMarketUpdaterContext';

export default function TabLayout() {
  const { currentUser } = useTrading();

  const getRoleTabs = () => {
    if (!currentUser) return ['dashboard', 'settings'];

    switch (currentUser.role) {
      case 'trade_originator':
        return ['dashboard', 'trades', 'counterparties', 'documents', 'market', 'wallet', 'settings'];
      case 'compliance_officer':
        return ['dashboard', 'trades', 'counterparties', 'documents', 'settings'];
      case 'risk_manager':
        return ['dashboard', 'trades', 'counterparties', 'settings'];
      case 'legal_reviewer':
        return ['dashboard', 'trades', 'documents', 'settings'];
      case 'senior_management':
        return ['dashboard', 'trades', 'counterparties', 'market', 'wallet', 'settings'];
      default:
        return ['dashboard', 'trades', 'settings'];
    }
  };

  const visibleTabs = getRoleTabs();

  return (
    <AIMarketUpdaterProvider>
      <Tabs
        screenOptions={{
        tabBarActiveTintColor: '#0284C7',
        tabBarInactiveTintColor: '#94A3B8',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#BAE6FD',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600' as const,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
          href: visibleTabs.includes('dashboard') ? '/dashboard' : null,
        }}
      />
      <Tabs.Screen
        name="trades"
        options={{
          title: "Trades",
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />,
          href: visibleTabs.includes('trades') ? '/trades' : null,
        }}
      />
      <Tabs.Screen
        name="counterparties"
        options={{
          title: "Counterparties",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          href: visibleTabs.includes('counterparties') ? '/counterparties' : null,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: "Documents",
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
          href: visibleTabs.includes('documents') ? '/documents' : null,
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Market",
          tabBarIcon: ({ color }) => <Building size={24} color={color} />,
          href: visibleTabs.includes('market') ? '/market' : null,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color }) => <Wallet size={24} color={color} />,
          href: visibleTabs.includes('wallet') ? '/wallet' : null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
          href: visibleTabs.includes('settings') ? '/settings' : null,
        }}
      />
      </Tabs>
    </AIMarketUpdaterProvider>
  );
}
