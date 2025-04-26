import { create } from 'zustand';
import { Post } from '@/types';
import { mockPosts } from '@/mocks/posts';
import { useAuthStore } from "@/store/auth-store";
import { supabase } from '../supabaseClient'
import { decode } from 'base64-arraybuffer';

interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPosts: () => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  createPost: (content: string, imageUrl?: any) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  clearError: () => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  
  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      set({ 
        posts: data,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while fetching posts',
        isLoading: false,
      });
    }
  },
  
  likePost: async (postId: string) => {
    try {
      const posts = get().posts;
      const postIndex = posts.findIndex(post => post.id === postId);
      
      if (postIndex === -1) return;
      
      const post = posts[postIndex];
      const liked = !post.liked_by_me;
      const likesCount = liked ? post.likes_count + 1 : post.likes_count - 1;
      
      // Update local state immediately for better UX
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = {
        ...post,
        liked_by_me: liked,
        likes_count: likesCount,
      };
      
      set({ posts: updatedPosts });
      
      // In a real app with Supabase, you would use:
      // if (liked) {
      //   await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
      // } else {
      //   await supabase.from('post_likes').delete().match({ post_id: postId, user_id: userId });
      // }
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while liking the post',
      });
    }
  },
  
  createPost: async (content: string, file: any) => {
    set({ isLoading: true, error: null });
    
    try {
      const { user } = useAuthStore.getState();
      let image_url = "";
      if(file){
        const extension = file.uri.split('.').pop()?.toLowerCase() || 'jpg';
        const mimeType = file.mimeType;
        const fileName = `${user.id}-post-${Date.now()}.${extension}`;
        const formData:any = new FormData();
        formData.append('file', { uri: file.uri, name: fileName, type: mimeType });
        const { data, error } = await supabase.storage.from('posts').upload(fileName, formData);
        if (error) {
          console.error('Upload error:', error);
          throw error;
        }
        let path = data?.path ? data?.path : ""
        if(path){
          const { data } = await supabase.storage.from('posts').getPublicUrl(path);
          image_url = data.publicUrl;
        }
      }
     
      const newPost: any = {
        user_id: user.id,
        content,
        image_url,
        likes_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString(),
        liked_by_me: false,
      };
      
      const { data, error } = await supabase
        .from('posts')
        .insert(newPost)
        .single();
      if (error) throw error;
    } catch (error) {
      console.log("error",error)
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while creating the post',
        isLoading: false,
      });
    }
  },
  
  deletePost: async (postId: string) => {
    try {
      const posts = get().posts;
      
      // Update local state immediately for better UX
      set({ 
        posts: posts.filter(post => post.id !== postId),
      });
      
      // In a real app with Supabase, you would use:
      // const { error } = await supabase
      //   .from('posts')
      //   .delete()
      //   .eq('id', postId)
      //   .eq('user_id', userId); // Ensure user can only delete their own posts
      // if (error) throw error;
      
    } catch (error) {
      // Revert on error
      await get().fetchPosts();
      
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while deleting the post',
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
}));