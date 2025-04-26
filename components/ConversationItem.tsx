import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Conversation } from '@/types';
import Avatar from './Avatar';
import colors from '@/constants/colors';
import { formatTimeAgo } from '@/utils/date';

interface ConversationItemProps {
  conversation: Conversation;
  onPress?: (conversationId: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onPress,
}) => {
  const handlePress = () => {
    if (onPress) onPress(conversation.id);
  };
  
  // Truncate last message if it's too long
  const truncateMessage = (message: string, maxLength: number = 60) => {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Avatar 
          uri={conversation.user.avatar_url} 
          name={conversation.user.full_name} 
          size="medium" 
        />
        {conversation.unread_count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{conversation.user.full_name}</Text>
          {conversation.last_message_time && (
            <Text style={styles.time}>
              {formatTimeAgo(conversation.last_message_time)}
            </Text>
          )}
        </View>
        
        {conversation.last_message && (
          <Text 
            style={[
              styles.message,
              conversation.unread_count > 0 && styles.unreadMessage
            ]}
            numberOfLines={2}
          >
            {truncateMessage(conversation.last_message)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  avatarContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  time: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  unreadMessage: {
    fontWeight: '500',
    color: colors.text.primary,
  },
});

export default ConversationItem;