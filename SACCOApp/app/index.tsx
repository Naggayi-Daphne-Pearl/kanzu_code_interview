import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { HelloWave } from '@/components/HelloWave';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function Index() {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <ScrollView>
      <ThemedView style={styles.container} lightColor="#f8fafc" darkColor="#0f172a">
        <LinearGradient
          colors={['#4f46e5', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backgroundGradient}
        />

        <View style={styles.contentContainer}>
          {/* Hero Section */}
          <AnimatedView entering={FadeInDown.duration(1000)} style={styles.heroSection}>
            <LinearGradient
              colors={['#4f46e5', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.heroContent}>
                <View style={styles.titleContainer}>
                  <View style={styles.titleRow}>
                    <ThemedText type="title" style={styles.heroTitle}>
                      Welcome to SACCO
                    </ThemedText>
                    <HelloWave />
                  </View>
                  <ThemedText style={styles.heroSubtitle}>
                    Your trusted partner in financial growth
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </AnimatedView>

          {/* Features Grid */}
          <AnimatedView 
            entering={FadeInUp.duration(1000).delay(300)} 
            style={styles.featuresGrid}
          >
            {/* Feature Card 1 */}
            <ThemedView 
              style={styles.featureCard}
              lightColor="#ffffff"
              darkColor="#1e293b"
            >
              <View style={[
                styles.iconContainer, 
                isDark ? styles.blueGradientDark : styles.blueGradient
              ]}>
                <Text style={styles.iconText}>💰</Text>
              </View>
              <ThemedText 
                type="subtitle" 
                style={styles.featureTitle}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                Easy Savings
              </ThemedText>
              <ThemedText 
                style={styles.featureDescription}
                lightColor="#64748b"
                darkColor="#94a3b8"
              >
                Start saving with just a few taps. Set goals and track your progress.
              </ThemedText>
            </ThemedView>

            {/* Feature Card 2 */}
            <ThemedView 
              style={styles.featureCard}
              lightColor="#ffffff"
              darkColor="#1e293b"
            >
              <View style={[
                styles.iconContainer, 
                isDark ? styles.greenGradientDark : styles.greenGradient
              ]}>
                <Text style={styles.iconText}>💳</Text>
              </View>
              <ThemedText 
                type="subtitle" 
                style={styles.featureTitle}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                Quick Loans
              </ThemedText>
              <ThemedText 
                style={styles.featureDescription}
                lightColor="#64748b"
                darkColor="#94a3b8"
              >
                Access loans easily with competitive rates and flexible terms.
              </ThemedText>
            </ThemedView>

            {/* Feature Card 3 */}
            <ThemedView 
              style={styles.featureCard}
              lightColor="#ffffff"
              darkColor="#1e293b"
            >
              <View style={[
                styles.iconContainer, 
                isDark ? styles.purpleGradientDark : styles.purpleGradient
              ]}>
                <Text style={styles.iconText}>🔒</Text>
              </View>
              <ThemedText 
                type="subtitle" 
                style={styles.featureTitle}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                Secure Platform
              </ThemedText>
              <ThemedText 
                style={styles.featureDescription}
                lightColor="#64748b"
                darkColor="#94a3b8"
              >
                Your finances are protected with state-of-the-art security.
              </ThemedText>
            </ThemedView>
          </AnimatedView>

          {/* CTA Section */}
          <AnimatedView entering={FadeInUp.duration(1000).delay(600)} style={styles.ctaContainer}>
            <LinearGradient
              colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.ctaContent}>
                <ThemedText style={styles.ctaTitle}>
                  Ready to get started?
                </ThemedText>
                <ThemedText style={styles.ctaSubtitle}>
                  Join thousands of members already growing their savings with us.
                </ThemedText>
                <TouchableOpacity 
                  style={[styles.ctaButton, isDark && styles.ctaButtonDark]}
                  activeOpacity={0.8}
                  onPress={() => router.push('/auth/login')}
                >
                  <ThemedText style={styles.ctaButtonText}>
                    Get Started Now →
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </AnimatedView>
    </View>
      </ThemedView>
    </ScrollView>
  );
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
