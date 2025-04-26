import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Send, Phone, Video, Info } from 'lucide-react-native';
import { useMessagesStore } from '@/store/messages-store';
import { Message } from '@/types';
import MessageBubble from '@/components/MessageBubble';
import Avatar from '@/components/Avatar';
import colors from '@/constants/colors';
import { mockUsers } from '@/mocks/users';

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams();
  const { 
    messages, 
    isLoading, 
    error, 
    fetchMessages,
    sendMessage,
    markConversationAsRead,
    clearError
  } = useMessagesStore();
  
  const [user, setUser] = useState(mockUsers[0]); // Default to first mock user
  const [newMessage, setNewMessage] = useState('');
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Find the user in the mock data
    const foundUser = mockUsers.find(u => u.id === id);
    if (foundUser) {
      setUser(foundUser);
    }
    
    // Fetch messages for this conversation
    fetchMessages(id as string);
    
    // Mark conversation as read
    markConversationAsRead(id as string);
  }, [id]);
  
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error]);
  
  useEffect(() => {
    // Update conversation messages when messages change
    if (messages[id as string]) {
      setConversationMessages(messages[id as string]);
    }
  }, [messages, id]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    sendMessage(id as string, newMessage);
    setNewMessage('');
    
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  const handleCall = () => {
    Alert.alert('Call', 'Voice calling functionality would be implemented here.');
  };
  
  const handleVideoCall = () => {
    Alert.alert('Video Call', 'Video calling functionality would be implemented here.');
  };
  
  const handleInfo = () => {
    Alert.alert('Info', 'Conversation info would be displayed here.');
  };
  
  const handleProfilePress = () => {
    router.push(`/profile/${id}`);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerTitle: () => (
            <TouchableOpacity 
              style={styles.headerTitle}
              onPress={handleProfilePress}
            >
              <Avatar 
                uri={user.avatar_url} 
                name={user.full_name} 
                size="small" 
              />
              <Text style={styles.headerName}>{user.full_name}</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleCall}
              >
                <Phone size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleVideoCall}
              >
                <Video size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleInfo}
              >
                <Info size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )
        }} 
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={conversationMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isCurrentUser={item.sender_id === 'current_user'}
              />
            )}
            contentContainerStyle={styles.messagesList}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No messages yet. Start the conversation!
                </Text>
              </View>
            }
          />
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.placeholder}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send 
              size={20} 
              color={newMessage.trim() ? colors.white : colors.text.tertiary} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40,
    maxHeight: 100,
    fontSize: 14,
    color: colors.text.primary,
  },
  sendButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.divider,
  },
});