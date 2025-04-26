import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  ScrollView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Image as ImageIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePostsStore } from '@/store/posts-store';
import { useAuthStore } from '@/store/auth-store';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import colors from '@/constants/colors';

export default function CreatePostScreen() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageContent, setImageContent] = useState<object | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createPost } = usePostsStore();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant permission to access your photos');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageContent(result.assets[0]);
    }
  };
  
  const handleRemoveImage = () => {
    setImage(null);
    setImageContent(null);
  };
  
  const handleSubmit = useCallback(async () => {
    if (!content.trim() && !imageContent) {
      Alert.alert('Error', 'Please add some text or an image to your post');
      return;
    }
    setIsSubmitting(true);
    
    try {
      await createPost(content, imageContent || undefined);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [content, imageContent]);
  
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView style={styles.scrollView}> 
          <TextInput
            style={styles.contentInput}
            placeholder="What do you want to talk about?"
            placeholderTextColor={colors.placeholder}
            value={content}
            onChangeText={setContent}
            multiline
            autoFocus
          />
          
          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={handleRemoveImage}
              >
                <X size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddImage}
          >
            <ImageIcon size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        <View>
          <Button
                title="Post"
                onPress={handleSubmit}
                disabled={false}
                loading={false}
                variant="primary"
                size="medium"
              />
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerButton: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  userHeadline: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  contentInput: {
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  imageContainer: {
    marginTop: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  addButton: {
    padding: 8,
  },
});