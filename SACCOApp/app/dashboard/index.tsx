import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { HelloWave } from '@/components/HelloWave';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

const AnimatedView = Animated.createAnimatedComponent(View);

// Define the data types for API response
interface DashboardData {
  user_info: {
    name: string;
    monthly_income: number;
    employment_status: string;
  };
  loan_summary: {
    total_loans: number;
    active_loans: number;
    total_loan_amount: number;
    monthly_payments: number;
  };
  recent_transactions: any[];
  active_loans_details: any[];
  pending_applications: {
    id: number;
    user: number;
    user_name: string;
    loan_type: string;
    amount: string;
    status: string;
    purpose: string;
    created_at: string;
    approved_at: null | string;
    repayment_period: number;
    interest_rate: string;
    monthly_payment: number;
  }[];
}

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/dashboard/');
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency function
  const formatCurrency = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-UG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer} lightColor="#f8fafc" darkColor="#0f172a">
        <ActivityIndicator size="large" color="#6366f1" />
        <ThemedText style={styles.loadingText}>Loading your dashboard...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer} lightColor="#f8fafc" darkColor="#0f172a">
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchDashboardData}
        >
          <LinearGradient
            colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionButtonGradient}
          >
            <ThemedText style={styles.actionButtonText}>
              Retry
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ThemedView>
    );
  }

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
                Welcome Back, {dashboardData?.user_info.name || 'Member'}
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
            {/* Total Loans Card */}
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
                Total Loans
              </ThemedText>
              <ThemedText 
                type="subtitle" 
                style={styles.cardValue}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                {dashboardData?.loan_summary.total_loans || 0}
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
                {dashboardData?.loan_summary.active_loans || 0}
              </ThemedText>
            </ThemedView>

            {/* Monthly Payments Card */}
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
                Monthly Payment
              </ThemedText>
              <ThemedText 
                type="subtitle" 
                style={styles.cardValue}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                {formatCurrency(dashboardData?.loan_summary.monthly_payments || 0)}
              </ThemedText>
            </ThemedView>
          </AnimatedView>

          {/* Pending Applications */}
          {dashboardData?.pending_applications && dashboardData.pending_applications.length > 0 && (
            <AnimatedView entering={FadeInUp.duration(1000).delay(400)} style={styles.pendingApplications}>
              <ThemedText 
                type="subtitle" 
                style={styles.sectionTitle}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                Pending Applications
              </ThemedText>
              
              {dashboardData.pending_applications.map((application, index) => (
                <ThemedView 
                  key={application.id}
                  style={styles.applicationCard}
                  lightColor="#ffffff"
                  darkColor="#1e293b"
                >
                  <View style={styles.applicationHeader}>
                    <ThemedText 
                      style={styles.applicationType}
                      lightColor="#1e293b"
                      darkColor="#f8fafc"
                    >
                      {application.loan_type.charAt(0).toUpperCase() + application.loan_type.slice(1)} Loan
                    </ThemedText>
                    <View style={[styles.statusBadge, styles.pendingBadge]}>
                      <ThemedText style={styles.statusText}>
                        Pending
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.applicationDetails}>
                    <View style={styles.detailRow}>
                      <ThemedText 
                        style={styles.detailLabel}
                        lightColor="#64748b"
                        darkColor="#94a3b8"
                      >
                        Amount:
                      </ThemedText>
                      <ThemedText 
                        style={styles.detailValue}
                        lightColor="#1e293b"
                        darkColor="#f8fafc"
                      >
                        {formatCurrency(parseFloat(application.amount))}
                      </ThemedText>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <ThemedText 
                        style={styles.detailLabel}
                        lightColor="#64748b"
                        darkColor="#94a3b8"
                      >
                        Purpose:
                      </ThemedText>
                      <ThemedText 
                        style={styles.detailValue}
                        lightColor="#1e293b"
                        darkColor="#f8fafc"
                      >
                        {application.purpose}
                      </ThemedText>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <ThemedText 
                        style={styles.detailLabel}
                        lightColor="#64748b"
                        darkColor="#94a3b8"
                      >
                        Applied on:
                      </ThemedText>
                      <ThemedText 
                        style={styles.detailValue}
                        lightColor="#1e293b"
                        darkColor="#f8fafc"
                      >
                        {formatDate(application.created_at)}
                      </ThemedText>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <ThemedText 
                        style={styles.detailLabel}
                        lightColor="#64748b"
                        darkColor="#94a3b8"
                      >
                        Term:
                      </ThemedText>
                      <ThemedText 
                        style={styles.detailValue}
                        lightColor="#1e293b"
                        darkColor="#f8fafc"
                      >
                        {application.repayment_period} months at {application.interest_rate}% interest
                      </ThemedText>
                    </View>
                  </View>
                </ThemedView>
              ))}
            </AnimatedView>
          )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: 150,
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
  pendingApplications: {
    marginBottom: 40,
  },
  applicationCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  applicationType: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '600',
  },
  applicationDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
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