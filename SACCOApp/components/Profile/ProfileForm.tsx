import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface ProfileFormProps {
  initialData: ProfileData;
  onPasswordChange: () => void;
}

export function ProfileForm({ initialData, onPasswordChange }: ProfileFormProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/userprofiles/my_profile/', {
          headers: {
            Authorization: 'Bearer your_access_token',
          },
        });
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const validateField = (field: keyof ProfileData, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;

      case 'phone':
        const phoneRegex = /^\+256 \d{3} \d{3} \d{3}$/;
        if (!value) {
          newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(value)) {
          newErrors.phone = 'Invalid phone format (e.g., +256 700 123 456)';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'fullName':
        if (!value) {
          newErrors.fullName = 'Full name is required';
        } else if (value.length < 3) {
          newErrors.fullName = 'Name is too short';
        } else {
          delete newErrors.fullName;
        }
        break;

      case 'address':
        if (!value) {
          newErrors.address = 'Address is required';
        } else if (value.length < 5) {
          newErrors.address = 'Please provide a complete address';
        } else {
          delete newErrors.address;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validate all fields
      const isValid = Object.keys(formData).every(field => 
        validateField(field as keyof ProfileData, formData[field as keyof ProfileData])
      );

      if (isValid) {
        const response = await fetch('http://127.0.0.1:8000/api/userprofiles/update_profile/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer your_access_token',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          Alert.alert('Success', 'Profile updated successfully');
        } else {
          Alert.alert('Error', 'Failed to update profile');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView 
      style={styles.container}
      lightColor="#ffffff"
      darkColor="#1e293b"
    >
      {/* Full Name Input */}
      <View style={styles.inputGroup}>
        <ThemedText 
          style={styles.label}
          lightColor="#475569"
          darkColor="#94a3b8"
        >
          Full Name
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#f8fafc' : '#1e293b',
              borderColor: errors.fullName ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0') }
          ]}
          placeholder="Enter your full name"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          value={formData.fullName}
          onChangeText={(text) => {
            setFormData({ ...formData, fullName: text });
            validateField('fullName', text);
          }}
        />
        {errors.fullName && (
          <ThemedText style={styles.errorText}>
            {errors.fullName}
          </ThemedText>
        )}
      </View>

      {/* Email Input */}
      <View style={styles.inputGroup}>
        <ThemedText 
          style={styles.label}
          lightColor="#475569"
          darkColor="#94a3b8"
        >
          Email
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#f8fafc' : '#1e293b',
              borderColor: errors.email ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0') }
          ]}
          placeholder="Enter your email"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          value={formData.email}
          onChangeText={(text) => {
            setFormData({ ...formData, email: text });
            validateField('email', text);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && (
          <ThemedText style={styles.errorText}>
            {errors.email}
          </ThemedText>
        )}
      </View>

      {/* Phone Input */}
      <View style={styles.inputGroup}>
        <ThemedText 
          style={styles.label}
          lightColor="#475569"
          darkColor="#94a3b8"
        >
          Phone
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#f8fafc' : '#1e293b',
              borderColor: errors.phone ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0') }
          ]}
          placeholder="Enter your phone number"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          value={formData.phone}
          onChangeText={(text) => {
            setFormData({ ...formData, phone: text });
            validateField('phone', text);
          }}
          keyboardType="phone-pad"
        />
        {errors.phone && (
          <ThemedText style={styles.errorText}>
            {errors.phone}
          </ThemedText>
        )}
      </View>

      {/* Address Input */}
      <View style={styles.inputGroup}>
        <ThemedText 
          style={styles.label}
          lightColor="#475569"
          darkColor="#94a3b8"
        >
          Address
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#f8fafc' : '#1e293b',
              borderColor: errors.address ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0') }
          ]}
          placeholder="Enter your address"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          value={formData.address}
          onChangeText={(text) => {
            setFormData({ ...formData, address: text });
            validateField('address', text);
          }}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        {errors.address && (
          <ThemedText style={styles.errorText}>
            {errors.address}
          </ThemedText>
        )}
      </View>

      {/* Change Password Button */}
      <TouchableOpacity 
        style={styles.changePasswordButton}
        onPress={onPasswordChange}
      >
        <ThemedText 
          style={styles.changePasswordText}
          lightColor="#4f46e5"
          darkColor="#818cf8"
        >
          Change Password
        </ThemedText>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <LinearGradient
          colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.saveButtonGradient}
        >
          <ThemedText style={styles.saveButtonText}>
            Save Changes
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  changePasswordButton: {
    marginBottom: 24,
  },
  changePasswordText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 