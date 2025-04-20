import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Title } from 'react-native-paper';

const HomePage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Title style={styles.title}>Truval Dental</Title>
      </View>
      <Button
        mode="contained"
        style={styles.loginButton}
        labelStyle={styles.buttonLabel}
        onPress={() => router.push('/login')}
      >
        Iniciar Sesión
      </Button>
      <Button
        mode="contained"
        style={styles.registerButton}
        labelStyle={styles.buttonLabel}
        onPress={() => router.push('/register')}
      >
        Registrarse
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
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
    color: '#2C3E50',
  },
  loginButton: {
    marginBottom: 10,
    paddingVertical: 8,
    backgroundColor: '#2C3E50',
    borderRadius: 8,
  },
  registerButton: {
    marginBottom: 10,
    paddingVertical: 8,
    backgroundColor: '#3498DB',
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomePage; 