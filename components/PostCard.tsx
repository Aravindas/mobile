import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react-native';
import { Post } from '@/types';
import Avatar from './Avatar';
import Card from './Card';
import colors from '@/constants/colors';
import { formatTimeAgo } from '@/utils/date';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onProfilePress?: (userId: string) => void;
  onPostPress?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onProfilePress,
  onPostPress,
}) => {
  const [liked, setLiked] = useState(post.liked_by_me || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  
  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prevCount => newLiked ? prevCount + 1 : prevCount - 1);
    if (onLike) onLike(post.id);
  };
  
  const handleComment = () => {
    if (onComment) onComment(post.id);
  };
  
  const handleShare = () => {
    if (onShare) onShare(post.id);
  };
  
  const handleProfilePress = () => {
    if (onProfilePress && post.user) onProfilePress(post.user.id);
  };
  
  const handlePostPress = () => {
    if (onPostPress) onPostPress(post.id);
  };
  
  return (
    <Card style={styles.card} elevation="low" padding="none">
      <TouchableOpacity 
        style={styles.header} 
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <Avatar 
          uri={post.user?.avatar_url} 
          // name={post.user?.full_name} 
          size="medium" 
        />
        <View style={styles.headerInfo}>
          {/* <Text style={styles.name}>{post.user?.full_name}</Text>
          <Text style={styles.headline}>{post.user?.headline}</Text> */}
          <Text style={styles.timestamp}>{formatTimeAgo(post.created_at)}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.content} 
        onPress={handlePostPress}
        activeOpacity={0.9}
      >
        <Text style={styles.contentText}>{post.content}</Text>
        {post.image_url && (
          <Image 
            source={{ uri: post.image_url }} 
            style={styles.contentImage} 
            resizeMode="cover" 
          />
        )}
      </TouchableOpacity>
      
      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {likesCount > 0 && `${likesCount} likes`}
          {likesCount > 0 && post.comments_count > 0 && ' • '}
          {post.comments_count > 0 && `${post.comments_count} comments`}
        </Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Heart 
            size={20} 
            color={liked ? colors.error : colors.text.tertiary} 
            fill={liked ? colors.error : 'none'} 
          />
          <Text 
            style={[
              styles.actionText, 
              liked && styles.actionTextActive
            ]}
          >
            Like
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleComment}
          activeOpacity={0.7}
        >
          <MessageCircle size={20} color={colors.text.tertiary} />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Share2 size={20} color={colors.text.tertiary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  headline: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 12,
  },
  contentText: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: 12,
  },
  contentImage: {
    width: '100%',
    height: 300,
    borderRadius: 4,
    marginBottom: 12,
  },
  stats: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  statsText: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  actionText: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginLeft: 6,
  },
  actionTextActive: {
    color: colors.error,
  },
});

export default PostCard;