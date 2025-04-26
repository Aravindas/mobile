import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  ScrollView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/auth-store';
import Input from '@/components/Input';
import Button from '@/components/Button';
import colors from '@/constants/colors';

export default function EditProfileScreen() {
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [about, setAbout] = useState('');
  const [currentPosition, setCurrentPosition] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setHeadline(user.headline || '');
      setLocation(user.location || '');
      setAbout(user.about || '');
      setCurrentPosition(user.current_position || '');
      setAvatarUrl(user.avatar_url);
    }
  }, [user]);
  
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error]);
  
  const handleChangeAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant permission to access your photos');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setAvatarUrl(result.assets[0].uri);
    }
  };
  
  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: fullName,
        headline,
        location,
        about,
        current_position: currentPosition,
        avatar_url: avatarUrl,
      });
      
      router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Edit Profile',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Button
              title="Save"
              onPress={handleSave}
              disabled={isLoading || !fullName.trim()}
              loading={isLoading}
              variant="primary"
              size="small"
            />
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.avatarSection}>
            {avatarUrl ? (
              <Image 
                source={{ uri: avatarUrl }} 
                style={styles.avatar} 
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {fullName.charAt(0)}
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.changeAvatarButton}
              onPress={handleChangeAvatar}
            >
              <Camera size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              autoCapitalize="words"
              error={!fullName.trim() ? 'Full name is required' : ''}
            />
            
            <Input
              label="Headline"
              value={headline}
              onChangeText={setHeadline}
              placeholder="E.g., Product Manager at TechCorp"
              autoCapitalize="sentences"
            />
            
            <Input
              label="Current Position"
              value={currentPosition}
              onChangeText={setCurrentPosition}
              placeholder="E.g., Senior Product Manager"
              autoCapitalize="sentences"
            />
            
            <Input
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="E.g., San Francisco, CA"
              autoCapitalize="words"
            />
            
            <Input
              label="About"
              value={about}
              onChangeText={setAbout}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
              autoCapitalize="sentences"
            />
          </View>
        </ScrollView>
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
  avatarSection: {
    alignItems: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  form: {
    width: '100%',
  },
});