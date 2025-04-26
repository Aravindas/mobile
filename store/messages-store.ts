import { create } from 'zustand';
import { Conversation, Message } from '@/types';
import { mockConversations, mockMessages } from '@/mocks/messages';

interface MessagesState {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // Keyed by conversation ID
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  clearError: () => void;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: [],
  messages: {},
  isLoading: false,
  error: null,
  
  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, you would use a more complex query
      // to get conversations with last message and unread count
      
      set({ 
        conversations: mockConversations,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while fetching conversations',
        isLoading: false,
      });
    }
  },
  
  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, you would use:
      // const { data, error } = await supabase
      //   .from('messages')
      //   .select('*, sender:profiles!sender_id(*)')
      //   .or(`sender_id.eq.${userId}.and.receiver_id.eq.${otherUserId},sender_id.eq.${otherUserId}.and.receiver_id.eq.${userId}`)
      //   .order('created_at', { ascending: true });
      // if (error) throw error;
      
      // For mock data, we'll just use all messages
      // In a real app, you'd filter by the conversation participants
      
      set({ 
        messages: {
          ...get().messages,
          [conversationId]: mockMessages,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while fetching messages',
        isLoading: false,
      });
    }
  },
  
  sendMessage: async (conversationId: string, content: string) => {
    try {
      // In a real app with Supabase, you would use:
      // const { data, error } = await supabase
      //   .from('messages')
      //   .insert({
      //     sender_id: userId,
      //     receiver_id: otherUserId,
      //     content,
      //   })
      //   .select('*, sender:profiles!sender_id(*)')
      //   .single();
      // if (error) throw error;
      
      // Create a new message
      const newMessage: Message = {
        id: `new-${Date.now()}`,
        sender_id: 'current_user',
        receiver_id: conversationId.split('-')[0], // In a real app, this would be the actual receiver ID
        content,
        created_at: new Date().toISOString(),
        read: true,
      };
      
      // Update messages
      const currentMessages = get().messages[conversationId] || [];
      set({
        messages: {
          ...get().messages,
          [conversationId]: [...currentMessages, newMessage],
        },
      });
      
      // Update conversation with last message
      const conversations = get().conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            last_message: content,
            last_message_time: newMessage.created_at,
          };
        }
        return conv;
      });
      
      set({ conversations });
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while sending message',
      });
    }
  },
  
  markConversationAsRead: async (conversationId: string) => {
    try {
      // In a real app with Supabase, you would use:
      // const { error } = await supabase
      //   .from('messages')
      //   .update({ read: true })
      //   .eq('receiver_id', userId)
      //   .eq('sender_id', otherUserId)
      //   .eq('read', false);
      // if (error) throw error;
      
      // Update conversation unread count
      const conversations = get().conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unread_count: 0,
          };
        }
        return conv;
      });
      
      set({ conversations });
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while marking conversation as read',
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
}));