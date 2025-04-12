import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
// Import the global.css file in the index.js file:
import '../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
          },
          headerTintColor: isDark ? '#f8fafc' : '#1e293b',
          headerBackTitle: 'Back',
          headerLeft: ({ canGoBack }) => 
            canGoBack ? (
              <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
                <FontAwesome name="arrow-left" size={18} color={isDark ? '#f8fafc' : '#1e293b'} />
              </Pressable>
            ) : null,
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: 'My Profile' }} />
        <Stack.Screen name="loans" options={{ title: 'Loan Management' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
