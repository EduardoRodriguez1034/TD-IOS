import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Title } from 'react-native-paper';
import { COLORS } from '../constants/theme';
import { useTreatment } from '../store/authStore';
import { useRouter } from 'expo-router';
import { SuccessModal } from '../components/SuccessModal';

const CreateTreatment = () => {
    const router = useRouter();
    const [treatmentType, setTreatmentType] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const { createTreatment } = useTreatment();

    const resetForm = () => {
        setTreatmentType('');
        setPrice('');
        setDescription('');
      };

    const handleSubmit = async () => {
        if (!treatmentType || !price) {
            Alert.alert('Error', 'El nombre y el precio son obligatorios.');
            return;
        }
        try {
            const response = await createTreatment(treatmentType, price, description);
            if (response.success) {
                resetForm();
                setSuccessModalVisible(true);
                setTimeout(() => {
                    setSuccessModalVisible(false);
                    router.replace('/(tabs)');
                }, 2000);
            } else {
                Alert.alert('Error', response.message || 'No se pudo crear el tratamiento.');
            }
        } catch (error) {
            console.error('Error al crear tratamiento:', error);
            Alert.alert('Error', 'Ocurrió un error al crear el tratamiento.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.mainContainer}
            >
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.screenTitle}>Crear Nuevo Tratamiento</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.sectionTitle}>Información del Tratamiento</Title>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    label="Nombre del Tratamiento"
                                    value={treatmentType}
                                    onChangeText={setTreatmentType}
                                    style={styles.input}
                                    mode="outlined"
                                />
                                <TextInput
                                    label="Precio"
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="numeric"
                                    style={styles.input}
                                    mode="outlined"
                                />
                                <TextInput
                                    label="Descripción (opcional)"
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                    numberOfLines={4}
                                    style={styles.input}
                                    mode="outlined"
                                />
                            </View>

                            <View style={styles.buttonContainer}>
                                <Button
                                    mode="outlined"
                                    onPress={() => router.back()}
                                    style={styles.button}
                                    contentStyle={styles.buttonContent}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={handleSubmit}
                                    style={styles.button}
                                    contentStyle={styles.buttonContent}
                                >
                                    Crear Tratamiento
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
            <SuccessModal
                visible={successModalVisible}
                title="Tratamiento creado exitosamente"
                message="El tratamiento ha sido registrado en el sistema."
                buttonText="Volver al listado"
                onDismiss={() => {
                    setSuccessModalVisible(false);
                    router.replace('/(tabs)');
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    mainContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 8 : 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 120 : 100,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 2,
        backgroundColor: 'white',
    },
    sectionTitle: {
        marginBottom: 24,
        color: COLORS.primary,
        fontSize: 20,
    },
    inputContainer: {
        gap: 16,
    },
    input: {
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        gap: 16,
    },
    button: {
        flex: 1,
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 8,
    },
});

export default CreateTreatment; 