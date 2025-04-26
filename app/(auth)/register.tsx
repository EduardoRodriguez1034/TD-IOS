import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';


const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { signup, isLoading, error } = useAuthStore();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(username, email, password);
      if (!result.success) {
        console.log("Error:", result.message);
        return;
      } else {
        router.replace('/verify-code');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Title style={styles.title}>Regístrate en Truval Dental</Title>
      </View>
      <TextInput
        id="username"

        label="Nombre de Usuario"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        id='email'
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        id='password'
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
      />
      {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.registerButton}
          labelStyle={styles.buttonLabel}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Registrarse'}
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  input: {
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  registerButton: {
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

export default RegisterScreen; 