import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import { Stack } from 'expo-router';
import { useAuthStore } from '../store/authStore';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const { forgotPassword, isLoading, error } = useAuthStore();
  const router = useRouter();

  const handleNext = async (e) => {
    e.preventDefault();
    try {
      if (email.trim()) {

        const result = await forgotPassword(email);

        if (!result.success) {
          console.log('Error:', result.message);
          return;
        } else {
          router.replace('/password-mail');
        }
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return;
    }
  };

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