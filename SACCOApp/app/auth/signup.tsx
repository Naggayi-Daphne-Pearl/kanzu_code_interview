import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

const AnimatedView = Animated.createAnimatedComponent(View);

const API_URL = 'http://127.0.0.1:8000/api';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const validateInputs = () => {
    let isValid = true;
    
    // Reset previous errors
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setFormError('');

    // Validate username
    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async () => {
    try {
      if (!validateInputs()) {
        return;
      }

      setIsLoading(true);
      setFormError('');
      
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error messages from backend
        if (data.username) {
          setUsernameError(data.username[0]);
        }
        if (data.email) {
          setEmailError(data.email[0]);
        }
        if (data.password) {
          setPasswordError(data.password[0]);
        }
        if (data.error) {
          setFormError(data.error);
        }
        // If no specific error message, show generic error
        if (!data.username && !data.email && !data.password && !data.error) {
          setFormError('An unexpected error occurred. Please try again.');
        }
        return;
      }

      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
      
      // Show success message and redirect
      Alert.alert(
        'Success',
        'Registration successful! Please log in with your credentials.',
        [{ 
          text: 'OK', 
          onPress: () => {
            router.replace('/auth/login');
          }
        }]
      );
    } catch (error) {
      setFormError('An error occurred while trying to register. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container} lightColor="#f8fafc" darkColor="#0f172a">
      <LinearGradient
        colors={['#4f46e5', '#7c3aed']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      <AnimatedView 
        entering={FadeInUp.duration(1000)} 
        style={styles.formContainer}
      >
        <View style={styles.header}>
          <ThemedText 
            type="title" 
            style={styles.title}
            lightColor="#1e293b"
            darkColor="#f8fafc"
          >
            Create Account 🚀
          </ThemedText>
          <ThemedText 
            style={styles.subtitle}
            lightColor="#64748b"
            darkColor="#94a3b8"
          >
            Sign up to get started
          </ThemedText>
        </View>

        <ThemedView 
          style={styles.form}
          lightColor="#ffffff"
          darkColor="#1e293b"
        >
          {formError ? (
            <View style={styles.formErrorContainer}>
              <ThemedText style={styles.formErrorText} lightColor="#ef4444" darkColor="#f87171">
                {formError}
              </ThemedText>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <ThemedText 
              style={styles.label}
              lightColor="#475569"
              darkColor="#94a3b8"
            >
              Username
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                  color: isDark ? '#f8fafc' : '#1e293b',
                  borderColor: isDark ? '#334155' : '#e2e8f0' },
                usernameError ? styles.inputError : null
              ]}
              placeholder="Enter your username"
              placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setUsernameError('');
              }}
              autoCapitalize="none"
            />
            {usernameError ? (
              <ThemedText style={styles.errorText} lightColor="#ef4444" darkColor="#f87171">
                {usernameError}
              </ThemedText>
            ) : null}
          </View>

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
                  borderColor: isDark ? '#334155' : '#e2e8f0' },
                emailError ? styles.inputError : null
              ]}
              placeholder="Enter your email"
              placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {emailError ? (
              <ThemedText style={styles.errorText} lightColor="#ef4444" darkColor="#f87171">
                {emailError}
              </ThemedText>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText 
              style={styles.label}
              lightColor="#475569"
              darkColor="#94a3b8"
            >
              Password
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                  color: isDark ? '#f8fafc' : '#1e293b',
                  borderColor: isDark ? '#334155' : '#e2e8f0' },
                passwordError ? styles.inputError : null
              ]}
              placeholder="Enter your password"
              placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry
            />
            {passwordError ? (
              <ThemedText style={styles.errorText} lightColor="#ef4444" darkColor="#f87171">
                {passwordError}
              </ThemedText>
            ) : null}
          </View>

          <TouchableOpacity 
            style={styles.signupButton}
            activeOpacity={0.8}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isDark ? ['#6366f1', '#8b5cf6'] : ['#4f46e5', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <ThemedText style={styles.buttonText}>
                  Sign Up
                </ThemedText>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <ThemedText 
              style={styles.loginText}
              lightColor="#64748b"
              darkColor="#94a3b8"
            >
              Already have an account?{' '}
            </ThemedText>
            <Link href="../auth/login">
              <ThemedText type="link">Log in</ThemedText>
            </Link>
          </View>
        </ThemedView>
      </AnimatedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    opacity: 0.1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    borderRadius: 24,
    padding: 32,
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
  signupButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#64748b',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  formErrorContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  formErrorText: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 