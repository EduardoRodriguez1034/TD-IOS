import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useRouter, Stack, useLocalSearchParams, Redirect } from 'expo-router';
import { COLORS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { SuccessModal } from '../components/SuccessModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const NewPasswordScreen = () => {
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
    const [successModalVisible, setSuccessModalVisible] = useState(false);


    const { token } = useLocalSearchParams();
    const { checkAuth, resetPassword, isLoading, error } = useAuthStore();

    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    useEffect(() => {
        checkAuth();
    }, [checkAuth])

    // Si ya está logueado, redirige a la home
    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/(tabs)");
        }
    }, [isAuthenticated]);

    const validatePassword = (pass: string) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasNumbers = /\d/.test(pass);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        return pass.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    };

    const getPasswordErrors = () => {
        if (!password) return '';
        const errors = [];
        if (password.length < 8) errors.push('Mínimo 8 caracteres');
        if (!/[A-Z]/.test(password)) errors.push('Una mayúscula');
        if (!/[a-z]/.test(password)) errors.push('Una minúscula');
        if (!/\d/.test(password)) errors.push('Un número');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Un carácter especial');
        return errors.join(' • ');
    };

    const handleResetPassword = async (e) => {
        try {
            const result = await resetPassword(token, password);
            if (result.success && validatePassword(password) && password === confirmPassword) {
                setSuccessModalVisible(true);
                setTimeout(() => {
                    setSuccessModalVisible(false);
                }, 5000);
            } else {
                return;
            }

        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            return;
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Cambiar contraseña',
                    }}
                />

                <View style={styles.content}>
                    <Text style={styles.subtitle}>
                        Tu nueva contraseña debe ser diferente a las utilizadas anteriormente.
                    </Text>

                    <TextInput
                        label="Nueva Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secureTextEntry}
                        mode="outlined"
                        style={styles.input}
                        right={
                            <TextInput.Icon
                                icon={secureTextEntry ? 'eye' : 'eye-off'}
                                onPress={() => setSecureTextEntry(!secureTextEntry)}
                            />
                        }
                    />
                    <HelperText type="error" visible={!!getPasswordErrors()}>
                        {getPasswordErrors()}
                    </HelperText>

                    <TextInput
                        label="Confirmar Contraseña"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={secureConfirmTextEntry}
                        mode="outlined"
                        style={styles.input}
                        right={
                            <TextInput.Icon
                                icon={secureConfirmTextEntry ? 'eye' : 'eye-off'}
                                onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                            />
                        }
                    />
                    <HelperText type="error" visible={confirmPassword && password !== confirmPassword}>
                        Las contraseñas no coinciden
                    </HelperText>

                    {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
                    <Button
                        mode="contained"
                        onPress={handleResetPassword}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        disabled={!validatePassword(password) || password !== confirmPassword || isLoading}
                    >
                        {isLoading ? 'Cargando...' : 'Restablecer Contraseña'}
                    </Button>
                </View>
            </View>
            <SuccessModal
                visible={successModalVisible}
                title="Contraseña cambiada con exito."
                message="La contraseña ha sido cambiada con exito."
                buttonText="Volver al inicio de sesión."
                onDismiss={() => {
                    setSuccessModalVisible(false);
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    content: {
        padding: 20,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 24,
    },
    input: {
        marginBottom: 4,
        backgroundColor: COLORS.white,
    },
    button: {
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

export default NewPasswordScreen; 