import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { 
  MapPin, 
  Briefcase, 
  Users, 
  MessageSquare,
  UserPlus,
  UserCheck,
  Share2
} from 'lucide-react-native';
import { User } from '@/types';
import Button from '@/components/Button';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { mockUsers } from '@/mocks/users';
import { useConnectionsStore } from '@/store/connections-store';

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  
  const { 
    connections, 
    pendingConnections,
    sendConnectionRequest,
    fetchConnections,
    fetchPendingConnections
  } = useConnectionsStore();
  
  useEffect(() => {
    // Load connections data
    Promise.all([
      fetchConnections(),
      fetchPendingConnections()
    ]);
    
    // Find the user in the mock data
    const user = mockUsers.find(u => u.id === id);
    if (user) {
      setProfile(user);
    }
    
    setIsLoading(false);
  }, [id]);
  
  useEffect(() => {
    // Check if already connected
    const connection = connections.find(
      conn => conn.connected_user?.id === id
    );
    setIsConnected(!!connection);
    
    // Check if connection is pending
    const pendingConnection = pendingConnections.find(
      conn => conn.connected_user?.id === id
    );
    setIsPending(!!pendingConnection);
  }, [connections, pendingConnections, id]);
  
  const handleConnect = () => {
    if (profile) {
      sendConnectionRequest(profile.id);
      setIsPending(true);
    }
  };
  
  const handleMessage = () => {
    if (profile) {
      router.push(`/messages/${profile.id}`);
    }
  };
  
  const handleShare = () => {
    Alert.alert('Share Profile', 'Sharing functionality would be implemented here.');
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
  
  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Profile not found</Text>
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
      {/* <Stack.Screen options={{ title: profile.full_name }} /> */}
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleShare}
            >
              <Share2 size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileHeader}>
            {profile.avatar_url ? (
              <Image 
                source={{ uri: profile.avatar_url }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>
                  {/* {profile.full_name.charAt(0)} */}
                </Text>
              </View>
            )}
            
            {/* <Text style={styles.name}>{profile.full_name}</Text>
            {profile.headline && (
              <Text style={styles.headline}>{profile.headline}</Text>
            )} */}
            
            {profile.location && (
              <View style={styles.infoRow}>
                <MapPin size={16} color={colors.text.tertiary} />
                <Text style={styles.infoText}>{profile.location}</Text>
              </View>
            )}
            
            {profile.connections_count !== undefined && (
              <View style={styles.infoRow}>
                <Users size={16} color={colors.text.tertiary} />
                <Text style={styles.infoText}>
                  {profile.connections_count} connections
                </Text>
              </View>
            )}
            
            <View style={styles.actions}>
              {isConnected ? (
                <Button
                  title="Message"
                  onPress={handleMessage}
                  variant="outline"
                  style={styles.actionButton}
                  icon={<MessageSquare size={16} color={colors.primary} />}
                />
              ) : isPending ? (
                <Button
                  title="Pending"
                  onPress={() => {}} // No-op function for disabled button
                  disabled
                  variant="outline"
                  style={styles.actionButton}
                  icon={<UserCheck size={16} color={colors.text.tertiary} />}
                />
              ) : (
                <Button
                  title="Connect"
                  onPress={handleConnect}
                  variant="primary"
                  style={styles.actionButton}
                  icon={<UserPlus size={16} color={colors.white} />}
                />
              )}
            </View>
          </View>
        </View>
        
        {profile.about && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{profile.about}</Text>
          </Card>
        )}
        
        {profile.current_position && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.experienceItem}>
              <Briefcase size={20} color={colors.text.secondary} />
              <View style={styles.experienceContent}>
                <Text style={styles.experienceTitle}>{profile.current_position}</Text>
                <Text style={styles.experienceCompany}>Current Position</Text>
              </View>
            </View>
          </Card>
        )}
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
  actions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    minWidth: 140,
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
});