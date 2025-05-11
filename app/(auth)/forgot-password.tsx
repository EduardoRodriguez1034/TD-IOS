import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Redirect, useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import { Stack } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { SuccessModal } from '../components/SuccessModal';

const ForgotPasswordScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const { checkAuth } = useAuthStore();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  // Si ya está logueado, redirige a la home
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const { forgotPassword, isLoading, error } = useAuthStore();

  const handleNext = async (e) => {
    try {
      if (email.trim()) {

        const result = await forgotPassword(email);

        if (!result.success) {
          return;
        } else {
          setSuccessModalVisible(true);
          setTimeout(() => {
            setSuccessModalVisible(false);
            router.replace('/login');
          }, 5000);
        }
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return;
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Recuperar Contraseña',
          headerLeft: () => (
            <Button
              onPress={() => router.back()}
              style={styles.backButton}
            >
              Volver
            </Button>
          ),
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
        }}
      />

      <View style={styles.formContainer}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          placeholder="Ingresa tu correo electrónico"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={!email.trim() || isLoading}
        >
          {isLoading ? 'Cargando...' : 'Siguiente'}
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
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.black,
  },
  input: {
    marginBottom: 20,
    backgroundColor: COLORS.white,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: COLORS.black,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginLeft: 8,
  },
});

export default ForgotPasswordScreen; 