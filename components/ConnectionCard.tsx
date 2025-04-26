import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '@/types';
import Avatar from './Avatar';
import Button from './Button';
import Card from './Card';
import colors from '@/constants/colors';

interface ConnectionCardProps {
  user: User;
  isPending?: boolean;
  isConnection?: boolean;
  onPress?: (userId: string) => void;
  onConnect?: (userId: string) => void;
  onAccept?: (userId: string) => void;
  onIgnore?: (userId: string) => void;
  onMessage?: (userId: string) => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  user,
  isPending = false,
  isConnection = false,
  onPress,
  onConnect,
  onAccept,
  onIgnore,
  onMessage,
}) => {
  const handlePress = () => {
    if (onPress) onPress(user.id);
  };
  
  const handleConnect = () => {
    if (onConnect) onConnect(user.id);
  };
  
  const handleAccept = () => {
    if (onAccept) onAccept(user.id);
  };
  
  const handleIgnore = () => {
    if (onIgnore) onIgnore(user.id);
  };
  
  const handleMessage = () => {
    if (onMessage) onMessage(user.id);
  };
  
  return (
    <Card style={styles.card} elevation="low">
      <TouchableOpacity 
        style={styles.container} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Avatar 
          uri={user.avatar_url} 
          name={user.full_name} 
          size="large" 
        />
        
        <View style={styles.info}>
          <Text style={styles.name}>{user.full_name}</Text>
          {user.headline && (
            <Text style={styles.headline}>{user.headline}</Text>
          )}
          {user.location && (
            <Text style={styles.location}>{user.location}</Text>
          )}
          {user.connections_count !== undefined && (
            <Text style={styles.connections}>
              {user.connections_count} connections
            </Text>
          )}
        </View>
      </TouchableOpacity>
      
      <View style={styles.actions}>
        {isPending ? (
          <>
            <Button 
              title="Accept" 
              onPress={handleAccept} 
              variant="primary" 
              size="small" 
              style={styles.actionButton} 
            />
            <Button 
              title="Ignore" 
              onPress={handleIgnore} 
              variant="outline" 
              size="small" 
              style={styles.actionButton} 
            />
          </>
        ) : isConnection ? (
          <Button 
            title="Message" 
            onPress={handleMessage} 
            variant="outline" 
            size="small" 
            fullWidth 
          />
        ) : (
          <Button 
            title="Connect" 
            onPress={handleConnect} 
            variant="outline" 
            size="small" 
            fullWidth 
          />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headline: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  connections: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default ConnectionCard;