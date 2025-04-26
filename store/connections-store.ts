import { create } from 'zustand';
import { Connection, User } from '@/types';
import { mockConnections, mockConnectionSuggestions } from '@/mocks/connections';

interface ConnectionsState {
  connections: Connection[];
  pendingConnections: Connection[];
  connectionSuggestions: User[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchConnections: () => Promise<void>;
  fetchPendingConnections: () => Promise<void>;
  fetchConnectionSuggestions: () => Promise<void>;
  sendConnectionRequest: (userId: string) => Promise<void>;
  acceptConnectionRequest: (connectionId: string) => Promise<void>;
  ignoreConnectionRequest: (connectionId: string) => Promise<void>;
  removeConnection: (connectionId: string) => Promise<void>;
  clearError: () => void;
}

export const useConnectionsStore = create<ConnectionsState>((set, get) => ({
  connections: [],
  pendingConnections: [],
  connectionSuggestions: [],
  isLoading: false,
  error: null,
  
  fetchConnections: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, you would use:
      // const { data, error } = await supabase
      //   .from('connections')
      //   .select('*, connected_user:profiles!connected_user_id(*)')
      //   .eq('user_id', userId)
      //   .eq('status', 'accepted');
      // if (error) throw error;
      
      const acceptedConnections = mockConnections.filter(
        conn => conn.status === 'accepted'
      );
      
      set({ 
        connections: acceptedConnections,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while fetching connections',
        isLoading: false,
      });
    }
  },
  
  fetchPendingConnections: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, you would use:
      // const { data, error } = await supabase
      //   .from('connections')
      //   .select('*, connected_user:profiles!connected_user_id(*)')
      //   .eq('connected_user_id', userId) // Requests sent to current user
      //   .eq('status', 'pending');
      // if (error) throw error;
      
      const pendingConnections = mockConnections.filter(
        conn => conn.status === 'pending'
      );
      
      set({ 
        pendingConnections,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while fetching pending connections',
        isLoading: false,
      });
    }
  },
  
  fetchConnectionSuggestions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, you would use a more complex query
      // to find users that are not already connected and might be relevant
      
      set({ 
        connectionSuggestions: mockConnectionSuggestions,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while fetching connection suggestions',
        isLoading: false,
      });
    }
  },
  
  sendConnectionRequest: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, you would use:
      // const { data, error } = await supabase
      //   .from('connections')
      //   .insert({
      //     user_id: currentUserId,
      //     connected_user_id: userId,
      //     status: 'pending'
      //   });
      // if (error) throw error;
      
      // Remove from suggestions
      set({ 
        connectionSuggestions: get().connectionSuggestions.filter(
          user => user.id !== userId
        ),
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while sending connection request',
        isLoading: false,
      });
    }
  },
  
  acceptConnectionRequest: async (connectionId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, you would use:
      // const { data, error } = await supabase
      //   .from('connections')
      //   .update({ status: 'accepted' })
      //   .eq('id', connectionId)
      //   .eq('connected_user_id', userId); // Ensure only the recipient can accept
      // if (error) throw error;
      
      const pendingConnections = get().pendingConnections;
      const connectionToAccept = pendingConnections.find(conn => conn.id === connectionId);
      
      if (connectionToAccept) {
        // Add to connections
        set({ 
          connections: [...get().connections, {
            ...connectionToAccept,
            status: 'accepted'
          }],
          // Remove from pending
          pendingConnections: pendingConnections.filter(conn => conn.id !== connectionId),
          isLoading: false,
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while accepting connection request',
        isLoading: false,
      });
    }
  },
  
  ignoreConnectionRequest: async (connectionId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, you would use:
      // const { data, error } = await supabase
      //   .from('connections')
      //   .delete()
      //   .eq('id', connectionId)
      //   .eq('connected_user_id', userId); // Ensure only the recipient can delete
      // if (error) throw error;
      
      // Remove from pending
      set({ 
        pendingConnections: get().pendingConnections.filter(
          conn => conn.id !== connectionId
        ),
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while ignoring connection request',
        isLoading: false,
      });
    }
  },
  
  removeConnection: async (connectionId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, you would use:
      // const { data, error } = await supabase
      //   .from('connections')
      //   .delete()
      //   .eq('id', connectionId)
      //   .or(`user_id.eq.${userId},connected_user_id.eq.${userId}`); // Either party can remove
      // if (error) throw error;
      
      // Remove from connections
      set({ 
        connections: get().connections.filter(
          conn => conn.id !== connectionId
        ),
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while removing connection',
        isLoading: false,
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
}));