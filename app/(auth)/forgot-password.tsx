import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import { Stack } from 'expo-router';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleNext = () => {
    if (email.trim()) {
      // Aquí implementaremos el envío del código
      console.log('Enviando código a:', email);
      // Navegar a la pantalla de verificación
      router.push({
        pathname: '/verify-code',
        params: { email: email }
      });
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

        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={!email.trim()}
        >
          Siguiente
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