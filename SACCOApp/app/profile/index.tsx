import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { ProfileForm } from '@/components/Profile/ProfileForm';
import { ChangePasswordForm } from '@/components/Profile/ChangePasswordForm';
import { ProfileImage } from '@/components/Profile/ProfileImage';

const AnimatedView = Animated.createAnimatedComponent(View);

// Mock user data - replace with actual user data from your auth system
const MOCK_USER = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+256 700 123 456',
  address: 'Plot 123, Kampala Road',
  profileImage: null,
};

export default function ProfilePage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.replace('/');
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
            <ThemedText type="title" style={styles.title}>
              Profile
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Manage your account information
            </ThemedText>
          </AnimatedView>

          {/* Profile Image */}
          <AnimatedView 
            entering={FadeInUp.duration(1000).delay(300)}
            style={styles.profileImageContainer}
          >
            <ProfileImage
              imageUrl={MOCK_USER.profileImage}
              fullName={MOCK_USER.fullName}
            />
          </AnimatedView>

          {/* Profile Form */}
          <AnimatedView entering={FadeInUp.duration(1000).delay(600)}>
            <ProfileForm
              initialData={MOCK_USER}
              onPasswordChange={() => setShowChangePassword(true)}
            />
          </AnimatedView>

          {/* Change Password Form */}
          {showChangePassword && (
            <AnimatedView entering={FadeInUp.duration(1000)}>
              <ChangePasswordForm
                onCancel={() => setShowChangePassword(false)}
              />
            </AnimatedView>
          )}

          {/* Logout Button */}
          <AnimatedView 
            entering={FadeInUp.duration(1000).delay(900)}
            style={styles.logoutContainer}
          >
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LinearGradient
                colors={isDark ? ['#dc2626', '#b91c1c'] : ['#ef4444', '#dc2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoutButtonGradient}
              >
                <ThemedText style={styles.logoutButtonText}>
                  Logout
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
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
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoutContainer: {
    marginTop: 32,
    marginBottom: 48,
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 