import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

interface DrawerMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ isVisible, onClose }: DrawerMenuProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const translateX = useSharedValue(isVisible ? 0 : -300);

  // Update the animation value when visibility changes
  React.useEffect(() => {
    translateX.value = withTiming(isVisible ? 0 : -300, { duration: 300 });
  }, [isVisible]);

  const drawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const overlayOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-300, 0],
      [0, 0.5],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const navigateTo = (route: string) => {
    router.push(route);
    onClose();
  };

  const menuItems = [
    { 
      icon: 'home-outline', 
      title: 'Dashboard', 
      route: '/dashboard',
      iconType: 'Ionicons'
    },
    { 
      icon: 'cash-multiple', 
      title: 'Loans', 
      route: '/loans',
      iconType: 'MaterialCommunityIcons'
    },
    { 
      icon: 'chatbubble-outline', 
      title: 'Messages', 
      route: '/(tabs)/messages',
      iconType: 'Ionicons'
    },
    { 
      icon: 'newspaper-outline', 
      title: 'Statements', 
      route: '/statements',
      iconType: 'Ionicons'
    },
    { 
      icon: 'calculator-outline', 
      title: 'Loan Calculator', 
      route: '/loan-calculator',
      iconType: 'Ionicons'
    },
    { 
      icon: 'calendar-outline', 
      title: 'Schedule Appointment', 
      route: '/appointments',
      iconType: 'Ionicons'
    },
    { 
      icon: 'information-circle-outline', 
      title: 'About SACCO', 
      route: '/about',
      iconType: 'Ionicons'
    },
    { 
      icon: 'cog-outline', 
      title: 'Settings', 
      route: '/settings',
      iconType: 'Ionicons'
    },
    { 
      icon: 'help-circle-outline', 
      title: 'Help & Support', 
      route: '/support',
      iconType: 'Ionicons'
    },
  ];

  if (!isVisible && translateX.value === -300) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Overlay that closes the drawer when clicked */}
      <Pressable 
        style={[styles.overlay, overlayOpacity]} 
        onPress={onClose}
      />
      
      {/* Drawer menu */}
      <Animated.View style={[
        styles.drawer, 
        isDark ? styles.drawerDark : null,
        drawerStyle
      ]}>
        {/* User profile section */}
        <View style={[styles.profileSection, isDark ? styles.profileSectionDark : null]}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=SACCO+User&background=6366f1&color=fff' }} 
              style={styles.avatar} 
            />
            <View>
              <Text style={[styles.username, isDark ? styles.textLight : null]}>John Doe</Text>
              <Text style={[styles.accountNumber, isDark ? styles.accountNumberDark : null]}>
                Account: #SAC-1234
              </Text>
            </View>
          </View>
          <Pressable 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Ionicons 
              name="close" 
              size={24} 
              color={isDark ? '#f8fafc' : '#0f172a'} 
            />
          </Pressable>
        </View>

        {/* Account balance summary */}
        <View style={[styles.balanceSection, isDark ? styles.balanceSectionDark : null]}>
          <View style={styles.balanceItem}>
            <Text style={[styles.balanceLabel, isDark ? styles.balanceLabelDark : null]}>
              Savings Balance
            </Text>
            <Text style={[styles.balanceAmount, isDark ? styles.textLight : null]}>
              UGX 2,450,000
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.balanceItem}>
            <Text style={[styles.balanceLabel, isDark ? styles.balanceLabelDark : null]}>
              Loan Balance
            </Text>
            <Text style={[styles.balanceAmount, isDark ? styles.textLight : null]}>
              UGX 850,000
            </Text>
          </View>
        </View>

        {/* Menu items */}
        <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={[styles.menuItem, isDark ? styles.menuItemDark : null]}
              onPress={() => navigateTo(item.route)}
            >
              {item.iconType === 'Ionicons' ? (
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={isDark ? '#94a3b8' : '#64748b'}
                  style={styles.menuIcon}
                />
              ) : (
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={24}
                  color={isDark ? '#94a3b8' : '#64748b'}
                  style={styles.menuIcon}
                />
              )}
              <Text style={[styles.menuText, isDark ? styles.menuTextDark : null]}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        
        {/* Logout button */}
        <Pressable 
          style={[styles.logoutButton, isDark ? styles.logoutButtonDark : null]}
          onPress={() => navigateTo('/auth/login')}
        >
          <Ionicons 
            name="log-out-outline" 
            size={24} 
            color={isDark ? '#f8fafc' : '#0f172a'} 
            style={styles.menuIcon}
          />
          <Text style={[styles.logoutText, isDark ? styles.textLight : null]}>
            Logout
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  drawerDark: {
    backgroundColor: '#1e293b',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileSectionDark: {
    borderBottomColor: '#334155',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  accountNumber: {
    fontSize: 14,
    color: '#64748b',
  },
  accountNumberDark: {
    color: '#94a3b8',
  },
  textLight: {
    color: '#f8fafc',
  },
  closeButton: {
    padding: 8,
  },
  balanceSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  balanceSectionDark: {
    borderBottomColor: '#334155',
    backgroundColor: '#0f172a',
  },
  balanceItem: {
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  balanceLabelDark: {
    color: '#94a3b8',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemDark: {
    borderBottomColor: '#334155',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#0f172a',
  },
  menuTextDark: {
    color: '#f8fafc',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  logoutButtonDark: {
    borderTopColor: '#334155',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
}); 