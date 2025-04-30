import React from 'react';
import { View, StyleSheet, ScrollView, Platform, SafeAreaView } from 'react-native';
import { Text, Card, Title, Avatar, Chip, Divider, IconButton, FAB, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../constants/theme';
import { useEffect, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { usePatient, useClinicalRecord, useTreatment, useInformedConsent, useAppointment } from '../store/authStore';

export const options = {
    tabBarButton: () => null,
  };

const PatientDetailsScreen = () => {
    const router = useRouter();
    const { idPatient } = useLocalSearchParams();
    const [patient, setPatient] = useState(null);
    const [clinical, setClinicalRecord] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const [isLoadingTreatments, setIsLoadingTreatments] = useState(false);
    const [treatmentNames, setTreatmentNames] = useState([]);
    const [file, setFile] = useState<SelectedFile | null>(null);
    const { getAPatient, isLoading, isAuthenticated, error } = usePatient();
    const { getClinicalRecordByPatientId } = useClinicalRecord();
    const { getATreatment } = useTreatment();
    const { addInformedConsent, getInformedConsent } = useInformedConsent();
    const { getAppointmentByPatientId } = useAppointment();

    type FileData = {
        uri: string;
        name: string;
        type: string;
    };
    type SelectedFile = {
        uri: string;
        name: string;
        type: string;
    };

    useEffect(() => {
        const fetchPatient = async () => {
            if (idPatient) {
                const response = await getAPatient(idPatient);
                if (response.success) {
                    setPatient(response.patient);
                } else {
                    console.error('Error fetching patient:', response.error);
                }
            }
        };

        const fetchCliinicalRecord = async () => {
            if (idPatient) {
                const response = await getClinicalRecordByPatientId(idPatient);
                if (response.success) {
                    setClinicalRecord(response.clinical);
                } else {
                    console.error('Error fetching clinical record:', response.error);
                }
            }
        }

        const fetchAppointment = async () => {
            if (idPatient) {
                const response = await getAppointmentByPatientId(idPatient);
                if (response.success) {
                    setAppointment(response.appointment);
                }
                else {
                    console.error('Error fetching appointment:', response.error);
                }
            }
        }

        fetchPatient();
        fetchCliinicalRecord();
        fetchAppointment();

    }, [idPatient]);

    useEffect(() => {
        const fetchTreatmentNames = async () => {
            if (clinical?.treatmentsDone && clinical.treatmentsDone !== "") {
                setIsLoadingTreatments(true);
                try {
                    const names = [];
                    for (const idTreatment of clinical.treatmentsDone) {
                        const response = await getATreatment(idTreatment);
                        if (response.success && response.treatment) {
                            names.push(response.treatment.treatmentType);
                        }
                    }
                    setTreatmentNames(names);
                } catch (error) {
                    console.error('Error fetching treatment names:', error);
                } finally {
                    setIsLoadingTreatments(false);
                }
            }
        };
        if (clinical) {
            fetchTreatmentNames();
        }
    }, [clinical]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return '#4CAF50';
            case 'inactive':
                return '#9E9E9E';
            default:
                return '#757575';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'inactive':
                return 'Inactivo';
            default:
                return 'Desconocido';
        }
    };

    const getFullName = () => {
        return [patient.name, patient.lastName, patient.surName]
            .filter(Boolean)
            .join(' ');
    };

    const calculateAge = () => {
        const today = new Date();
        const birthDate = new Date(patient.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf', // o el tipo que necesites
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedFile = result.assets[0];
                setFile({
                    uri: selectedFile.uri,
                    name: selectedFile.name,
                    type: selectedFile.mimeType
                });
            }
        } catch (err) {
            console.error('Error al seleccionar archivo:', err);
            alert('Error al seleccionar el archivo');
        }
    };

    const getNextAppointmentDate = () => {
        if (appointment && appointment.date) {
            return new Date(appointment.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return null;
    }

    const submit = async () => {
        if (!file || !idPatient) return;

        const formData = new FormData();

        // Aquí está la corrección clave
        const fileToUpload = {
            uri: file.uri,
            name: file.name,
            type: file.type
        };

        formData.append('file', fileToUpload as unknown as Blob); // Esta es la conversión de tipos necesaria

        try {
            const result = await addInformedConsent(formData, idPatient.toString());
            if (result?.success) {
                alert('Consentimiento subido con éxito');
                router.replace(`/patient/${idPatient}`);
            } else {
                alert(result?.message || 'Error al subir el consentimiento');
            }
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            alert('Error al procesar el archivo');
        }
    };

    if (!patient) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.mainContainer}>
                    <Text>Cargando paciente...</Text>
                </View>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.screenTitle}>Detalles del Paciente</Text>
                    </View>
                    <IconButton
                        icon="pencil"
                        size={24}
                        onPress={() => {/* Implementar edición */ }}
                        style={styles.editIcon}
                    />
                </View>

                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={styles.patientHeader}>
                                <Avatar.Text
                                    size={80}
                                    label={patient.name.split(' ').map(n => n[0]).join('')}
                                    style={styles.avatar}
                                />
                                <View style={styles.patientInfo}>
                                    <Title style={styles.patientName}>{getFullName()}</Title>
                                    <Chip
                                        mode="outlined"
                                        style={[styles.statusChip, { borderColor: getStatusColor(patient.status) }]}
                                        textStyle={{ color: getStatusColor(patient.status) }}
                                    >
                                        {getStatusLabel(patient.status)}
                                    </Chip>
                                </View>
                            </View>

                            <Divider style={styles.divider} />

                            <View style={styles.infoSection}>
                                <Title style={styles.sectionTitle}>Información Personal</Title>
                                <View style={styles.infoGrid}>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Fecha de Nacimiento</Text>
                                        <Text style={styles.infoValue}>
                                            {new Date(patient.birthDate).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Edad</Text>
                                        <Text style={styles.infoValue}>{calculateAge()} años</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Teléfono</Text>
                                        <Text style={styles.infoValue}>{patient.phone}</Text>
                                    </View>
                                </View>
                            </View>

                            <Divider style={styles.divider} />

                            <View style={styles.infoSection}>
                                <Title style={styles.sectionTitle}>Próxima Cita</Title>
                                {patient.nextAppointment ? (
                                    <Card style={styles.appointmentCard}>
                                        <Card.Content>
                                            <View style={styles.appointmentHeader}>
                                                <Text style={styles.appointmentDate}>
                                                    {getNextAppointmentDate()}
                                                </Text>
                                                <View style={styles.appointmentActions}>
                                                    <IconButton
                                                        icon="pencil"
                                                        size={20}
                                                        onPress={() => {/* Implementar edición de cita */ }}
                                                        style={styles.actionIcon}
                                                    />
                                                    <IconButton
                                                        icon="delete"
                                                        size={20}
                                                        onPress={() => {/* Implementar eliminación de cita */ }}
                                                        style={styles.actionIcon}
                                                    />
                                                </View>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                ) : (
                                    <Text style={styles.noAppointmentText}>No hay citas programadas</Text>
                                )}
                            </View>

                            <Divider style={styles.divider} />

                            <View style={styles.infoSection}>
                                <Title style={styles.sectionTitle}>Historial de Tratamientos</Title>

                                {isLoadingTreatments ? (
                                    <Text>Cargando tratamientos...</Text>
                                ) : clinical && clinical.treatmentsDone && clinical.treatmentsDone.length > 0 ? (
                                    clinical.treatmentsDone.map((idTreatment, index) => (
                                        <Card key={idTreatment} style={styles.treatmentCard}>
                                            <Card.Content>
                                                <View style={styles.treatmentHeader}>
                                                    <Text style={styles.treatmentType}>
                                                        {treatmentNames[index] || 'Tratamiento'}
                                                    </Text>
                                                    {/* Aquí podrías usar una fecha real si tienes, por ahora usamos la fecha actual */}
                                                    <Text style={styles.treatmentDate}>
                                                        {new Date().toLocaleDateString('es-ES')}
                                                    </Text>
                                                </View>
                                                <Text style={styles.treatmentNotes}>
                                                    {/* Aquí también podrías traer notas reales si las tienes */}
                                                    Notas del tratamiento.
                                                </Text>
                                            </Card.Content>
                                        </Card>
                                    ))
                                ) : (
                                    <Text>No hay tratamientos registrados</Text>
                                )}
                            </View>
                            <View style={styles.uploadSection}>
                                <Button
                                    mode="contained"
                                    onPress={pickDocument}
                                    icon="file-upload"
                                >
                                    Seleccionar Consentimiento
                                </Button>

                                {file && (
                                    <Text style={styles.fileInfo}>
                                        Archivo seleccionado: {file.name}
                                    </Text>
                                )}

                                <Button
                                    mode="contained"
                                    onPress={submit}
                                    disabled={!file}
                                    style={styles.submitButton}
                                    icon="cloud-upload"
                                >
                                    Subir Consentimiento
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                </ScrollView>

                <FAB
                    icon="calendar-plus"
                    style={styles.fab}
                    onPress={() => router.push('/new-appointment')}
                    mode="elevated"
                    color="white"
                    size="large"
                    customSize={64}
                />
            </View>
        </SafeAreaView >
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
    editIcon: {
        margin: 0,
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
    patientHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        backgroundColor: COLORS.primary,
        marginRight: 16,
    },
    patientInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: 24,
        marginBottom: 8,
    },
    statusChip: {
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    divider: {
        marginVertical: 16,
    },
    infoSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 16,
        color: COLORS.primary,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    infoItem: {
        flex: 1,
        minWidth: '45%',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#000',
    },
    treatmentCard: {
        marginBottom: 12,
        borderRadius: 8,
    },
    treatmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    treatmentType: {
        fontSize: 16,
        fontWeight: '600',
    },
    treatmentDate: {
        fontSize: 14,
        color: '#666',
    },
    treatmentNotes: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    treatmentStatus: {
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    appointmentCard: {
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#e7f3ff',
    },
    appointmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    appointmentDate: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '500',
    },
    appointmentActions: {
        flexDirection: 'row',
    },
    actionIcon: {
        margin: 0,
    },
    noAppointmentText: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
    fab: {
        position: 'absolute',
        margin: 0,
        right: 16,
        bottom: Platform.OS === 'ios' ? 34 : 16,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    button: {
        marginTop: 16,
        borderRadius: 16,
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    buttonContent: {
        padding: 12,
    },
    uploadSection: {
        marginVertical: 20,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8
    },
    fileInfo: {
        marginVertical: 10,
        color: '#333',
        textAlign: 'center'
    },
    submitButton: {
        marginTop: 10,
        backgroundColor: COLORS.primary
    }
});

export default PatientDetailsScreen; 