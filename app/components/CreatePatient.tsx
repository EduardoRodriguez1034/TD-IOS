// NewPatientModal.js
import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, Platform } from 'react-native';
import { Button, TextInput, Text, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/theme';

interface CreatePatientModalProps {
    visible: boolean;
    onDismiss: () => void;
    onCreate: (treatment: { name: string; lastName: string; surName: string; sex: string; phone: string; birthDate: Date }) => void;
}

export const CreatePatientModal: React.FC<CreatePatientModalProps> = ({ visible, onDismiss, onCreate }) => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [surName, setSurName] = useState('');
    const [sex, setSex] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [phone, setPhone] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (visible) {
            resetForm();
        }
    }, [visible]);

    const resetForm = () => {
        setName('');
        setLastName('');
        setSurName('');
        setSex('');
        setPhone('');
        setBirthDate(new Date());
    };

    const handleSubmit = () => {
        if (!name || !lastName || !surName || !sex || !phone || !birthDate) {
            return;
        }
        onCreate({ name, lastName, surName, sex, phone, birthDate });
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.title}>Nuevo Paciente</Text>

                        <TextInput
                            label="Nombre"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TextInput
                            label="Apellido Paterno"
                            value={lastName}
                            onChangeText={setLastName}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TextInput
                            label="Apellido Materno"
                            value={surName}
                            onChangeText={setSurName}
                            style={styles.input}
                            mode="outlined"
                        />

                        <Text style={styles.label}>Sexo</Text>
                        <View style={styles.sexOptions}>
                            {['Hombre', 'Mujer'].map((option) => (
                                <Button
                                    key={option}
                                    mode={sex === option ? 'contained' : 'outlined'}
                                    onPress={() => setSex(option)}
                                    style={styles.sexButton}
                                >
                                    {option}
                                </Button>
                            ))}
                        </View>

                        <Button
                            mode="outlined"
                            onPress={() => setShowDatePicker(true)}
                            style={styles.input}
                            icon="calendar"
                        >
                            {birthDate.toLocaleDateString('es-MX', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </Button>

                        {showDatePicker && (
                            <DateTimePicker
                                value={birthDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                maximumDate={new Date()}
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (event.type === 'set' && selectedDate) {
                                        setBirthDate(selectedDate);
                                    }
                                }}
                            />
                        )}

                        <TextInput
                            label="Teléfono"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            style={styles.input}
                            mode="outlined"
                        />
                        <View style={styles.buttonRow}>
                            <Button mode="outlined" onPress={onDismiss} style={styles.button}>Cancelar</Button>
                            <Button mode="contained" onPress={handleSubmit} style={styles.button}>Crear</Button>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    card: {
        width: '90%',
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: COLORS.primary,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
    sexOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 16,
    },
    sexButton: {
        flex: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10,
    },
    button: {
        flex: 1,
    },
});
