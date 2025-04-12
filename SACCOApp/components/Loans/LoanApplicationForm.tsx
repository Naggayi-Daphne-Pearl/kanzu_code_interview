import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Picker } from '@react-native-picker/picker';

interface LoanApplication {
  amount: string;
  period: number;
  reason: string;
  loan_type?: string;
}

interface LoanApplicationFormProps {
  formData: LoanApplication;
  setFormData: (data: LoanApplication) => void;
  onSubmit: () => void;
}

export function LoanApplicationForm({ formData, setFormData, onSubmit }: LoanApplicationFormProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [errors, setErrors] = useState<Partial<Record<keyof LoanApplication, string>>>({});

  const REPAYMENT_PERIODS = [
    { label: '6 months', value: 6 },
    { label: '12 months', value: 12 },
    { label: '18 months', value: 18 },
    { label: '24 months', value: 24 },
  ];

  const LOAN_TYPES = [
    { label: 'Personal Loan', value: 'personal' },
    { label: 'Business Loan', value: 'business' },
    { label: 'Education Loan', value: 'education' },
    { label: 'Emergency Loan', value: 'emergency' },
  ];

  const MIN_AMOUNT = 500000; // UGX 500,000
  const MAX_AMOUNT = 50000000; // UGX 50,000,000

  const formatAmount = (text: string) => {
    // Remove all non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Format with commas and UGX
    if (numericValue) {
      const amount = parseInt(numericValue, 10);
      return `UGX ${amount.toLocaleString()}`;
    }
    return '';
  };

  const handleAmountChange = (text: string) => {
    const formattedAmount = formatAmount(text);
    setFormData({ ...formData, amount: formattedAmount });
    validateField('amount', formattedAmount);
  };

  const validateField = (field: keyof LoanApplication, value: string | number) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'amount':
        const numericAmount = parseInt(value.toString().replace(/[^0-9]/g, ''), 10) || 0;
        if (!numericAmount) {
          newErrors.amount = 'Amount is required';
        } else if (numericAmount < MIN_AMOUNT) {
          newErrors.amount = `Minimum amount is UGX ${MIN_AMOUNT.toLocaleString()}`;
        } else if (numericAmount > MAX_AMOUNT) {
          newErrors.amount = `Maximum amount is UGX ${MAX_AMOUNT.toLocaleString()}`;
        } else {
          delete newErrors.amount;
        }
        break;

      case 'reason':
        if (!value) {
          newErrors.reason = 'Reason is required';
        } else if (value.toString().length < 10) {
          newErrors.reason = 'Please provide more details (minimum 10 characters)';
        } else {
          delete newErrors.reason;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Validate all fields
    const isAmountValid = validateField('amount', formData.amount);
    const isReasonValid = validateField('reason', formData.reason);

    if (isAmountValid && isReasonValid) {
      onSubmit();
    }
  };

  return (
    <ThemedView 
      style={styles.container}
      lightColor="#ffffff"
      darkColor="#1e293b"
    >
      {/* Loan Type Selection */}
      <View style={styles.inputGroup}>
        <ThemedText 
          style={styles.label}
          lightColor="#475569"
          darkColor="#94a3b8"
        >
          Loan Type
        </ThemedText>
        <View style={[
          styles.pickerContainer,
          { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
            borderColor: isDark ? '#334155' : '#e2e8f0' }
        ]}>
          <Picker
            selectedValue={formData.loan_type || 'personal'}
            onValueChange={(value) => setFormData({ ...formData, loan_type: value })}
            style={[
              styles.picker,
              { color: isDark ? '#f8fafc' : '#1e293b' }
            ]}
          >
            {LOAN_TYPES.map((type) => (
              <Picker.Item 
                key={type.value} 
                label={type.label} 
                value={type.value}
                color={isDark ? '#f8fafc' : '#1e293b'}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.inputGroup}>
        <ThemedText 
          style={styles.label}
          lightColor="#475569"
          darkColor="#94a3b8"
        >
          Loan Amount
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#f8fafc' : '#1e293b',
              borderColor: errors.amount ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0') }
          ]}
          placeholder="Enter amount"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          value={formData.amount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
        />
        {errors.amount && (
          <ThemedText style={styles.errorText}>
            {errors.amount}
          </ThemedText>
        )}
      </View>

      {/* Repayment Period Selection */}
      <View style={styles.inputGroup}>
        <ThemedText 
          style={styles.label}
          lightColor="#475569"
          darkColor="#94a3b8"
        >
          Repayment Period
        </ThemedText>
        <View style={[
          styles.pickerContainer,
          { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
            borderColor: isDark ? '#334155' : '#e2e8f0' }
        ]}>
          <Picker
            selectedValue={formData.period}
            onValueChange={(value) => setFormData({ ...formData, period: value })}
            style={[
              styles.picker,
              { color: isDark ? '#f8fafc' : '#1e293b' }
            ]}
          >
            {REPAYMENT_PERIODS.map((period) => (
              <Picker.Item 
                key={period.value} 
                label={period.label} 
                value={period.value}
                color={isDark ? '#f8fafc' : '#1e293b'}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Reason Input */}
      <View style={styles.inputGroup}>
        <ThemedText 
          style={styles.label}
          lightColor="#475569"
          darkColor="#94a3b8"
        >
          Reason for Loan
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#f8fafc' : '#1e293b',
              borderColor: errors.reason ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0') }
          ]}
          placeholder="Explain why you need this loan"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          value={formData.reason}
          onChangeText={(text) => {
            setFormData({ ...formData, reason: text });
            validateField('reason', text);
          }}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {errors.reason && (
          <ThemedText style={styles.errorText}>
            {errors.reason}
          </ThemedText>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <LinearGradient
          colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.submitButtonGradient}
        >
          <ThemedText style={styles.submitButtonText}>
            Submit Application
          </ThemedText>
        </LinearGradient>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
