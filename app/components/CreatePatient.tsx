// NewPatientModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Platform } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
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
                <View style={styles.modalContainer}>
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
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
                                <Button
                                    mode={sex === 'Hombre' ? 'contained' : 'outlined'}
                                    onPress={() => setSex('Hombre')}
                                    style={[styles.sexButton, sex === 'Hombre' && styles.activeButton]}
                                    labelStyle={sex === 'Hombre' ? styles.activeButtonLabel : styles.inactiveButtonLabel}
                                >
                                    Hombre
                                </Button>
                                <Button
                                    mode={sex === 'Mujer' ? 'contained' : 'outlined'}
                                    onPress={() => setSex('Mujer')}
                                    style={[styles.sexButton, sex === 'Mujer' && styles.activeButton]}
                                    labelStyle={sex === 'Mujer' ? styles.activeButtonLabel : styles.inactiveButtonLabel}
                                >
                                    Mujer
                                </Button>
                            </View>

                            <Button
                                mode="outlined"
                                onPress={() => setShowDatePicker(true)}
                                style={styles.dateButton}
                                icon="calendar"
                            >
                                {birthDate.toLocaleDateString('es-MX', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </Button>

                            {showDatePicker && Platform.OS === 'ios' && (
                                <View style={styles.datePickerContainer}>
                                    <DateTimePicker
                                        value={birthDate}
                                        mode="date"
                                        display="spinner"
                                        maximumDate={new Date()}
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) {
                                                setBirthDate(selectedDate);
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
                                    value={birthDate}
                                    mode="date"
                                    display="default"
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
                            onPress={handleSubmit} 
                            style={styles.bottomButton}
                            labelStyle={styles.buttonLabel}
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
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    sexOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16,
    },
    sexButton: {
        flex: 1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.primary,
        height: 48,
    },
    dateButton: {
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
    },
    activeButton: {
        backgroundColor: COLORS.primary,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    activeButtonLabel: {
        color: 'white',
    },
    inactiveButtonLabel: {
        color: COLORS.primary,
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
});
