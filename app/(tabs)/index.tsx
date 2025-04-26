import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import { usePostsStore } from '@/store/posts-store';
import { useAuthStore } from '@/store/auth-store';
import PostCard from '@/components/PostCard';
import colors from '@/constants/colors';

export default function HomeScreen() {
  const { posts, isLoading, error, fetchPosts, likePost, clearError } = usePostsStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };
  
  const handleLike = (postId: string) => {
    likePost(postId);
  };
  
  const handleComment = (postId: string) => {
    router.push(`/post/${postId}`);
  };
  
  const handleShare = (postId: string) => {
    Alert.alert('Share', 'Sharing functionality would be implemented here.');
  };
  
  const handleProfilePress = (userId: string) => {
    router.push(`/profile/${userId}`);
  };
  
  const handlePostPress = (postId: string) => {
    router.push(`/post/${postId}`);
  };
  
  const handleCreatePost = () => {
    router.push('/create-post');
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.greeting}>
        Welcome, {user?.full_name?.split(' ')[0] || 'User'}
      </Text>
      <TouchableOpacity style={styles.searchButton}>
        <Search size={20} color={colors.text.secondary} />
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onProfilePress={handleProfilePress}
            onPostPress={handlePostPress}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts yet</Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={handleCreatePost}
              >
                <Text style={styles.emptyButtonText}>Create your first post</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
      
      {isLoading && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleCreatePost}
        activeOpacity={0.8}
      >
        <Plus size={24} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  header: {
    marginVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchText: {
    marginLeft: 8,
    color: colors.text.secondary,
    fontSize: 16,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  emptyButton: {
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});