import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, Platform, ScrollView } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/theme';

interface EditPatientModalProps {
    visible: boolean;
    patient: {
        name: string;
        lastName: string;
        surName: string;
        sex: string;
        phone: string;
        birthDate: string;
    };
    onSave: (updatedData: { name: string; lastName: string; surName: string; sex: string; phone: string; birthDate: string; }) => void;
    onCancel: () => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
    visible,
    patient,
    onSave,
    onCancel,
}) => {
    const [name, setSelectedName] = useState('')
    const [lastName, setSelectedLastName] = useState('')
    const [surName, setSelectedSurName] = useState('')
    const [sex, setSelectedSex] = useState('')
    const [birthDate, setBirthDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [phone, setSelectedPhone] = useState('')

    useEffect(() => {
        if (visible) {
            setSelectedName(patient.name);
            setSelectedLastName(patient.lastName);
            setSelectedSurName(patient.surName);
            setSelectedSex(patient.sex);
            setBirthDate(new Date(patient.birthDate));
            setSelectedPhone(patient.phone);
        }
    }, [visible, patient]);

    const handleSave = () => {
        onSave({
            name: name,
            lastName: lastName,
            surName: surName,
            sex: sex,
            phone: phone,
            birthDate: birthDate.toISOString().split('T')[0]
        });
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView 
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <Text style={styles.title}>Editar Paciente</Text>
                            
                            <TextInput
                                label="Nombre"
                                value={name}
                                onChangeText={setSelectedName}
                                style={styles.input}
                                mode="outlined"
                            />
                            <TextInput
                                label="Apellido Paterno"
                                value={lastName}
                                onChangeText={setSelectedLastName}
                                style={styles.input}
                                mode="outlined"
                            />
                            <TextInput
                                label="Apellido Materno"
                                value={surName}
                                onChangeText={setSelectedSurName}
                                style={styles.input}
                                mode="outlined"
                            />

                            <Text style={styles.label}>Sexo</Text>
                            <View style={styles.sexOptions}>
                                <Button
                                    mode={sex === 'Hombre' ? 'contained' : 'outlined'}
                                    onPress={() => setSelectedSex('Hombre')}
                                    style={[styles.sexButton, sex === 'Hombre' && styles.activeButton]}
                                    labelStyle={sex === 'Hombre' ? styles.activeButtonLabel : styles.inactiveButtonLabel}
                                >
                                    Hombre
                                </Button>
                                <Button
                                    mode={sex === 'Mujer' ? 'contained' : 'outlined'}
                                    onPress={() => setSelectedSex('Mujer')}
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
                                labelStyle={{ color: '#1f2937' }}
                            >
                                {birthDate.toLocaleDateString('es-MX', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
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
                                onChangeText={setSelectedPhone}
                                keyboardType="phone-pad"
                                style={styles.input}
                                mode="outlined"
                            />
                        </ScrollView>

                        <View style={styles.buttonContainer}>
                            <Button 
                                mode="outlined" 
                                onPress={onCancel} 
                                style={[styles.button, styles.cancelButton]}
                                labelStyle={styles.cancelButtonLabel}
                                textColor={COLORS.primary}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                mode="contained" 
                                onPress={handleSave} 
                                style={[styles.button, styles.saveButton]}
                                labelStyle={styles.saveButtonLabel}
                                buttonColor={COLORS.primary}
                            >
                                Guardar
                            </Button>
                        </View>
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
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        maxHeight: '90%',
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
    scrollContent: {
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: 'white',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    button: {
        flex: 1,
        borderRadius: 8,
        height: 48,
    },
    cancelButton: {
        borderColor: COLORS.primary,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    cancelButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
    },
    saveButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    dateButton: {
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        height: 48,
    },
    datePickerContainer: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
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
    datePickerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    datePickerButton: {
        minWidth: 100,
    },
});