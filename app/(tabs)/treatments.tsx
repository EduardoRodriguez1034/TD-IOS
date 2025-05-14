import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, Alert } from 'react-native';
import { Text, Button, Card, Title, FAB } from 'react-native-paper';
import { COLORS } from '../constants/theme';
import { useAuthStore, useTreatment } from '../store/authStore';
import { Redirect, useRouter } from 'expo-router';
import { SuccessModal } from '../components/SuccessModal';
import { CreateTreatmentModal } from '../components/CreateTreatment';
import { EditTreatmentModal } from '../components/EditTreatmentModal'

const CreateTreatment = () => {
    const router = useRouter();
    const [treatmentType, setTreatmentType] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [treatments, setTreatments] = useState([]);
    const [treatmentToEdit, setTreatmentToEdit] = useState(null);
    const [isLoadingTreatments, setIsLoadingTreatments] = useState(false);

    const { createTreatment, getAllTreatments, updateTreatment } = useTreatment();

    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth])

    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    // Si no está logueado, redirige al login
    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/(auth)");
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchTreatments = async () => {
            setIsLoadingTreatments(true)
            const response = await getAllTreatments();
            if (response.success && Array.isArray(response.treatment)) {
                const sorted = [...response.treatment].sort((a, b) =>
                    a.treatmentType.localeCompare(b.treatmentType, 'es', { sensitivity: 'base' })
                );
                setTreatments(sorted);
                setIsLoadingTreatments(false)
            } else {
                setTreatments([]);
                setIsLoadingTreatments(false)
            }
        };
        fetchTreatments();
    }, []);

    const handleCreateTreatment = async ({ treatmentType, price, description }) => {
        try {

            const res = await createTreatment(treatmentType, price, description);
            if (res.success) {
                const updated = await getAllTreatments();
                if (updated.success) {
                    const sorted = [...updated.treatment].sort((a, b) =>
                        a.treatmentType.localeCompare(b.treatmentType, 'es', { sensitivity: 'base' })
                    );
                    setTreatments(sorted);
                }
                setCreateModalVisible(false);
                setSuccessModalVisible(true);
                setTimeout(() => {
                    setSuccessModalVisible(false);
                }, 2000);

            }
        } catch (error) {
            throw Alert.alert('Error', error)
        }
    };

    const handleOpenEditModal = (treatment) => {
        setTreatmentToEdit(treatment);
        setEditModalVisible(true);
    };

    const handleSaveEdit = async (updatedData) => {
        try {
            const res = await updateTreatment(treatmentToEdit.idTreatment, updatedData);
            if (res.success) {
                const refreshed = await getAllTreatments();
                if (refreshed.success) {
                    const sorted = [...refreshed.treatment].sort((a, b) =>
                        a.treatmentType.localeCompare(b.treatmentType, 'es', { sensitivity: 'base' })
                    );
                    setTreatments(sorted);
                }
                setEditModalVisible(false);
                setTreatmentToEdit(null);

                setSuccessModalVisible(true);
                setTimeout(() => {
                    setSuccessModalVisible(false);
                }, 2000);

            } else {
                Alert.alert('Error', 'No se pudo actualizar el tratamiento');
            }
        } catch (error) {
            throw Alert.alert('Error', error)
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
                        <Text style={styles.screenTitle}>Tratamientos</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ marginTop: 16 }}>
                        {isLoadingTreatments ? (
                            <Text>Cargando tratamientos...</Text>
                        ) : treatments.length === 0 ? (
                            <Text>No hay tratamientos registrados.</Text>
                        ) : (
                            treatments.map((treatment) => (
                                <Card key={treatment.idTreatment} style={styles.card}>
                                    <Card.Content style={styles.cardContent}>
                                        <View style={styles.leftColumn}>
                                            <Title>{treatment.treatmentType}</Title>
                                            <Text>Precio: ${treatment.price}</Text>
                                            {treatment.description ? <Text>{treatment.description}</Text> : null}
                                        </View>
                                        <View style={styles.rightColumn}>
                                            <Button
                                                icon="pencil"
                                                onPress={() => handleOpenEditModal(treatment)}
                                                style={styles.actionButton}
                                                contentStyle={styles.buttonContent}
                                            >
                                                Editar
                                            </Button>
                                        </View>
                                    </Card.Content>
                                </Card>
                            ))
                        )
                        }
                    </View>
                </ScrollView>

                <FAB
                    icon="medical-bag"
                    style={styles.fab}
                    onPress={() => setCreateModalVisible(true)}
                    mode="elevated"
                    color="white"
                    size="large"
                    customSize={64}
                />
            </KeyboardAvoidingView>

            <SuccessModal
                visible={successModalVisible}
                title="Tratamiento creado exitosamente"
                message="El tratamiento ha sido registrado en el sistema."
                buttonText="Volver al listado"
                onDismiss={() => {
                    setSuccessModalVisible(false);
                }}
            />

            <CreateTreatmentModal
                visible={createModalVisible}
                onDismiss={() => setCreateModalVisible(false)}
                onCreate={handleCreateTreatment}
            />

            <EditTreatmentModal
                visible={editModalVisible}
                treatment={treatmentToEdit ?? {
                    idTreatment: '',
                    treatmentType: '',
                    price: '',
                    description: ''
                }}
                onSave={handleSaveEdit}
                onCancel={() => {
                    setEditModalVisible(false);
                    setTreatmentToEdit(null);
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
    actionButtons: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    actionButton: {
        borderRadius: 6,
        paddingHorizontal: 4,
    },
    leftColumn: {
        flex: 1,
        justifyContent: 'flex-start',
        gap: 4,
    },
    rightColumn: {
        paddingTop: 15,
        width: 140,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        gap: 8,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 2,
        backgroundColor: 'white',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
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
    fab: {
        position: 'absolute',
        margin: 0,
        right: 16,
        bottom: Platform.OS === 'ios' ? 34 : 70,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default CreateTreatment; 