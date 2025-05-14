import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput, Text, Card } from 'react-native-paper';
import { COLORS } from '../constants/theme';

export const EditTreatmentModal = ({
    visible,
    treatment = {
        idTreatment: '',
        treatmentType: '',
        price: '',
        description: '',
    },
    onSave,
    onCancel,
}) => {
    const [treatmentType, setTreatmentType] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (visible && treatment) {
            setTreatmentType(treatment.treatmentType || '');
            setPrice(String(treatment.price || ''));
            setDescription(treatment.description || '');
        }
    }, [visible, treatment]);

    const handleSave = () => {
        onSave({
            idTreatment: treatment?.idTreatment,
            treatmentType: treatmentType.trim(),
            price: price.trim(),
            description: description.trim(),
        });
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <Card style={styles.card}>
                    <Card.Content>
                        <ScrollView>
                            <Text style={styles.title}>Editar Tratamiento</Text>

                            <Text style={styles.label}>Nombre:</Text>
                            <TextInput
                                mode="outlined"
                                value={treatmentType}
                                onChangeText={setTreatmentType}
                                style={styles.input}
                                placeholder="Ej. Limpieza dental"
                            />

                            <Text style={styles.label}>Precio:</Text>
                            <TextInput
                                mode="outlined"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                style={styles.input}
                                placeholder="Ej. 500"
                            />

                            <Text style={styles.label}>Descripción:</Text>
                            <TextInput
                                mode="outlined"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                placeholder="Detalles sobre el tratamiento"
                                style={styles.textarea}
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
                        </ScrollView>
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
        maxHeight: '90%',
        borderRadius: 10,
        backgroundColor: 'white',
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
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
    textarea: {
        height: 100,
        backgroundColor: 'white',
        marginBottom: 15,
        textAlignVertical: 'top',
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
