import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS } from '../constants/theme';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onDismiss: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  title,
  message,
  buttonText = 'Aceptar',
  onDismiss,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Button
            mode="contained"
            onPress={onDismiss}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            {buttonText}
          </Button>
        </View>
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
  container: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: 'white',
  },
});