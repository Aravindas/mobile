import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import colors from '@/constants/colors';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  padding?: 'none' | 'small' | 'medium' | 'large';
  radius?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'low',
  padding = 'medium',
  radius = 'medium',
}) => {
  // Get elevation style
  const getElevationStyle = () => {
    switch (elevation) {
      case 'none':
        return {};
      case 'low':
        return styles.elevationLow;
      case 'medium':
        return styles.elevationMedium;
      case 'high':
        return styles.elevationHigh;
      default:
        return styles.elevationLow;
    }
  };
  
  // Get padding style
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'small':
        return { padding: 8 };
      case 'medium':
        return { padding: 16 };
      case 'large':
        return { padding: 24 };
      default:
        return { padding: 16 };
    }
  };
  
  // Get border radius style
  const getRadiusStyle = () => {
    switch (radius) {
      case 'none':
        return { borderRadius: 0 };
      case 'small':
        return { borderRadius: 4 };
      case 'medium':
        return { borderRadius: 8 };
      case 'large':
        return { borderRadius: 16 };
      default:
        return { borderRadius: 8 };
    }
  };
  
  return (
    <View
      style={[
        styles.card,
        getElevationStyle(),
        getPaddingStyle(),
        getRadiusStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    marginVertical: 8,
  },
  elevationLow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  elevationMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  elevationHigh: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default Card;