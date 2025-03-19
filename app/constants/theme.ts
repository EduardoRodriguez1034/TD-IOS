import { DefaultTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#2C3E50',
  secondary: '#3498DB',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#7F8C8D',
  lightGray: '#ECF0F1',
  error: '#E74C3C',
  success: '#2ECC71',
  warning: '#F1C40F',
};

export const FONT = {
  regular: 'DMRegular',
  medium: 'DMMedium',
  bold: 'DMBold',
};

export const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.white,
    surface: COLORS.white,
    error: COLORS.error,
    text: COLORS.black,
    placeholder: COLORS.gray,
  },
}; 