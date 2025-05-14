import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, TextInput, Button, Title, Card } from 'react-native-paper';
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
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.modalTitle}>Nuevo Tratamiento</Title>

                        <TextInput
                            label="Nombre del Tratamiento"
                            value={treatmentType}
                            onChangeText={setTreatmentType}
                            style={styles.input}
                            mode="outlined"
                        />

                        <TextInput
                            label="Precio"
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                            style={styles.input}
                            mode="outlined"
                        />

                        <TextInput
                            label="Descripción (opcional)"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                            mode="outlined"
                        />

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
    input: {
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
});
