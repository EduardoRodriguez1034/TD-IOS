import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { Redirect, useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';

const LoginScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const { login, checkAuth, error } = useAuthStore();

  useEffect(()=>{
    checkAuth()
  }, [checkAuth])

  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  // Si ya está logueado, redirige a la home
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      if (!result.success) {
        return;
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return;

    }
  };

  const handleForgotPassword = () => {
    router.push(`/forgot-password/`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Title style={styles.title}>Truval Dental</Title>
        <Text style={styles.welcomeText}>¡Bienvenido de vuelta!</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry={secureTextEntry}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? 'eye' : 'eye-off'}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
        />
        {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
        <Button
          mode="text"
          onPress={handleForgotPassword}
          style={styles.forgotPasswordButton}
          labelStyle={styles.forgotPasswordText}
        >
          ¿Olvidó su contraseña?
        </Button>

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Iniciar Sesión
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  welcomeText: {
    fontSize: 18,
    color: COLORS.gray,
    marginTop: 8,
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 