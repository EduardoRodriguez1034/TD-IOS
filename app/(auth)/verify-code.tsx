import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import { COLORS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import OTPInput from '../components/OTPInput';
import { useAuthStore } from '../store/authStore';

const VerifyCodeScreen = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const router = useRouter();
  const { verifyEmail, error, isLoading } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await verifyEmail(code.join(''));

      if (!result.success) {
        console.log('Error:', result.message);
        return;
      } else {
        router.replace('/success');
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Verificar correo electrónico',
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

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="email-outline" size={40} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Revisa tu Correo</Text>
        <Text style={styles.subtitle}>Enviamos un código a tu correo</Text>
        <OTPInput code={code} setCode={setCode} />
        {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Confirmar Código'}
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 32,
  },
  button: {
    width: '100%',
    marginTop: 24,
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

export default VerifyCodeScreen; 