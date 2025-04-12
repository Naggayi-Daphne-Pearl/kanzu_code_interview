import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedView = Animated.createAnimatedComponent(View);

const API_URL = 'http://127.0.0.1:8000/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const validateInputs = () => {
    let isValid = true;
    
    // Reset previous errors
    setEmailError('');
    setPasswordError('');

    // Validate email/username
    if (!email.trim()) {
      setEmailError('Username is required');
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

  const handleLogin = async () => {
    try {
      // First validate inputs
      if (!validateInputs()) {
        return;
      }

      setIsLoading(true);
      
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          Alert.alert(
            'Login Failed',
            'Invalid username or password. Please try again.'
          );
        } else if (response.status === 404) {
          Alert.alert(
            'Login Failed',
            'User not found. Please check your username.'
          );
        } else {
          throw new Error(data.message || 'Login failed');
        }
        return;
      }

      // Store the token
      await AsyncStorage.setItem('authToken', data.token);
      
      // Navigate to dashboard
      router.replace('/dashboard');
    } catch (error) {
      Alert.alert(
        'Login Error',
        'An error occurred while trying to log in. Please try again later.'
      );
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
            Welcome Back 👋
          </ThemedText>
          <ThemedText 
            style={styles.subtitle}
            lightColor="#64748b"
            darkColor="#94a3b8"
          >
            Sign in to continue to your account
          </ThemedText>
        </View>

        <ThemedView 
          style={styles.form}
          lightColor="#ffffff"
          darkColor="#1e293b"
        >
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
                emailError ? styles.inputError : null
              ]}
              placeholder="Enter your username"
              placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              autoCapitalize="none"
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

          <Link href="../forgot-password" style={styles.forgotPassword}>
            <ThemedText type="link">Forgot password?</ThemedText>
          </Link>

          <TouchableOpacity 
            style={styles.loginButton}
            activeOpacity={0.8}
            onPress={handleLogin}
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
                  Login
                </ThemedText>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* <View style={styles.signupContainer}>
            <ThemedText 
              style={styles.signupText}
              lightColor="#64748b"
              darkColor="#94a3b8"
            >
              Don't have an account?{' '}
            </ThemedText>
            <Link href="../signup">
              <ThemedText type="link">Sign up</ThemedText>
            </Link>
          </View> */}
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  loginButton: {
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
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
});
