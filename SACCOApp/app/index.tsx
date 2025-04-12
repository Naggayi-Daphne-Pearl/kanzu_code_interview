import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { HelloWave } from '@/components/HelloWave';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router, Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function Index() {
  // Redirect to login page by default
  // After login, the auth system will redirect to the dashboard
  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 600,
    opacity: 0.1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  heroSection: {
    marginTop: 32,
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 32,
  },
  heroContent: {
    zIndex: 10,
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  heroSubtitle: {
    marginTop: 24,
    fontSize: 24,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    maxWidth: 600,
  },
  featuresGrid: {
    marginTop: 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  featureCard: {
    flex: 1,
    minWidth: 300,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  blueGradient: {
    backgroundColor: '#dbeafe',
  },
  blueGradientDark: {
    backgroundColor: '#1e3a8a',
  },
  greenGradient: {
    backgroundColor: '#dcfce7',
  },
  greenGradientDark: {
    backgroundColor: '#064e3b',
  },
  purpleGradient: {
    backgroundColor: '#f3e8ff',
  },
  purpleGradientDark: {
    backgroundColor: '#4c1d95',
  },
  iconText: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  ctaContainer: {
    marginVertical: 64,
  },
  ctaGradient: {
    borderRadius: 24,
    padding: 32,
    overflow: 'hidden',
  },
  ctaContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  ctaTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 800,
  },
  ctaSubtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 600,
  },
  ctaButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  ctaButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
