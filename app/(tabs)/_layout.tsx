import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';
import { PaperProvider, DefaultTheme } from 'react-native-paper';

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.lightGray || '#F5F5F5',
    surface: 'white',
    text: '#000000',
  },
};

const { height } = Dimensions.get('window');
const isIphoneX = Platform.OS === 'ios' && height >= 812;

export default function TabLayout() {
  return (
    <PaperProvider theme={customTheme}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            height: Platform.OS === 'ios' ? (isIphoneX ? 95 : 85) : 65,
            paddingBottom: Platform.OS === 'ios' ? (isIphoneX ? 35 : 25) : 12,
            paddingTop: 8,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#eee',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: -4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="patients"
          options={{
            title: 'Pacientes',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            title: 'Agenda de Citas',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="treatments"
          options={{
            title: 'Tratamientos',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="medical-bag" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
} 