import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Send } from 'lucide-react-native';
import { usePostsStore } from '@/store/posts-store';
import { Post, Comment } from '@/types';
import PostCard from '@/components/PostCard';
import Avatar from '@/components/Avatar';
import { useAuthStore } from '@/store/auth-store';
import colors from '@/constants/colors';
import { formatTimeAgo } from '@/utils/date';

// Mock comments for demo
const mockComments: Comment[] = [
  {
    id: '1',
    post_id: '1',
    user_id: '2',
    content: "Great post! I've been using this technique in my projects and it's been a game-changer.",
    created_at: '2023-09-15T15:30:00Z',
    user: {
      id: '2',
      email: 'michael.chen@example.com',
      full_name: 'Michael Chen',
      headline: 'Software Engineer at InnovateTech',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      created_at: '2023-02-10T10:15:00Z',
    }
  },
  {
    id: '2',
    post_id: '1',
    user_id: '3',
    content: "Thanks for sharing this! Would you mind elaborating on how you implemented the performance optimizations?",
    created_at: '2023-09-15T16:45:00Z',
    user: {
      id: '3',
      email: 'alex.rodriguez@example.com',
      full_name: 'Alex Rodriguez',
      headline: 'UX Designer at DesignHub',
      avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
      created_at: '2023-03-05T14:20:00Z',
    }
  }
];

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const { posts, likePost } = usePostsStore();
  const { user } = useAuthStore();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Find the post in the store
    const foundPost = posts.find(p => p.id === id);
    if (foundPost) {
      setPost(foundPost);
      
      // In a real app, you would fetch comments from the API
      // For demo, we'll use mock comments if the post ID matches
      if (id === '1') {
        setComments(mockComments);
      }
    }
    
    setIsLoading(false);
  }, [id, posts]);
  
  const handleLike = (postId: string) => {
    likePost(postId);
  };
  
  const handleShare = (postId: string) => {
    Alert.alert('Share', 'Sharing functionality would be implemented here.');
  };
  
  const handleProfilePress = (userId: string) => {
    router.push(`/profile/${userId}`);
  };
  
  const handleAddComment = () => {
    if (!newComment.trim() || !post || !user) return;
    
    // In a real app, you would send this to the API
    const newCommentObj: Comment = {
      id: `new-${Date.now()}`,
      post_id: post.id,
      user_id: user.id,
      content: newComment,
      created_at: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        headline: user.headline,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
      }
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
    
    // Update the post's comment count
    if (post) {
      setPost({
        ...post,
        comments_count: post.comments_count + 1
      });
    }
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }
  
  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Post not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <Stack.Screen options={{ title: 'Post' }} />
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.postContainer}>
            <PostCard
              post={post}
              onLike={handleLike}
              onShare={handleShare}
              onProfilePress={handleProfilePress}
            />
          </View>
          
          <View style={styles.commentsContainer}>
            <Text style={styles.commentsTitle}>
              Comments ({post.comments_count})
            </Text>
            
            {comments.map(comment => (
              <View key={comment.id} style={styles.commentItem}>
                <TouchableOpacity
                  onPress={() => handleProfilePress(comment.user?.id || '')}
                >
                  <Avatar
                    uri={comment.user?.avatar_url}
                    name={comment.user?.full_name}
                    size="small"
                  />
                </TouchableOpacity>
                
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <TouchableOpacity
                      onPress={() => handleProfilePress(comment.user?.id || '')}
                    >
                      <Text style={styles.commentName}>
                        {comment.user?.full_name}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.commentTime}>
                      {formatTimeAgo(comment.created_at)}
                    </Text>
                  </View>
                  
                  <Text style={styles.commentText}>{comment.content}</Text>
                </View>
              </View>
            ))}
            
            {comments.length === 0 && (
              <View style={styles.noCommentsContainer}>
                <Text style={styles.noCommentsText}>
                  No comments yet. Be the first to comment!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <Avatar
            uri={user?.avatar_url}
            name={user?.full_name}
            size="small"
          />
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={colors.placeholder}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Send 
              size={20} 
              color={newComment.trim() ? colors.primary : colors.text.tertiary} 
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
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  backButton: {
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  postContainer: {
    padding: 16,
  },
  commentsContainer: {
    padding: 16,
    backgroundColor: colors.white,
    flex: 1,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  commentTime: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  commentText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  noCommentsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noCommentsText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  input: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
    color: colors.text.primary,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});