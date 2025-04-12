import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { LoanDetails } from '../../components/Loans/LoanDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedView = Animated.createAnimatedComponent(View);

type LoanStatus = 'active' | 'pending' | 'completed';

interface Loan {
  id: string;
  loan_type: string;
  amount: number;
  purpose: string;
  repayment_period: number;
  interest_rate: number;
  status: LoanStatus;
  created_at: string;
  approved_at?: string;
  completed_at?: string;
  balance_remaining?: number;
  next_payment_date?: string;
  next_payment_amount?: number;
}

export default function Loans() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get auth token from storage
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        setError('You need to be logged in to view your loans');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/loan-applications/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching loans: ${response.statusText}`);
      }

      const data = await response.json();
      setLoans(data);
    } catch (err) {
      console.error('Failed to fetch loans:', err);
      setError('Failed to load your loans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: LoanStatus) => {
    switch (status) {
      case 'active':
        return {
          bg: isDark ? '#065f46' : '#d1fae5',
          text: isDark ? '#34d399' : '#059669',
        };
      case 'pending':
        return {
          bg: isDark ? '#854d0e' : '#fef3c7',
          text: isDark ? '#fbbf24' : '#d97706',
        };
      case 'completed':
        return {
          bg: isDark ? '#1e3a8a' : '#dbeafe',
          text: isDark ? '#60a5fa' : '#2563eb',
        };
      default:
        return {
          bg: isDark ? '#1f2937' : '#f3f4f6',
          text: isDark ? '#9ca3af' : '#6b7280',
        };
    }
  };

  const formatAmount = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  const formatDate = (date?: string) => {
    return date ? new Date(date).toLocaleDateString() : '';
  };

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
          {/* Header */}
          <AnimatedView entering={FadeInUp.duration(1000)} style={styles.header}>
            <View>
              <ThemedText type="title" style={styles.title}>
                Your Loans
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Manage and track all your loans
              </ThemedText>
            </View>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => router.push('loans/apply' as any)}
            >
              <LinearGradient
                colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <ThemedText style={styles.buttonText}>
                  Apply for Loan
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </AnimatedView>

          {/* Loading State */}
          {loading && (
            <AnimatedView entering={FadeInUp.duration(1000)} style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={isDark ? '#8b5cf6' : '#4f46e5'} />
              <ThemedText style={styles.loadingText}>Loading your loans...</ThemedText>
            </AnimatedView>
          )}

          {/* Error State */}
          {error && !loading && (
            <AnimatedView entering={FadeInUp.duration(1000)} style={styles.errorContainer}>
              <ThemedText style={styles.errorText} lightColor="#ef4444" darkColor="#f87171">
                {error}
              </ThemedText>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchLoans}
              >
                <ThemedText style={styles.retryText} lightColor="#4f46e5" darkColor="#818cf8">
                  Retry
                </ThemedText>
              </TouchableOpacity>
            </AnimatedView>
          )}

          {/* Loans List */}
          {!loading && !error && loans.length === 0 && (
            <AnimatedView entering={FadeInUp.duration(1000)} style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                You don't have any loans yet
              </ThemedText>
              <TouchableOpacity 
                style={styles.applyButtonLarge}
                onPress={() => router.push('loans/apply' as any)}
              >
                <LinearGradient
                  colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <ThemedText style={styles.buttonText}>
                    Apply for your first loan
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </AnimatedView>
          )}

          {!loading && !error && loans.length > 0 && (
            <AnimatedView entering={FadeInUp.duration(1000).delay(300)} style={styles.loansList}>
              {loans.map((loan) => (
                <TouchableOpacity
                  key={loan.id}
                  onPress={() => setSelectedLoan(loan)}
                >
                  <ThemedView 
                    style={styles.loanCard}
                    lightColor="#ffffff"
                    darkColor="#1e293b"
                  >
                    <View style={styles.loanCardHeader}>
                      <ThemedText 
                        type="subtitle" 
                        style={styles.loanAmount}
                        lightColor="#1e293b"
                        darkColor="#f8fafc"
                      >
                        {formatAmount(loan.amount)}
                      </ThemedText>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(loan.status).bg }
                      ]}>
                        <ThemedText style={[
                          styles.statusText,
                          { color: getStatusColor(loan.status).text }
                        ]}>
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.loanCardContent}>
                      {loan.status === 'active' && (
                        <>
                          <View style={styles.loanDetail}>
                            <ThemedText 
                              style={styles.detailLabel}
                              lightColor="#64748b"
                              darkColor="#94a3b8"
                            >
                              Purpose
                            </ThemedText>
                            <ThemedText 
                              style={styles.detailValue}
                              lightColor="#1e293b"
                              darkColor="#f8fafc"
                            >
                              {loan.purpose}
                            </ThemedText>
                          </View>
                          <View style={styles.loanDetail}>
                            <ThemedText 
                              style={styles.detailLabel}
                              lightColor="#64748b"
                              darkColor="#94a3b8"
                            >
                              Repayment Period
                            </ThemedText>
                            <ThemedText 
                              style={styles.detailValue}
                              lightColor="#1e293b"
                              darkColor="#f8fafc"
                            >
                              {loan.repayment_period} months
                            </ThemedText>
                          </View>
                          <View style={styles.loanDetail}>
                            <ThemedText 
                              style={styles.detailLabel}
                              lightColor="#64748b"
                              darkColor="#94a3b8"
                            >
                              Balance Left
                            </ThemedText>
                            <ThemedText 
                              style={styles.detailValue}
                              lightColor="#1e293b"
                              darkColor="#f8fafc"
                            >
                              {loan.balance_remaining ? formatAmount(loan.balance_remaining) : ''}
                            </ThemedText>
                          </View>
                          <View style={styles.loanDetail}>
                            <ThemedText 
                              style={styles.detailLabel}
                              lightColor="#64748b"
                              darkColor="#94a3b8"
                            >
                              Next Payment
                            </ThemedText>
                            <ThemedText 
                              style={styles.detailValue}
                              lightColor="#1e293b"
                              darkColor="#f8fafc"
                            >
                              {formatDate(loan.next_payment_date)}
                            </ThemedText>
                          </View>
                        </>
                      )}
                      {loan.status === 'pending' && (
                        <>
                          <View style={styles.loanDetail}>
                            <ThemedText 
                              style={styles.detailLabel}
                              lightColor="#64748b"
                              darkColor="#94a3b8"
                            >
                              Purpose
                            </ThemedText>
                            <ThemedText 
                              style={styles.detailValue}
                              lightColor="#1e293b"
                              darkColor="#f8fafc"
                            >
                              {loan.purpose}
                            </ThemedText>
                          </View>
                          <View style={styles.loanDetail}>
                            <ThemedText 
                              style={styles.detailLabel}
                              lightColor="#64748b"
                              darkColor="#94a3b8"
                            >
                              Repayment Period
                            </ThemedText>
                            <ThemedText 
                              style={styles.detailValue}
                              lightColor="#1e293b"
                              darkColor="#f8fafc"
                            >
                              {loan.repayment_period} months
                            </ThemedText>
                          </View>
                          <View style={styles.loanDetail}>
                            <ThemedText 
                              style={styles.detailLabel}
                              lightColor="#64748b"
                              darkColor="#94a3b8"
                            >
                              Requested On
                            </ThemedText>
                            <ThemedText 
                              style={styles.detailValue}
                              lightColor="#1e293b"
                              darkColor="#f8fafc"
                            >
                              {formatDate(loan.created_at)}
                            </ThemedText>
                          </View>
                        </>
                      )}
                      {loan.status === 'completed' && (
                        <>
                          <View style={styles.loanDetail}>
                            <ThemedText 
                              style={styles.detailLabel}
                              lightColor="#64748b"
                              darkColor="#94a3b8"
                            >
                              Purpose
                            </ThemedText>
                            <ThemedText 
                              style={styles.detailValue}
                              lightColor="#1e293b"
                              darkColor="#f8fafc"
                            >
                              {loan.purpose}
                            </ThemedText>
                          </View>
                          <View style={styles.loanDetail}>
                            <ThemedText 
                              style={styles.detailLabel}
                              lightColor="#64748b"
                              darkColor="#94a3b8"
                            >
                              Repayment Period
                            </ThemedText>
                            <ThemedText 
                              style={styles.detailValue}
                              lightColor="#1e293b"
                              darkColor="#f8fafc"
                            >
                              {loan.repayment_period} months
                            </ThemedText>
                          </View>
                          <View style={styles.loanDetail}>
                            <ThemedText 
                              style={styles.detailLabel}
                              lightColor="#64748b"
                              darkColor="#94a3b8"
                            >
                              Completed On
                            </ThemedText>
                            <ThemedText 
                              style={styles.detailValue}
                              lightColor="#1e293b"
                              darkColor="#f8fafc"
                            >
                              {formatDate(loan.completed_at)}
                            </ThemedText>
                          </View>
                        </>
                      )}
                    </View>
                  </ThemedView>
                </TouchableOpacity>
              ))}
            </AnimatedView>
          )}
        </View>

        {/* Loan Details Modal */}
        <Modal
          visible={selectedLoan !== null}
          animationType="slide"
          onRequestClose={() => setSelectedLoan(null)}
          transparent={true}
        >
          {selectedLoan && (
            <LoanDetails
              loan={selectedLoan}
              onClose={() => setSelectedLoan(null)}
            />
          )}
        </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    opacity: 0.8,
  },
  applyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loansList: {
    gap: 16,
  },
  loanCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loanCardContent: {
    gap: 12,
  },
  loanDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  applyButtonLarge: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '70%',
    maxWidth: 300,
  },
}); 