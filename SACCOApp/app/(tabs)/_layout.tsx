import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '../../hooks/useColorScheme';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, Pressable, View, Text } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import DrawerMenu from '../../components/DrawerMenu';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // Simulated notification counts - in a real app, these would come from your API or state management
  const [loanNotifications, setLoanNotifications] = useState(2);
  const [messageNotifications, setMessageNotifications] = useState(3);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const openDrawer = () => setIsDrawerVisible(true);
  const closeDrawer = () => setIsDrawerVisible(false);

  return (
    <>
      <DrawerMenu isVisible={isDrawerVisible} onClose={closeDrawer} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#6366f1', 
          tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
          tabBarStyle: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            elevation: 0,
            shadowOpacity: 0.1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#334155' : '#e2e8f0',
          },
          headerStyle: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            elevation: 0,
            shadowOpacity: 0.1,
          },
          headerTintColor: isDark ? '#f8fafc' : '#1e293b',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          // Add menu button to header
          headerLeft: () => (
            <Pressable onPress={openDrawer} style={{ marginLeft: 16 }}>
              <Ionicons 
                name="menu-outline" 
                size={24} 
                color={isDark ? '#f8fafc' : '#1e293b'} 
              />
            </Pressable>
          ),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
            href: {
              pathname: "/dashboard",
            },
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="loans"
          options={{
            title: 'Loans',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cash-multiple" size={24} color={color} />,
            tabBarBadge: loanNotifications > 0 ? loanNotifications : undefined,
            tabBarBadgeStyle: {
              backgroundColor: '#ef4444',
              fontSize: 10,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              lineHeight: 16,
            },
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={24} color={color} />,
            tabBarBadge: messageNotifications > 0 ? messageNotifications : undefined,
            tabBarBadgeStyle: {
              backgroundColor: '#ef4444',
              fontSize: 10,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              lineHeight: 16,
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
