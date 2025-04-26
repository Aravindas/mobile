import React from 'react';
import { View, StyleSheet, Image, Text, ViewStyle } from 'react-native';
import colors from '@/constants/colors';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large' | number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'medium',
  style,
}) => {
  // Get initials from name
  const getInitials = () => {
    if (!name) return '';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return (
        nameParts[0].charAt(0).toUpperCase() + 
        nameParts[nameParts.length - 1].charAt(0).toUpperCase()
      );
    }
  };
  
  // Get size in pixels
  const getSizeInPixels = () => {
    if (typeof size === 'number') return size;
    
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 64;
      default:
        return 48;
    }
  };
  
  const sizeInPixels = getSizeInPixels();
  const fontSize = sizeInPixels * 0.4;
  
  return (
    <View
      style={[
        styles.container,
        {
          width: sizeInPixels,
          height: sizeInPixels,
          borderRadius: sizeInPixels / 2,
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>
          {getInitials()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default Avatar;