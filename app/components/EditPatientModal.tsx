import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Button, TextInput, Text, Card } from 'react-native-paper';
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
    const [birthDate, setBirthDate] = useState('');
    const [phone, setSelectedPhone] = useState('')


    useEffect(() => {
        if (visible) {
            setSelectedName(patient.name);
            setSelectedLastName(patient.lastName);
            setSelectedSurName(patient.surName);
            setSelectedSex(patient.sex);
            setBirthDate(patient.birthDate);
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
            birthDate: birthDate
        });
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.title}>Editar Información de Paciente</Text>

                        <Text style={styles.label}>Paciente:</Text>
                        <TextInput
                            mode="outlined"
                            value={name}
                            onChangeText={setSelectedName}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Apellido Paterno:</Text>
                        <TextInput
                            mode="outlined"
                            value={lastName}
                            onChangeText={setSelectedLastName}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Apellido Materno:</Text>
                        <TextInput
                            mode="outlined"
                            value={surName}
                            onChangeText={setSelectedSurName}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Sexo:</Text>
                        <TextInput
                            mode="outlined"
                            value={sex}
                            onChangeText={setSelectedSex}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Fecha Nacimiento: (YYYY-MM-DD)</Text>
                        <TextInput
                            mode="outlined"
                            value={birthDate}
                            onChangeText={setBirthDate}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Telefono:</Text>
                        <TextInput
                            mode="outlined"
                            value={phone}
                            onChangeText={setSelectedPhone}
                            style={styles.input}
                        />

                        <View style={styles.buttonContainer}>
                            <Button
                                mode="outlined"
                                onPress={onCancel}
                                style={styles.button}
                            >
                                Cancelar
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleSave}
                                style={styles.button}
                            >
                                Guardar
                            </Button>
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
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        backgroundColor: 'white',
    },
    dropdownText: {
        fontSize: 16,
    },
    dropdownIcon: {
        fontSize: 12,
        color: '#666',
    },
    dropdownDialog: {
        maxHeight: '60%',
        backgroundColor: 'white',
    },
    dropdownOptions: {
        padding: 10,
    },
    dropdownOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedOption: {
        backgroundColor: COLORS.primary,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    selectedOptionText: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    container: {
        marginVertical: 10,
        zIndex: 1000, // Asegura que el menú aparezca sobre otros elementos
    },
    buttonContent: {
        flexDirection: 'row-reverse',
    },
    menuStyle: {
        marginTop: 40, // Ajusta según sea necesario
        width: '80%', // Controla el ancho del menú
    },
    item: {
        color: '#333',
        fontSize: 16,
    },
    selectedItemView: {
        backgroundColor: '#f0f0f0',
    },
    selectedItem: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    dropdownContainer: {
        marginVertical: 10,
        zIndex: 1000,
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
        backgroundColor: 'white',
    },
    dropdownHeaderText: {
        fontSize: 16,
    },
    dropdownArrow: {
        fontSize: 12,
        color: '#666',
    },
    dropdownList: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginTop: 5,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    selectedText: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});