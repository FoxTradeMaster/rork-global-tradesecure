// template
import { Tabs } from "expo-router";
import { LayoutDashboard, Users, FileText, TrendingUp, Building, Settings } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
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
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trades"
        options={{
          title: "Trades",
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="counterparties"
        options={{
          title: "Counterparties",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: "Documents",
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Market",
          tabBarIcon: ({ color }) => <Building size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
