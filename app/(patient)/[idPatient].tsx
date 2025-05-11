import React from 'react';
import { View, StyleSheet, ScrollView, Platform, SafeAreaView, ActivityIndicator, Linking, Alert, Modal } from 'react-native';
import { Text, Card, Title, Avatar, Chip, Divider, IconButton, FAB, Button, TextInput, Portal } from 'react-native-paper';
import { useRouter, useLocalSearchParams, useFocusEffect, Stack, Redirect } from 'expo-router';
import { COLORS } from '../constants/theme';
import { useEffect, useState, useMemo, useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { usePatient, useClinicalRecord, useTreatment, useInformedConsent, useAppointment, useNote, useAuthStore } from '../store/authStore';
import { EditPatientModal } from '../components/EditPatientModal'
import { SuccessModal } from '../components/SuccessModal'
import { ConfirmModal } from '../components/ConfirmModal';

export const options = {
    tabBarButton: () => null,
};
const noteTypeMapping = {
    General: 1,
    Alergias: 2,
    Medicamentos: 3,
    Observaciones: 4,
    Otros: 5,
};

const reverseNoteTypeMapping = {
    1: 'General',
    2: 'Alergias',
    3: 'Medicamentos',
    4: 'Observaciones',
    5: 'Otros'
};

const PatientDetailsScreen = () => {
    const router = useRouter();
    const [patient, setPatient] = useState(null);
    const [clinical, setClinicalRecord] = useState(null);
    const [isLoadingTreatments, setIsLoadingTreatments] = useState(false);
    const [treatmentNames, setTreatmentNames] = useState([]);
    const [file, setFile] = useState<SelectedFile | null>(null);
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [nextTreatment, setNextTreatment] = useState<string | null>(null);
    const [informedConsent, setInformedConsent] = useState<InformedConsent | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notes, setNotes] = useState<Array<{
        idNote: number;
        title: string;
        idNoteType: number;
        description: string;
        createdAt: string;
    }>>([]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successEditVisible, setSuccessEditVisible] = useState(false);
    const [successDeleteVisible, setSuccessDeleteVisible] = useState(false);
    const [idNote, setIdNote] = useState(null);
    const [editNoteData, setEditNoteData] = useState({
        title: '',
        description: '',
        type: '',
    });

    const { getAPatient, updatePatient, isLoading, error } = usePatient();
    const { getClinicalRecordByPatientId } = useClinicalRecord();
    const { getATreatment } = useTreatment();
    const { getInformedConsent } = useInformedConsent();
    const { getNextAppointmentForPatient } = useAppointment();
    const { idPatient } = useLocalSearchParams();
    const { createNote, getNoteByPatientId, deleteNote, updateNote } = useNote();

    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth])

    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    // Si no está logueado, redirige al login
    if (!isAuthenticated) {
        return <Redirect href="/(auth)" />;
    }

    type SelectedFile = {
        uri: string;
        name: string;
        type: string;
    };
    type InformedConsent = { filename: string; url: string };

    const todayStr = useMemo(() => (new Date()).toISOString().split('T')[0], []);
    const nextAppointment = useMemo(() => {
        if (!appointments?.length) return null;

        const now = new Date();
        // parseamos y filtramos
        const futuros = appointments
            .map(a => ({ ...a, _d: new Date(a.date) }))
            .filter(a => a._d >= now)
            .sort((a, b) => a._d.getTime() - b._d.getTime());

        return futuros[0]?._d ?? null;  // Date del siguiente turno
    }, [appointments]);

    const fetchPatient = useCallback(async () => {
        if (!idPatient) return;
        const response = await getAPatient(idPatient);
        if (response.success) {
            setPatient(response.patient);
        } else {
            console.error('Error fetching patient:', response.error);
        }
    }, [idPatient, getAPatient]);

    const fetchNextAppointment = useCallback(async () => {
        if (!idPatient) return;
        setLoading(true);

        try {
            const response = await getNextAppointmentForPatient(idPatient)
            if (response.success) {
                setAppointments(response.appointment ? [response.appointment] : []);
                const treatmentRes = await getATreatment(response.appointment.idTreatment);
                if (treatmentRes.success && treatmentRes.treatment) {
                    setNextTreatment(treatmentRes.treatment.treatmentType);
                }
            }
        } catch (error) {
            setAppointments([]);
        } finally {
            setLoading(false)
        }
    }, [getNextAppointmentForPatient, todayStr, idPatient])

    const fetchClinicalRecord = useCallback(async () => {
        if (!idPatient) return;
        const response = await getClinicalRecordByPatientId(idPatient);
        if (response.success) {
            setClinicalRecord(response.clinical);
        } else {
            console.error('Error fetching clinical record:', response.error);
        }
    }, [idPatient, getClinicalRecordByPatientId]);

    const fetchTreatmentsNames = useCallback(async () => {
        if (clinical?.treatmentsDone && clinical.treatmentsDone.length > 0) {
            setIsLoadingTreatments(true);
            try {
                const names = await Promise.all(clinical.treatmentsDone.map(async (idTreatment) => {
                    const response = await getATreatment(idTreatment);
                    return response.success ? response.treatment.treatmentType : null;
                }));
                setTreatmentNames(names.filter(Boolean)); // Filtramos los nulls
            } catch (error) {
                console.error('Error fetching treatment names:', error);
            } finally {
                setIsLoadingTreatments(false);
            }
        }
    }, [clinical, getATreatment]);

    const fetchConsent = useCallback(async () => {
        try {
            if (!idPatient) return;
            const response = await getInformedConsent(idPatient);
            if (response.success && response.consent) {
                setInformedConsent(response.consent);
            }
        } catch (error) {
            console.error('Error obteniendo archivo de consentimiento informado', error)
        }
    }, [idPatient, getInformedConsent])

    const fetchPatientNotes = useCallback(async () => {
        if (!idPatient) return;

        const response = await getNoteByPatientId(idPatient);
        if (response.success) {
            setNotes(response.note); // nota: asegúrate que response.note sea un array de notas
        } else {
            console.error("Error al cargar notas del paciente:", response.error);
        }
    }, [idPatient, getNoteByPatientId]);

    useEffect(() => { fetchPatient(); }, [fetchPatient]);
    useEffect(() => { fetchClinicalRecord(); }, [fetchClinicalRecord]);
    useEffect(() => { fetchTreatmentsNames(); }, [fetchTreatmentsNames]);
    useEffect(() => { fetchConsent(); }, [fetchConsent]);
    useEffect(() => { fetchPatientNotes(); }, [fetchPatientNotes]);

    useFocusEffect(
        useCallback(() => {
            fetchNextAppointment();
        }, [fetchNextAppointment])
    )

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

    const formatDateOnly = (raw: string) => {
        const [dateOnly] = raw.split('T');
        const [year, month, day] = dateOnly.split('-');
        return `${day}/${month}/${year}`;
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

    const handleSelectFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: Platform.OS !== 'web', // Solo copiar en móvil
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedFile = result.assets[0];
                setFile({
                    uri: selectedFile.uri,
                    name: selectedFile.name,
                    type: selectedFile.mimeType
                });
            }
        } catch (error) {
            console.error('Error al seleccionar archivo:', error);
            alert('Error al seleccionar el archivo');
        }
    };

    const handleUploadFile = async () => {
        if (!file || !idPatient) return;

        try {
            const formData = new FormData();

            if (Platform.OS === 'web') {
                const blob = await fetch(file.uri).then(r => r.blob());
                formData.append('file', blob, file.name);
            } else {
                formData.append('file', {
                    uri: file.uri,
                    name: file.name,
                    type: file.type,
                } as any);
            }

            const response = await fetch(
                `https://truval-dental.ddns.net:8443/informed-consent/${idPatient}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();
            if (response.ok) {
                alert('Consentimiento subido exitosamente');
                fetchConsent();
            } else {
                throw new Error(data.message || 'Error al subir el archivo');
            }
        } catch (error) {
            console.error('Error al subir archivo:', error);
            alert(error.message || 'Error al subir el archivo');
        }
    };
    const handleEditPress = () => {
        setEditModalVisible(true);
    };

    const handleSavePatient = async ({ name, lastName, surName, sex, phone, birthDate }: { name: string; lastName: string; surName: string; sex: string; phone: string; birthDate: string; }) => {
        if (!idPatient) return;

        try {
            await updatePatient(idPatient, { name, lastName, surName, sex, phone, birthDate });

            Alert.alert('Éxito', 'Información de paciente actualizada correctamente');
            setEditModalVisible(false);
            fetchPatient();
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la información del paciente');
        }
    };

    const createNewNote = useCallback(async () => {
        try {
            const idNoteType = noteTypeMapping[selectedType];
            const res = await createNote(title, description, idNoteType, idPatient);
            if (res.success) {
                setSuccessModalVisible(true);
                setTimeout(() => {
                    setSuccessModalVisible(false);
                    router.replace(`(patient)/${patient.idPatient}`)
                }, 2000);
            } else {
                Alert.alert('Error', res.error || 'No se pudo guardar la nota');
            }

        } catch (error) {
            Alert.alert('Error', error || 'No se pudo guardar la nota');
        }
    }, [title, description, selectedType, idPatient, createNote])


    const handleDeleteNote = async (idNote: number) => {
        if (!patient) return;
        try {
            const res = await deleteNote(idNote);
            if (res.success) {
                setDeleteModalVisible(false);

                await fetchPatientNotes();

                setSuccessDeleteVisible(true);
                setTimeout(() => {
                    setSuccessDeleteVisible(false);
                    router.replace(`(patient)/${patient.idPatient}`)
                }, 2000);

            } else {
                Alert.alert("Error", res.error || "No se pudo eliminar la nota");
            }
        } catch (error) {
            Alert.alert("Error", error || "No se pudo eliminar la nota");
        }
    };

    const handleUpdateNote = async ({ idNote, title, description, idNoteType }: { idNote: number, title: string, description: string, idNoteType: number }) => {
        if (!idNote) return;
        try {
            const res = await updateNote(idNote, { title, description, idNoteType: noteTypeMapping[selectedType], idPatient });
            if (res.success) {

                setSuccessEditVisible(true);
                setTimeout(() => {
                    setSuccessEditVisible(false);
                    router.replace(`(patient)/${patient.idPatient}`)
                }, 2000);
            } else {
                Alert.alert("Error", res.error || "No se pudo actualizar la nota");
            }
        } catch (error) {

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
            <Stack.Screen
                options={{
                    title: 'Información del paciente',
                    headerLeft: () => (
                        <Button
                            onPress={() => router.push('/patients')}
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
            {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.screenTitle}>Detalles del Paciente</Text>
                    </View>
                    <IconButton
                        icon="pencil"
                        size={24}
                        onPress={() => handleEditPress()}
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
                                        <Text style={styles.infoLabel}>Fecha de Nacimiento </Text>
                                        <Text style={styles.infoValue}>
                                            {formatDateOnly(patient.birthDate)}
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
                                <Text variant="titleLarge" style={styles.sectionTitle}>Próxima Cita</Text>
                                {loading ? (
                                    <ActivityIndicator />
                                ) : nextAppointment ? (
                                    <Card style={styles.appointmentCard}>
                                        <Card.Content>
                                            <Text>
                                                {nextAppointment.toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })} —{' '}
                                                {nextAppointment.toLocaleTimeString('es-ES', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Text>
                                            {nextTreatment && (
                                                <View style={{ marginTop: 8 }}>
                                                    <Title style={styles.treatmentType}>Tratamiento</Title>
                                                    <Text style={{ fontSize: 14, color: '#333' }}>
                                                        {nextTreatment}
                                                    </Text>
                                                </View>
                                            )}
                                        </Card.Content>
                                    </Card>
                                ) : (
                                    <Text style={styles.noAppointmentText}>
                                        No hay citas futuras programadas
                                    </Text>
                                )}
                            </View>

                            <Divider style={styles.divider} />
                            <View style={styles.infoSection}>
                                <Title style={styles.sectionTitle}>Crear nota para paciente</Title>
                                <Card style={styles.notesCard}>
                                    <Card.Content>
                                        {isEditingNotes ? (
                                            <>
                                                <TextInput
                                                    mode="outlined"
                                                    label="Nombre de la nota"
                                                    value={title}
                                                    onChangeText={setTitle}
                                                    style={styles.notesInput}
                                                />
                                                <View style={styles.dropdownContainer}>
                                                    <Text style={styles.dropdownLabel}>Tipo de nota</Text>
                                                    <View style={styles.dropdown}>
                                                        {Object.keys(noteTypeMapping).map((type) => (
                                                            <Chip
                                                                key={type}
                                                                selected={selectedType === type}
                                                                onPress={() => setSelectedType(type)}
                                                                style={styles.typeChip}
                                                            >
                                                                {type}
                                                            </Chip>
                                                        ))}
                                                    </View>
                                                </View>
                                                <TextInput
                                                    label="Descripción"
                                                    value={description}
                                                    onChangeText={setDescription}
                                                    multiline
                                                    numberOfLines={4}
                                                    mode="outlined"
                                                    style={styles.notesInput}
                                                />
                                                <View style={styles.notesActions}>
                                                    <Button
                                                        mode="outlined"
                                                        onPress={() => {
                                                            setIsEditingNotes(false);
                                                        }}
                                                        style={styles.notesButton}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        mode="outlined"
                                                        onPress={async () => {
                                                            if (typeof idNote === 'number') {
                                                                await handleUpdateNote({ idNote, title, description, idNoteType: noteTypeMapping[selectedType] });
                                                                setIdNote(null); // ← solo después de update
                                                            } else {
                                                                await createNewNote();
                                                            }

                                                            // Limpiar estado después de éxito
                                                            setTitle('');
                                                            setDescription('');
                                                            setSelectedType('');
                                                            setIsEditingNotes(false);
                                                        }}
                                                        style={styles.notesButton}
                                                        disabled={!title || !description}
                                                    >
                                                        Guardar
                                                    </Button>
                                                </View>
                                            </>
                                        ) : (
                                            <>
                                                {notes.length > 0 ? (
                                                    notes.map((note) => (
                                                        <Card key={note.idNote} style={styles.noteItem}>
                                                            <Card.Content>
                                                                <View style={styles.noteHeader}>
                                                                    <Title style={styles.noteTitle}>{note.title}</Title>
                                                                    <Chip mode="outlined" style={styles.noteType}>
                                                                        {reverseNoteTypeMapping[note.idNoteType] || 'Desconocido'}
                                                                    </Chip>
                                                                </View>
                                                                <Text style={styles.noteDescription}>{note.description}</Text>
                                                                <View style={styles.notesActions}>
                                                                    <Button
                                                                        icon="pencil"
                                                                        onPress={() => {
                                                                            setEditNoteData({
                                                                                title: note.title,
                                                                                description: note.description,
                                                                                type: reverseNoteTypeMapping[note.idNoteType]
                                                                            });
                                                                            setTitle(note.title);
                                                                            setDescription(note.description);
                                                                            setSelectedType(reverseNoteTypeMapping[note.idNoteType]);
                                                                            setIdNote(note.idNote);
                                                                            setIsEditingNotes(true);
                                                                        }}
                                                                    >
                                                                        Editar
                                                                    </Button>
                                                                    <Button
                                                                        icon="delete"
                                                                        textColor="red"
                                                                        onPress={() => {
                                                                            setIdNote(note.idNote);
                                                                            setDeleteModalVisible(true)
                                                                        }}
                                                                    >
                                                                        Eliminar
                                                                    </Button>
                                                                </View>
                                                            </Card.Content>
                                                        </Card>
                                                    ))
                                                ) : (
                                                    <Text style={styles.noNotesText}>
                                                        No hay notas registradas para este paciente.
                                                    </Text>
                                                )}
                                                <Button
                                                    mode="outlined"
                                                    onPress={() => setIsEditingNotes(true)}
                                                    icon="plus"
                                                    style={styles.addNoteButton}
                                                >
                                                    Agregar Nueva Nota
                                                </Button>
                                            </>
                                        )}
                                    </Card.Content>
                                </Card>
                            </View>

                            <Divider style={styles.divider} />

                            <View style={styles.infoSection}>
                                <Title style={styles.sectionTitle}>Historial de Tratamientos</Title>

                                {isLoadingTreatments ? (
                                    <Text>Cargando tratamientos...</Text>
                                ) : clinical && clinical.treatmentsDone && clinical.treatmentsDone.length > 0 ? (
                                    clinical.treatmentsDone.map((idTreatment, index) => (
                                        <Card key={`${idTreatment}-${index}`} style={styles.treatmentCard}>
                                            <Card.Content>
                                                <View style={styles.treatmentHeader}>
                                                    <Text style={styles.treatmentType}>
                                                        {treatmentNames[index] || 'Tratamiento'}
                                                    </Text>
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
                            <View style={styles.infoSection}>
                                <Title style={styles.sectionTitle}>Consentimiento Informado</Title>
                                {informedConsent ? (
                                    <Card style={styles.consentCard}>
                                        <Card.Content>
                                            <Text style={styles.consentText}>
                                                {informedConsent.filename}
                                            </Text>
                                            <Button
                                                mode="outlined"
                                                onPress={() => Linking.openURL(informedConsent.url)}
                                                icon="file-download"
                                            >
                                                Ver Documento de consentimiento informado
                                            </Button>
                                        </Card.Content>
                                    </Card>
                                ) : (
                                    <>
                                        <Button
                                            textColor='black'
                                            onPress={handleSelectFile}
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
                                            textColor='white'
                                            onPress={handleUploadFile}
                                            disabled={!file}
                                            style={styles.submitButton}
                                            icon="cloud-upload"
                                        >
                                            Subir Consentimiento
                                        </Button>
                                    </>
                                )}
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

            <EditPatientModal
                visible={editModalVisible}
                patient={{
                    name: patient?.name || '',
                    lastName: patient?.lastName || '',
                    surName: patient?.surName || '',
                    sex: patient?.sex || '',
                    phone: patient?.phone || '',
                    birthDate: patient?.birthDate || '',
                }}
                onSave={handleSavePatient}
                onCancel={() => setEditModalVisible(false)}
            />

            <ConfirmModal
                visible={deleteModalVisible}
                title="Eliminar Cita"
                message="¿Estás seguro de que deseas eliminar esta cita?"
                onConfirm={() => handleDeleteNote(idNote)}
                onCancel={() => setDeleteModalVisible(false)}
            />

            <SuccessModal
                visible={successModalVisible}
                title="Nota creada exitosamente"
                message="La nota ha sido creada en el sistema."
                buttonText="Volver al listado"
                onDismiss={() => {
                    setSuccessModalVisible(false);
                    router.replace(`(patient)/${patient.idPatient}`)
                }}
            />


            <SuccessModal
                visible={successDeleteVisible}
                title="Nota eliminada exitosamente"
                message="La nota ha sido eliminada del sistema."
                buttonText="Volver al listado"
                onDismiss={() => {
                    setSuccessModalVisible(false);
                    router.replace(`(patient)/${patient.idPatient}`)
                }}
            />

            <SuccessModal
                visible={successEditVisible}
                title="Nota editada exitosamente"
                message="La nota ha sido editada en el sistema exitosamente."
                buttonText="Volver al listado"
                onDismiss={() => {
                    setSuccessModalVisible(false);
                    router.replace(`(patient)/${patient.idPatient}`)
                }}
            />
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
    },
    dateText: {
        color: '#666',
        fontSize: 14,
    },
    backButton: {
        marginLeft: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        color: COLORS.primary,
        marginBottom: 8,
        fontWeight: '600',
    },
    consentCard: {
        marginVertical: 10,
        backgroundColor: '#e8f5e9',
    },
    consentText: {
        marginBottom: 10,
        fontSize: 16,
    },
    notesCard: {
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    notesInput: {
        marginBottom: 16,
    },
    dropdownContainer: {
        marginBottom: 16,
    },
    dropdownLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#666',
    },
    dropdown: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeChip: {
        marginBottom: 8,
    },
    notesActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    notesButton: {
        minWidth: 100,
    },
    addNoteButton: {
        marginTop: 16,
    },
    noteItem: {
        marginBottom: 12,
        backgroundColor: '#f8f9fa',
    },
    noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    noteTitle: {
        fontSize: 18,
        flex: 1,
    },
    noteType: {
        marginLeft: 8,
    },
    noteDescription: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        lineHeight: 24,
    },
    noteDate: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    noNotesText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginVertical: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        width: '90%',
        maxHeight: '80%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 20,
        color: COLORS.primary,
    },
    modalScroll: {
        padding: 16,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        gap: 8,
    },
    modalButton: {
        minWidth: 100,
    },
    viewNotesButton: {
        marginVertical: 8,
    },
    customTypeInput: {
        marginTop: 8,
    },
});

export default PatientDetailsScreen;