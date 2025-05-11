import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';
import { Redirect, useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';

const SuccessScreen = () => {
  const router = useRouter();

   const { checkAuth } = useAuthStore();
    
      useEffect(() => {
      checkAuth();
    }, [checkAuth])
  
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  
    // Si ya está logueado, redirige a la home
    if (isAuthenticated) {
      return <Redirect href="/(tabs)" />;
    }

  const handleLogin = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Title style={styles.title}>¡Registro Exitoso!</Title>
        <Text style={styles.message}>Tu cuenta ha sido creada con éxito.</Text>
      </View>
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.loginButton}
        labelStyle={styles.buttonLabel}
      >
        Iniciar Sesión
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    padding: 20,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  message: {
    fontSize: 18,
    color: COLORS.gray,
    marginTop: 8,
  },
  loginButton: {
    marginTop: 24,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default SuccessScreen; 