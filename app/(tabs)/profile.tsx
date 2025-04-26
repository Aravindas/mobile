import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  MapPin, 
  Briefcase, 
  Users, 
  Edit, 
  LogOut,
  Share2
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/Button';
import Card from '@/components/Card';
import colors from '@/constants/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  console.log("user",user)
  const router = useRouter();
  
  const handleEditProfile = () => {
    router.push('/edit-profile');
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          }
        }
      ]
    );
  };
  
  const handleShare = () => {
    Alert.alert('Share Profile', 'Sharing functionality would be implemented here.');
  };
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleShare}
            >
              <Share2 size={20} color={colors.text.secondary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileHeader}>
            {user.avatar_url ? (
              <Image 
                source={{ uri: user.avatar_url }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>
                  {/* {user.full_name.charAt(0)} */}
                </Text>
              </View>
            )}
            
            <Text style={styles.name}>{user.full_name}</Text>
            {user.headline && (
              <Text style={styles.headline}>{user.headline}</Text>
            )}
            
            {user.location && (
              <View style={styles.infoRow}>
                <MapPin size={16} color={colors.text.tertiary} />
                <Text style={styles.infoText}>{user.location}</Text>
              </View>
            )}
            
            {user.connections_count !== undefined && (
              <View style={styles.infoRow}>
                <Users size={16} color={colors.text.tertiary} />
                <Text style={styles.infoText}>
                  {user.connections_count} connections
                </Text>
              </View>
            )}
            
            <Button
              title="Edit Profile"
              onPress={handleEditProfile}
              variant="outline"
              style={styles.editButton}
              fullWidth
              icon={<Edit size={16} color={colors.primary} />}
            />
          </View>
        </View>
        
        {user.about && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{user.about}</Text>
          </Card>
        )}
        
        {user.current_position && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.experienceItem}>
              <Briefcase size={20} color={colors.text.secondary} />
              <View style={styles.experienceContent}>
                <Text style={styles.experienceTitle}>{user.current_position}</Text>
                <Text style={styles.experienceCompany}>Current Position</Text>
              </View>
            </View>
          </Card>
        )}
        
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity 
            style={styles.accountOption}
            onPress={handleLogout}
          >
            <LogOut size={20} color={colors.text.secondary} />
            <Text style={styles.accountOptionText}>Logout</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImagePlaceholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  headline: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginLeft: 6,
  },
  editButton: {
    marginTop: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  experienceItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  experienceContent: {
    marginLeft: 12,
    flex: 1,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  accountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  accountOptionText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 12,
  },
});