import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { mockUsers } from '@/mocks/users';
import { supabase } from '../supabaseClient'

interface AuthState {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean | undefined>;
  register: (email: string, password: string, data: object) => object;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string): Promise<boolean | undefined> => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if(data.session){
            set({ 
              user:data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }else{
            set({ 
              user:null,
              isAuthenticated: false,
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred during login',
            isLoading: false,
          });
        }
      },
      
      register: async (email: string, password: string, data: object) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          return data.user;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred during registration',
            isLoading: false,
          });
        }
      },
      
      logout: async () => {
        await supabase.auth.signOut();
        set({ 
          user: null,
          isAuthenticated: false,
        });
      },
      
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = get().user;
          
          if (!currentUser) {
            throw new Error('User not authenticated');
          }
          
          // In a real app with Supabase, you would use:
          // const { data, error } = await supabase
          //   .from('profiles')
          //   .update(userData)
          //   .eq('id', currentUser.id)
          //   .single();
          // if (error) throw error;
          
          const updatedUser = {
            ...currentUser,
            ...userData,
          };
          
          set({ 
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred while updating profile',
            isLoading: false,
          });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);