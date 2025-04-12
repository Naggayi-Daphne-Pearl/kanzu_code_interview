import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { HelloWave } from '@/components/HelloWave';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function Dashboard() {
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
          {/* Welcome Section */}
          <AnimatedView entering={FadeInDown.duration(1000)} style={styles.welcomeSection}>
            <View style={styles.titleRow}>
              <ThemedText type="title" style={styles.welcomeTitle}>
                Welcome Back, John
              </ThemedText>
              <HelloWave />
            </View>
            <ThemedText style={styles.welcomeSubtitle}>
              Here's an overview of your account
            </ThemedText>
          </AnimatedView>

          {/* Summary Cards */}
          <AnimatedView 
            entering={FadeInUp.duration(1000).delay(300)} 
            style={styles.summaryGrid}
          >
            {/* Total Savings Card */}
            <ThemedView 
              style={styles.summaryCard}
              lightColor="#ffffff"
              darkColor="#1e293b"
            >
              <View style={[
                styles.iconContainer, 
                isDark ? styles.blueGradientDark : styles.blueGradient
              ]}>
                <ThemedText style={styles.iconText}>💰</ThemedText>
              </View>
              <ThemedText 
                style={styles.cardLabel}
                lightColor="#64748b"
                darkColor="#94a3b8"
              >
                Total Savings
              </ThemedText>
              <ThemedText 
                type="subtitle" 
                style={styles.cardValue}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                UGX 2,500,000
              </ThemedText>
            </ThemedView>

            {/* Active Loans Card */}
            <ThemedView 
              style={styles.summaryCard}
              lightColor="#ffffff"
              darkColor="#1e293b"
            >
              <View style={[
                styles.iconContainer, 
                isDark ? styles.purpleGradientDark : styles.purpleGradient
              ]}>
                <ThemedText style={styles.iconText}>💳</ThemedText>
              </View>
              <ThemedText 
                style={styles.cardLabel}
                lightColor="#64748b"
                darkColor="#94a3b8"
              >
                Active Loans
              </ThemedText>
              <ThemedText 
                type="subtitle" 
                style={styles.cardValue}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                1 Active
              </ThemedText>
            </ThemedView>

            {/* Next Payment Card */}
            <ThemedView 
              style={styles.summaryCard}
              lightColor="#ffffff"
              darkColor="#1e293b"
            >
              <View style={[
                styles.iconContainer, 
                isDark ? styles.greenGradientDark : styles.greenGradient
              ]}>
                <ThemedText style={styles.iconText}>⏳</ThemedText>
              </View>
              <ThemedText 
                style={styles.cardLabel}
                lightColor="#64748b"
                darkColor="#94a3b8"
              >
                Next Payment Due
              </ThemedText>
              <ThemedText 
                type="subtitle" 
                style={styles.cardValue}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                15th March 2024
              </ThemedText>
            </ThemedView>
          </AnimatedView>

          {/* Quick Actions */}
          <AnimatedView entering={FadeInUp.duration(1000).delay(600)} style={styles.quickActions}>
            <ThemedText 
              type="subtitle" 
              style={styles.sectionTitle}
              lightColor="#1e293b"
              darkColor="#f8fafc"
            >
              Quick Actions
            </ThemedText>
            
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/loans/apply')}
              >
                <LinearGradient
                  colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionButtonGradient}
                >
                  <ThemedText style={styles.actionButtonText}>
                    Apply for Loan
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/loans')}
              >
                <LinearGradient
                  colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionButtonGradient}
                >
                  <ThemedText style={styles.actionButtonText}>
                    View Loans
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                // onPress={() => router.push('/savings/history')}
              >
                <LinearGradient
                  colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionButtonGradient}
                >
                  <ThemedText style={styles.actionButtonText}>
                    View Savings History
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
    height: 300,
    opacity: 0.1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  welcomeSection: {
    marginBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  welcomeSubtitle: {
    fontSize: 18,
    marginTop: 8,
    opacity: 0.8,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 40,
  },
  summaryCard: {
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
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  blueGradient: {
    backgroundColor: '#dbeafe',
  },
  blueGradientDark: {
    backgroundColor: '#1e3a8a',
  },
  purpleGradient: {
    backgroundColor: '#f3e8ff',
  },
  purpleGradientDark: {
    backgroundColor: '#4c1d95',
  },
  greenGradient: {
    backgroundColor: '#dcfce7',
  },
  greenGradientDark: {
    backgroundColor: '#064e3b',
  },
  iconText: {
    fontSize: 24,
  },
  cardLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  quickActions: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  actionButtonsContainer: {
    gap: 16,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 