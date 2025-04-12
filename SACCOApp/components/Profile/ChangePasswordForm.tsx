import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ChangePasswordFormProps {
  onCancel: () => void;
}

export function ChangePasswordForm({ onCancel }: ChangePasswordFormProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'currentPassword':
        if (!value) {
          newErrors.currentPassword = 'Current password is required';
        } else if (value.length < 8) {
          newErrors.currentPassword = 'Password must be at least 8 characters';
        } else {
          delete newErrors.currentPassword;
        }
        break;

      case 'newPassword':
        if (!value) {
          newErrors.newPassword = 'New password is required';
        } else if (value.length < 8) {
          newErrors.newPassword = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(value)) {
          newErrors.newPassword = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(value)) {
          newErrors.newPassword = 'Password must contain at least one lowercase letter';
        } else if (!/[0-9]/.test(value)) {
          newErrors.newPassword = 'Password must contain at least one number';
        } else if (value === formData.currentPassword) {
          newErrors.newPassword = 'New password must be different from current password';
        } else {
          delete newErrors.newPassword;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.newPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Validate all fields
    const isValid = Object.keys(formData).every(field => 
      validateField(field, formData[field as keyof typeof formData])
    );

    if (isValid) {
      // TODO: Implement API call to change password
      console.log('Password change requested');
      onCancel();
    }
  };

  return (
    <ThemedView 
      style={styles.container}
      lightColor="#ffffff"
      darkColor="#1e293b"
    >
      <ThemedText 
        style={styles.title}
        lightColor="#1e293b"
        darkColor="#f8fafc"
      >
        Change Password
      </ThemedText>

      {/* Current Password Input */}
      <View style={styles.inputGroup}>
        <ThemedText 
          style={styles.label}
          lightColor="#475569"
          darkColor="#94a3b8"
        >
          Current Password
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#f8fafc' : '#1e293b',
              borderColor: errors.currentPassword ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0') }
          ]}
          placeholder="Enter current password"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          value={formData.currentPassword}
          onChangeText={(text) => {
            setFormData({ ...formData, currentPassword: text });
            validateField('currentPassword', text);
          }}
          secureTextEntry
        />
        {errors.currentPassword && (
          <ThemedText style={styles.errorText}>
            {errors.currentPassword}
          </ThemedText>
        )}
      </View>

      {/* New Password Input */}
      <View style={styles.inputGroup}>
        <ThemedText 
          style={styles.label}
          lightColor="#475569"
          darkColor="#94a3b8"
        >
          New Password
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#f8fafc' : '#1e293b',
              borderColor: errors.newPassword ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0') }
          ]}
          placeholder="Enter new password"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          value={formData.newPassword}
          onChangeText={(text) => {
            setFormData({ ...formData, newPassword: text });
            validateField('newPassword', text);
          }}
          secureTextEntry
        />
        {errors.newPassword && (
          <ThemedText style={styles.errorText}>
            {errors.newPassword}
          </ThemedText>
        )}
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputGroup}>
        <ThemedText 
          style={styles.label}
          lightColor="#475569"
          darkColor="#94a3b8"
        >
          Confirm New Password
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#f8fafc' : '#1e293b',
              borderColor: errors.confirmPassword ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0') }
          ]}
          placeholder="Confirm new password"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          value={formData.confirmPassword}
          onChangeText={(text) => {
            setFormData({ ...formData, confirmPassword: text });
            validateField('confirmPassword', text);
          }}
          secureTextEntry
        />
        {errors.confirmPassword && (
          <ThemedText style={styles.errorText}>
            {errors.confirmPassword}
          </ThemedText>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <ThemedText 
            style={styles.buttonText}
            lightColor="#4b5563"
            darkColor="#e2e8f0"
          >
            Cancel
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.saveButton]}
          onPress={handleSubmit}
        >
          <LinearGradient
            colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButtonGradient}
          >
            <ThemedText style={styles.saveButtonText}>
              Update Password
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
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
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  saveButton: {
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 16,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 