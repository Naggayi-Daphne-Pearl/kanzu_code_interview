import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { LoanApplicationForm } from '../../components/Loans/LoanApplicationForm';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedView = Animated.createAnimatedComponent(View);
const API_URL = 'http://127.0.0.1:8000/api';

interface LoanApplication {
  amount: string;
  period: number;
  reason: string;
  loan_type?: string;
}

export default function LoanApplicationPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LoanApplication>({
    amount: '',
    period: 6,
    reason: '',
    loan_type: 'personal',
  });

  // Interest rate of 15% per annum
  const ANNUAL_INTEREST_RATE = 0.15;

  const calculations = useMemo(() => {
    const amount = parseFloat(formData.amount.replace(/[^0-9.]/g, '')) || 0;
    const monthlyInterestRate = ANNUAL_INTEREST_RATE / 12;
    const numberOfPayments = formData.period;
    
    // Monthly payment calculation using the loan amortization formula
    const monthlyPayment = amount > 0 ? 
      (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1) : 0;

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - amount;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [formData.amount, formData.period]);

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Get auth token from storage
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        Alert.alert('Error', 'You need to be logged in to apply for a loan.');
        router.push('/dashboard');
        return;
      }
      
      // Parse the amount to a number
      const amountValue = parseFloat(formData.amount.replace(/[^0-9.]/g, ''));
      
      // Prepare request body
      const requestBody = {
        loan_type: formData.loan_type,
        amount: amountValue,
        purpose: formData.reason,
        repayment_period: formData.period,
        interest_rate: ANNUAL_INTEREST_RATE * 100 // Convert to percentage
      };
      
      // Make API request
      const response = await fetch(`${API_URL}/loan-applications/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error('Failed to submit loan application');
        }
      }
      
      // Show success message
      Alert.alert(
        'Success',
        'Your loan application has been submitted successfully!',
        [{ text: 'OK', onPress: () => router.push('/dashboard') }]
      );
      
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to submit loan application'
      );
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const formatAmount = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
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
                Apply for a Loan
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Fill in the details below to submit your loan application
              </ThemedText>
            </View>
          </AnimatedView>

          {/* Loan Application Form */}
          <AnimatedView entering={FadeInUp.duration(1000).delay(300)}>
            <LoanApplicationForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
            />
          </AnimatedView>

          {/* Loan Calculations */}
          {parseFloat(formData.amount.replace(/[^0-9.]/g, '')) > 0 && (
            <AnimatedView 
              entering={FadeInUp.duration(1000).delay(600)}
              style={styles.calculationsContainer}
            >
              <ThemedText 
                style={styles.calculationsTitle}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                Loan Calculations
              </ThemedText>
              <ThemedView 
                style={styles.calculationsCard}
                lightColor="#ffffff"
                darkColor="#1e293b"
              >
                <View style={styles.calculationRow}>
                  <ThemedText 
                    style={styles.calculationLabel}
                    lightColor="#64748b"
                    darkColor="#94a3b8"
                  >
                    Monthly Payment
                  </ThemedText>
                  <ThemedText 
                    style={styles.calculationValue}
                    lightColor="#1e293b"
                    darkColor="#f8fafc"
                  >
                    {formatAmount(calculations.monthlyPayment)}
                  </ThemedText>
                </View>
                <View style={styles.calculationRow}>
                  <ThemedText 
                    style={styles.calculationLabel}
                    lightColor="#64748b"
                    darkColor="#94a3b8"
                  >
                    Total Interest
                  </ThemedText>
                  <ThemedText 
                    style={styles.calculationValue}
                    lightColor="#1e293b"
                    darkColor="#f8fafc"
                  >
                    {formatAmount(calculations.totalInterest)}
                  </ThemedText>
                </View>
                <View style={styles.calculationRow}>
                  <ThemedText 
                    style={styles.calculationLabel}
                    lightColor="#64748b"
                    darkColor="#94a3b8"
                  >
                    Total Payment
                  </ThemedText>
                  <ThemedText 
                    style={styles.calculationValue}
                    lightColor="#1e293b"
                    darkColor="#f8fafc"
                  >
                    {formatAmount(calculations.totalPayment)}
                  </ThemedText>
                </View>
              </ThemedView>
            </AnimatedView>
          )}
        </View>

        {/* Confirmation Modal */}
        <Modal
          visible={showConfirmation}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowConfirmation(false)}
        >
          <View style={styles.modalContainer}>
            <ThemedView 
              style={styles.modalContent}
              lightColor="#ffffff"
              darkColor="#1e293b"
            >
              <ThemedText 
                type="title" 
                style={styles.modalTitle}
                lightColor="#1e293b"
                darkColor="#f8fafc"
              >
                Confirm Application
              </ThemedText>
              <View style={styles.modalDetails}>
                <View style={styles.modalRow}>
                  <ThemedText 
                    style={styles.modalLabel}
                    lightColor="#64748b"
                    darkColor="#94a3b8"
                  >
                    Loan Type
                  </ThemedText>
                  <ThemedText 
                    style={styles.modalValue}
                    lightColor="#1e293b"
                    darkColor="#f8fafc"
                  >
                    {formData.loan_type === 'personal' ? 'Personal Loan' : 
                     formData.loan_type === 'business' ? 'Business Loan' : 
                     formData.loan_type === 'education' ? 'Education Loan' : 
                     formData.loan_type === 'emergency' ? 'Emergency Loan' : 'Personal Loan'}
                  </ThemedText>
                </View>
                <View style={styles.modalRow}>
                  <ThemedText 
                    style={styles.modalLabel}
                    lightColor="#64748b"
                    darkColor="#94a3b8"
                  >
                    Loan Amount
                  </ThemedText>
                  <ThemedText 
                    style={styles.modalValue}
                    lightColor="#1e293b"
                    darkColor="#f8fafc"
                  >
                    {formData.amount}
                  </ThemedText>
                </View>
                <View style={styles.modalRow}>
                  <ThemedText 
                    style={styles.modalLabel}
                    lightColor="#64748b"
                    darkColor="#94a3b8"
                  >
                    Repayment Period
                  </ThemedText>
                  <ThemedText 
                    style={styles.modalValue}
                    lightColor="#1e293b"
                    darkColor="#f8fafc"
                  >
                    {formData.period} months
                  </ThemedText>
                </View>
                <View style={styles.modalRow}>
                  <ThemedText 
                    style={styles.modalLabel}
                    lightColor="#64748b"
                    darkColor="#94a3b8"
                  >
                    Monthly Payment
                  </ThemedText>
                  <ThemedText 
                    style={styles.modalValue}
                    lightColor="#1e293b"
                    darkColor="#f8fafc"
                  >
                    {formatAmount(calculations.monthlyPayment)}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                >
                  <ThemedText style={styles.modalButtonText}>
                    Cancel
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={confirmSubmit}
                  disabled={isSubmitting}
                >
                  <LinearGradient
                    colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.modalButtonGradient}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <ThemedText style={styles.modalButtonText}>
                        Confirm
                      </ThemedText>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ThemedView>
          </View>
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
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
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
  calculationsContainer: {
    marginTop: 32,
  },
  calculationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  calculationsCard: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calculationLabel: {
    fontSize: 14,
  },
  calculationValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalDetails: {
    gap: 16,
    marginBottom: 24,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalLabel: {
    fontSize: 14,
  },
  modalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 