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
import { UserPlus } from 'lucide-react-native';
import { useConnectionsStore } from '@/store/connections-store';
import ConnectionCard from '@/components/ConnectionCard';
import colors from '@/constants/colors';

export default function NetworkScreen() {
  const { 
    connections, 
    pendingConnections, 
    connectionSuggestions,
    isLoading, 
    error, 
    fetchConnections,
    fetchPendingConnections,
    fetchConnectionSuggestions,
    sendConnectionRequest,
    acceptConnectionRequest,
    ignoreConnectionRequest,
    clearError
  } = useConnectionsStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error]);
  
  const loadData = async () => {
    await Promise.all([
      fetchConnections(),
      fetchPendingConnections(),
      fetchConnectionSuggestions()
    ]);
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleProfilePress = (userId: string) => {
    router.push(`/profile/${userId}`);
  };
  
  const handleConnect = (userId: string) => {
    sendConnectionRequest(userId);
  };
  
  const handleAccept = (connectionId: string) => {
    acceptConnectionRequest(connectionId);
  };
  
  const handleIgnore = (connectionId: string) => {
    ignoreConnectionRequest(connectionId);
  };
  
  const handleMessage = (userId: string) => {
    router.push(`/messages/${userId}`);
  };
  
  const renderPendingConnections = () => {
    if (pendingConnections.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Invitations</Text>
        <Text style={styles.sectionSubtitle}>{pendingConnections.length} pending</Text>
        
        {pendingConnections.map(connection => (
          <ConnectionCard
            key={connection.id}
            user={connection.connected_user!}
            isPending={true}
            onPress={() => handleProfilePress(connection.connected_user!.id)}
            onAccept={() => handleAccept(connection.id)}
            onIgnore={() => handleIgnore(connection.id)}
          />
        ))}
      </View>
    );
  };
  
  const renderSuggestions = () => {
    if (connectionSuggestions.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>People You May Know</Text>
        
        {connectionSuggestions.map(user => (
          <ConnectionCard
            key={user.id}
            user={user}
            onPress={() => handleProfilePress(user.id)}
            onConnect={() => handleConnect(user.id)}
          />
        ))}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={connections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConnectionCard
            user={item.connected_user!}
            isConnection={true}
            onPress={() => handleProfilePress(item.connected_user!.id)}
            onMessage={() => handleMessage(item.connected_user!.id)}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>My Network</Text>
              <Text style={styles.headerSubtitle}>
                {connections.length} {connections.length === 1 ? 'connection' : 'connections'}
              </Text>
            </View>
            
            {renderPendingConnections()}
            {renderSuggestions()}
            
            {connections.length > 0 && (
              <Text style={styles.sectionTitle}>Your Connections</Text>
            )}
          </>
        }
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
              <UserPlus size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyTitle}>No connections yet</Text>
              <Text style={styles.emptyText}>
                Connect with professionals to grow your network
              </Text>
            </View>
          ) : null
        }
      />
      
      {isLoading && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
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
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});