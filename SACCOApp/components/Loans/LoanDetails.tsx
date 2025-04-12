import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

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

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

// Mock payment history - replace with actual API data
const MOCK_PAYMENT_HISTORY: Payment[] = [
  {
    id: '1',
    date: '2024-02-15',
    amount: 850000,
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-01-15',
    amount: 850000,
    status: 'completed',
  },
  {
    id: '3',
    date: '2023-12-15',
    amount: 850000,
    status: 'completed',
  },
];

interface LoanDetailsProps {
  loan: Loan;
  onClose: () => void;
}

export function LoanDetails({ loan, onClose }: LoanDetailsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formatAmount = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  const formatDate = (date?: string) => {
    return date ? new Date(date).toLocaleDateString() : '';
  };

  return (
    <View style={styles.modalContainer}>
      <ThemedView 
        style={styles.modalContent}
        lightColor="#ffffff"
        darkColor="#1e293b"
      >
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText 
                type="title" 
                style={styles.title}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                Loan Details
              </ThemedText>
              <ThemedText 
                style={styles.subtitle}
                lightColor="#64748b"
                darkColor="#94a3b8"
              >
                {loan.status === 'active' ? 'Active Loan' : 
                 loan.status === 'pending' ? 'Pending Approval' : 
                 'Completed Loan'}
              </ThemedText>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <ThemedText 
                style={styles.closeButtonText}
                lightColor="#64748b"
                darkColor="#94a3b8"
              >
                ✕
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Loan Summary */}
          <View style={styles.section}>
            <ThemedText 
              style={styles.sectionTitle}
              lightColor="#1e293b"
              darkColor="#f8fafc"
            >
              Loan Summary
            </ThemedText>
            <ThemedView 
              style={styles.summaryCard}
              lightColor="#f8fafc"
              darkColor="#0f172a"
            >
              <View style={styles.summaryRow}>
                <ThemedText 
                  style={styles.summaryLabel}
                  lightColor="#64748b"
                  darkColor="#94a3b8"
                >
                  Amount Borrowed
                </ThemedText>
                <ThemedText 
                  style={styles.summaryValue}
                  lightColor="#1e293b"
                  darkColor="#f8fafc"
                >
                  {formatAmount(loan.amount)}
                </ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText 
                  style={styles.summaryLabel}
                  lightColor="#64748b"
                  darkColor="#94a3b8"
                >
                  Loan Type
                </ThemedText>
                <ThemedText 
                  style={styles.summaryValue}
                  lightColor="#1e293b"
                  darkColor="#f8fafc"
                >
                  {loan.loan_type.charAt(0).toUpperCase() + loan.loan_type.slice(1)} Loan
                </ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText 
                  style={styles.summaryLabel}
                  lightColor="#64748b"
                  darkColor="#94a3b8"
                >
                  Purpose
                </ThemedText>
                <ThemedText 
                  style={styles.summaryValue}
                  lightColor="#1e293b"
                  darkColor="#f8fafc"
                >
                  {loan.purpose}
                </ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText 
                  style={styles.summaryLabel}
                  lightColor="#64748b"
                  darkColor="#94a3b8"
                >
                  Repayment Period
                </ThemedText>
                <ThemedText 
                  style={styles.summaryValue}
                  lightColor="#1e293b"
                  darkColor="#f8fafc"
                >
                  {loan.repayment_period} months
                </ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText 
                  style={styles.summaryLabel}
                  lightColor="#64748b"
                  darkColor="#94a3b8"
                >
                  Interest Rate
                </ThemedText>
                <ThemedText 
                  style={styles.summaryValue}
                  lightColor="#1e293b"
                  darkColor="#f8fafc"
                >
                  {loan.interest_rate}%
                </ThemedText>
              </View>
              {loan.status === 'active' && loan.balance_remaining !== undefined && (
                <>
                  <View style={styles.summaryRow}>
                    <ThemedText 
                      style={styles.summaryLabel}
                      lightColor="#64748b"
                      darkColor="#94a3b8"
                    >
                      Balance Left
                    </ThemedText>
                    <ThemedText 
                      style={styles.summaryValue}
                      lightColor="#1e293b"
                      darkColor="#f8fafc"
                    >
                      {formatAmount(loan.balance_remaining)}
                    </ThemedText>
                  </View>
                  {loan.next_payment_amount && (
                    <View style={styles.summaryRow}>
                      <ThemedText 
                        style={styles.summaryLabel}
                        lightColor="#64748b"
                        darkColor="#94a3b8"
                      >
                        Next Payment
                      </ThemedText>
                      <ThemedText 
                        style={styles.summaryValue}
                        lightColor="#1e293b"
                        darkColor="#f8fafc"
                      >
                        {formatAmount(loan.next_payment_amount)}
                      </ThemedText>
                    </View>
                  )}
                  {loan.next_payment_date && (
                    <View style={styles.summaryRow}>
                      <ThemedText 
                        style={styles.summaryLabel}
                        lightColor="#64748b"
                        darkColor="#94a3b8"
                      >
                        Due Date
                      </ThemedText>
                      <ThemedText 
                        style={styles.summaryValue}
                        lightColor="#1e293b"
                        darkColor="#f8fafc"
                      >
                        {formatDate(loan.next_payment_date)}
                      </ThemedText>
                    </View>
                  )}
                </>
              )}
              {loan.created_at && (
                <View style={styles.summaryRow}>
                  <ThemedText 
                    style={styles.summaryLabel}
                    lightColor="#64748b"
                    darkColor="#94a3b8"
                  >
                    Start Date
                  </ThemedText>
                  <ThemedText 
                    style={styles.summaryValue}
                    lightColor="#1e293b"
                    darkColor="#f8fafc"
                  >
                    {formatDate(loan.created_at)}
                  </ThemedText>
                </View>
              )}
              {loan.completed_at && (
                <View style={styles.summaryRow}>
                  <ThemedText 
                    style={styles.summaryLabel}
                    lightColor="#64748b"
                    darkColor="#94a3b8"
                  >
                    End Date
                  </ThemedText>
                  <ThemedText 
                    style={styles.summaryValue}
                    lightColor="#1e293b"
                    darkColor="#f8fafc"
                  >
                    {formatDate(loan.completed_at)}
                  </ThemedText>
                </View>
              )}
            </ThemedView>
          </View>

          {/* Payment History */}
          {loan.status !== 'pending' && (
            <View style={styles.section}>
              <ThemedText 
                style={styles.sectionTitle}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                Payment History
              </ThemedText>
              <View style={styles.paymentsList}>
                {MOCK_PAYMENT_HISTORY.map((payment) => (
                  <ThemedView 
                    key={payment.id}
                    style={styles.paymentCard}
                    lightColor="#f8fafc"
                    darkColor="#0f172a"
                  >
                    <View style={styles.paymentHeader}>
                      <ThemedText 
                        style={styles.paymentAmount}
                        lightColor="#1e293b"
                        darkColor="#f8fafc"
                      >
                        {formatAmount(payment.amount)}
                      </ThemedText>
                      <View style={[
                        styles.paymentStatus,
                        { backgroundColor: isDark ? '#065f46' : '#d1fae5' }
                      ]}>
                        <ThemedText style={[
                          styles.paymentStatusText,
                          { color: isDark ? '#34d399' : '#059669' }
                        ]}>
                          Paid
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText 
                      style={styles.paymentDate}
                      lightColor="#64748b"
                      darkColor="#94a3b8"
                    >
                      {formatDate(payment.date)}
                    </ThemedText>
                  </ThemedView>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        {loan.status === 'active' && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionButtonGradient}
              >
                <ThemedText style={styles.actionButtonText}>
                  Make Payment
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  paymentsList: {
    gap: 12,
  },
  paymentCard: {
    borderRadius: 16,
    padding: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  paymentStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentDate: {
    fontSize: 14,
  },
  actions: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 