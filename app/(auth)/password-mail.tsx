import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter, Stack, Redirect } from 'expo-router';
import { COLORS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';

const PasswordEmailScreen = () => {
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

  const handleBackToLogin = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="check" size={40} color="#fff" />
        </View>

        <Text style={styles.title}>Correo de recuperación de contraseña enviado</Text>
        <Text style={styles.subtitle}>
          Revisa tu correo para seguir el proceso.
        </Text>

        <Button
          mode="contained"
          onPress={handleBackToLogin}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Volver al Inicio de Sesión
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    width: '100%',
    paddingVertical: 8,
    backgroundColor: COLORS.black,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PasswordEmailScreen; 