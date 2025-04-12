import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  time: string;
  unread: boolean;
}

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for messages
  const messages: Message[] = [
    {
      id: '1',
      sender: 'SACCO Administrator',
      avatar: 'https://ui-avatars.com/api/?name=SACCO+Admin&background=6366f1&color=fff',
      message: 'Your loan application has been approved! You can now check the details in the loans section.',
      time: '10:30 AM',
      unread: true,
    },
    {
      id: '2',
      sender: 'Payment System',
      avatar: 'https://ui-avatars.com/api/?name=Payment+System&background=10b981&color=fff',
      message: 'Your loan payment was received. Thank you for your prompt payment.',
      time: 'Yesterday',
      unread: true,
    },
    {
      id: '3',
      sender: 'Member Services',
      avatar: 'https://ui-avatars.com/api/?name=Member+Services&background=ef4444&color=fff',
      message: 'There will be system maintenance this weekend. Services will be unavailable from 10PM to 2AM.',
      time: '2 days ago',
      unread: false,
    },
    {
      id: '4',
      sender: 'Savings Account',
      avatar: 'https://ui-avatars.com/api/?name=Savings+Account&background=f59e0b&color=fff',
      message: 'Your monthly interest has been credited to your savings account.',
      time: '3 days ago',
      unread: false,
    },
    {
      id: '5',
      sender: 'Membership Team',
      avatar: 'https://ui-avatars.com/api/?name=Membership+Team&background=8b5cf6&color=fff',
      message: 'Thank you for being a loyal member for 2 years! Check out our anniversary offers.',
      time: 'Last week',
      unread: false,
    },
  ];

  const filteredMessages = messages.filter(message => 
    message.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
    message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMessageItem = ({ item }: { item: Message }) => (
    <Pressable 
      style={[
        styles.messageItem, 
        isDark ? styles.messageItemDark : null,
        item.unread ? (isDark ? styles.unreadDark : styles.unread) : null
      ]}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.sender, isDark ? styles.textLight : null]}>
            {item.sender}
          </Text>
          <Text style={[styles.time, isDark ? styles.timeTextDark : null]}>
            {item.time}
          </Text>
        </View>
        <Text 
          style={[
            styles.messageText, 
            isDark ? styles.messageTextDark : null,
            item.unread ? styles.messageTextBold : null
          ]}
          numberOfLines={2}
        >
          {item.message}
        </Text>
        {item.unread && (
          <View style={styles.unreadIndicator} />
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, isDark ? styles.containerDark : null]}>
      <View style={[styles.header, isDark ? styles.headerDark : null]}>
        <Text style={[styles.title, isDark ? styles.textLight : null]}>Messages</Text>
      </View>
      
      <View style={[styles.searchContainer, isDark ? styles.searchContainerDark : null]}>
        <Ionicons 
          name="search-outline" 
          size={20} 
          color={isDark ? '#94a3b8' : '#64748b'} 
          style={styles.searchIcon} 
        />
        <TextInput
          style={[styles.searchInput, isDark ? styles.searchInputDark : null]}
          placeholder="Search messages"
          placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={isDark ? '#94a3b8' : '#64748b'} 
            />
          </Pressable>
        )}
      </View>

      {filteredMessages.length > 0 ? (
        <FlatList
          data={filteredMessages}
          renderItem={renderMessageItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons 
            name="chatbubble-ellipses-outline" 
            size={64} 
            color={isDark ? '#334155' : '#e2e8f0'} 
          />
          <Text style={[styles.emptyStateText, isDark ? styles.emptyStateTextDark : null]}>
            No messages found
          </Text>
        </View>
      )}

      <Pressable 
        style={[styles.composeButton, isDark ? styles.composeButtonDark : null]}
      >
        <Ionicons name="create-outline" size={24} color="#ffffff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerDark: {
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  textLight: {
    color: '#f8fafc',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchContainerDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#0f172a',
  },
  searchInputDark: {
    color: '#f8fafc',
  },
  list: {
    paddingHorizontal: 16,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageItemDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  unread: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
  unreadDark: {
    backgroundColor: '#1e3a8a15',
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
    position: 'relative',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sender: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  time: {
    fontSize: 12,
    color: '#64748b',
  },
  timeTextDark: {
    color: '#94a3b8',
  },
  messageText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  messageTextDark: {
    color: '#cbd5e1',
  },
  messageTextBold: {
    fontWeight: '500',
  },
  unreadIndicator: {
    position: 'absolute',
    right: 0,
    top: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  emptyStateTextDark: {
    color: '#94a3b8',
  },
  composeButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  composeButtonDark: {
    backgroundColor: '#4f46e5',
  },
}); 