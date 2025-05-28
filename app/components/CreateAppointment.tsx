// NewAppointmentModal.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Modal } from 'react-native';
import { Portal, Text, Button, Menu } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/theme';

interface CreateAppointmentModalProps {
    visible: boolean;
    onDismiss: () => void;
    onCreate: (appointment: {
        date: string;
        idPatient: number;
        idTreatment: number;
        idUser: number;
    }) => void;
    patientList: Array<{ label: string; value: number }>;
    treatmentList: Array<{ label: string; value: number }>;
    userList: Array<{ label: string; value: number }>;
}

export const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
    visible,
    onDismiss,
    onCreate,
    patientList,
    treatmentList,
    userList,
}) => {
    const [dateTime, setDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [patient, setPatient] = useState<number | null>(null);
    const [treatment, setTreatment] = useState<number | null>(null);
    const [user, setUser] = useState<number | null>(null);
    const [visibleMenus, setVisibleMenus] = useState({ patient: false, treatment: false, user: false });

    useEffect(() => {
        if (visible) {
            setDateTime(new Date());
            setPatient(null);
            setTreatment(null);
            setUser(null);
        }
    }, [visible]);

    const handleCreate = () => {
        if (!dateTime || !patient || !treatment || !user) return;
        onCreate({
            date: dateTime.toISOString(),
            idPatient: patient,
            idTreatment: treatment,
            idUser: user,
        });
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Text style={styles.title}>Nueva Cita</Text>

                            <Text style={styles.label}>Paciente</Text>
                            <Menu
                                visible={visibleMenus.patient}
                                onDismiss={() => setVisibleMenus(prev => ({ ...prev, patient: false }))}
                                anchor={
                                    <Button 
                                        mode="outlined" 
                                        onPress={() => setVisibleMenus(prev => ({ ...prev, patient: true }))}
                                        style={styles.menuButton}
                                    >
                                        {patientList.find(p => p.value === patient)?.label || 'Selecciona paciente'}
                                    </Button>
                                }
                            >
                                {patientList.map(item => (
                                    <Menu.Item
                                        key={item.value}
                                        onPress={() => {
                                            setPatient(item.value);
                                            setVisibleMenus(prev => ({ ...prev, patient: false }));
                                        }}
                                        title={item.label}
                                    />
                                ))}
                            </Menu>

                            <Text style={styles.label}>Fecha y Hora</Text>
                            <Button
                                mode="outlined"
                                onPress={() => {
                                    setPickerMode('date');
                                    setShowDatePicker(true);
                                }}
                                style={styles.dateButton}
                                icon="calendar"
                            >
                                {dateTime.toLocaleString('es-MX', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                })}
                            </Button>

                            {showDatePicker && Platform.OS === 'ios' && (
                                <View style={styles.datePickerContainer}>
                                    <DateTimePicker
                                        value={dateTime}
                                        mode={pickerMode}
                                        is24Hour={false}
                                        display="spinner"
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) {
                                                setDateTime(selectedDate);
                                            }
                                        }}
                                    />
                                    <View style={styles.datePickerButtons}>
                                        <Button 
                                            mode="text"
                                            onPress={() => setShowDatePicker(false)}
                                            style={styles.datePickerButton}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button 
                                            mode="contained"
                                            onPress={() => setShowDatePicker(false)}
                                            style={styles.datePickerButton}
                                        >
                                            Listo
                                        </Button>
                                    </View>
                                </View>
                            )}

                            {showDatePicker && Platform.OS === 'android' && (
                                <DateTimePicker
                                    value={dateTime}
                                    mode={pickerMode}
                                    is24Hour={false}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (event.type === 'set' && selectedDate) {
                                            setDateTime(selectedDate);
                                        }
                                    }}
                                />
                            )}

                            <Text style={styles.label}>Tratamiento</Text>
                            <Menu
                                visible={visibleMenus.treatment}
                                onDismiss={() => setVisibleMenus(prev => ({ ...prev, treatment: false }))}
                                anchor={
                                    <Button 
                                        mode="outlined" 
                                        onPress={() => setVisibleMenus(prev => ({ ...prev, treatment: true }))}
                                        style={styles.menuButton}
                                    >
                                        {treatmentList.find(t => t.value === treatment)?.label || 'Selecciona tratamiento'}
                                    </Button>
                                }
                            >
                                {treatmentList.map(item => (
                                    <Menu.Item
                                        key={item.value}
                                        onPress={() => {
                                            setTreatment(item.value);
                                            setVisibleMenus(prev => ({ ...prev, treatment: false }));
                                        }}
                                        title={item.label}
                                    />
                                ))}
                            </Menu>

                            <Text style={styles.label}>Dentista</Text>
                            <Menu
                                visible={visibleMenus.user}
                                onDismiss={() => setVisibleMenus(prev => ({ ...prev, user: false }))}
                                anchor={
                                    <Button 
                                        mode="outlined" 
                                        onPress={() => setVisibleMenus(prev => ({ ...prev, user: true }))}
                                        style={styles.menuButton}
                                    >
                                        {userList.find(u => u.value === user)?.label || 'Selecciona dentista'}
                                    </Button>
                                }
                            >
                                {userList.map(item => (
                                    <Menu.Item
                                        key={item.value}
                                        onPress={() => {
                                            setUser(item.value);
                                            setVisibleMenus(prev => ({ ...prev, user: false }));
                                        }}
                                        title={item.label}
                                    />
                                ))}
                            </Menu>
                        </View>
                    </View>

                    <View style={styles.bottomButtonContainer}>
                        <Button 
                            mode="outlined" 
                            onPress={onDismiss}
                            style={styles.bottomButton}
                            labelStyle={styles.buttonLabel}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            mode="contained" 
                            onPress={handleCreate}
                            style={styles.bottomButton}
                            labelStyle={styles.buttonLabel}
                            disabled={!dateTime || !patient || !treatment || !user}
                        >
                            Crear
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    cardContent: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: COLORS.primary,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    menuButton: {
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        width: '100%',
    },
    dateButton: {
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
    },
    datePickerContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    datePickerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f8f8f8',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    datePickerButton: {
        minWidth: 100,
    },
    bottomButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    bottomButton: {
        flex: 1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.primary,
        height: 48,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
});