// NewAppointmentModal.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Modal, Portal, Text, Button, Title, Card, Menu } from 'react-native-paper';
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
    const [showTimePicker, setShowTimePicker] = useState(false);
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

    const buildISOString = () => new Date(dateTime).toISOString();

    const handleCreate = () => {
        if (!dateTime || !patient || !treatment || !user) return;
        onCreate({
            date: buildISOString(),
            idPatient: patient,
            idTreatment: treatment,
            idUser: user,
        });
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.modalTitle}>Nueva Cita</Title>

                        <Text style={styles.label}>Paciente</Text>
                        <Menu
                            visible={visibleMenus.patient}
                            onDismiss={() => setVisibleMenus(prev => ({ ...prev, patient: false }))}
                            anchor={
                                <Button mode="outlined" onPress={() => setVisibleMenus(prev => ({ ...prev, patient: true }))}>
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
                        <Button mode="outlined" onPress={() => setShowDatePicker(true)}>
                            {dateTime.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                        </Button>

                        {showDatePicker && (
                            <DateTimePicker
                                value={dateTime}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        const updatedDate = new Date(dateTime);
                                        updatedDate.setFullYear(selectedDate.getFullYear());
                                        updatedDate.setMonth(selectedDate.getMonth());
                                        updatedDate.setDate(selectedDate.getDate());
                                        setDateTime(updatedDate);
                                        setShowTimePicker(true);
                                    }
                                }}
                            />
                        )}

                        {showTimePicker && (
                            <DateTimePicker
                                value={dateTime}
                                mode="time"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, selectedTime) => {
                                    setShowTimePicker(false);
                                    if (selectedTime) {
                                        const updatedTime = new Date(dateTime);
                                        updatedTime.setHours(selectedTime.getHours());
                                        updatedTime.setMinutes(selectedTime.getMinutes());
                                        setDateTime(updatedTime);
                                    }
                                }}
                            />
                        )}

                        <Text style={styles.label}>Tratamiento</Text>
                        <Menu
                            visible={visibleMenus.treatment}
                            onDismiss={() => setVisibleMenus(prev => ({ ...prev, treatment: false }))}
                            anchor={
                                <Button mode="outlined" onPress={() => setVisibleMenus(prev => ({ ...prev, treatment: true }))}>
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
                                <Button mode="outlined" onPress={() => setVisibleMenus(prev => ({ ...prev, user: true }))}>
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

                        <View style={styles.buttonRow}>
                            <Button mode="outlined" onPress={onDismiss} style={styles.button}>Cancelar</Button>
                            <Button mode="contained" onPress={handleCreate} style={styles.button}>Crear</Button>
                        </View>
                    </Card.Content>
                </Card>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
    },
    modalTitle: {
        fontSize: 20,
        color: COLORS.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginTop: 12,
        marginBottom: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
});