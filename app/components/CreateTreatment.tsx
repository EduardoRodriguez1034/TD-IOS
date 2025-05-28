import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Portal, Modal, TextInput, Button, Text } from 'react-native-paper';
import { COLORS } from '../constants/theme';

interface CreateTreatmentModalProps {
    visible: boolean;
    onDismiss: () => void;
    onCreate: (treatment: { treatmentType: string; price: string; description: string }) => void;
}

export const CreateTreatmentModal: React.FC<CreateTreatmentModalProps> = ({ visible, onDismiss, onCreate }) => {
    const [treatmentType, setTreatmentType] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = () => {
        if (!treatmentType || !price) return;
        onCreate({ treatmentType, price, description });
        setTreatmentType('');
        setPrice('');
        setDescription('');
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Nuevo Tratamiento</Text>

                    <Text style={styles.label}>Nombre del Tratamiento</Text>
                    <TextInput
                        value={treatmentType}
                        onChangeText={setTreatmentType}
                        style={styles.input}
                        mode="outlined"
                    />

                    <Text style={styles.label}>Precio</Text>
                    <TextInput
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        style={styles.input}
                        mode="outlined"
                    />

                    <Text style={styles.label}>Descripción (opcional)</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                        style={[styles.input, styles.textarea]}
                        mode="outlined"
                    />

                    <View style={styles.buttonContainer}>
                        <Button 
                            mode="outlined" 
                            onPress={onDismiss}
                            style={styles.button}
                            labelStyle={styles.buttonLabel}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            mode="contained" 
                            onPress={handleCreate}
                            style={styles.button}
                            labelStyle={styles.buttonLabel}
                        >
                            Crear
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 12,
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
    modalContent: {
        width: '100%',
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
    input: {
        backgroundColor: 'white',
        marginBottom: 16,
    },
    textarea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 24,
    },
    button: {
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
