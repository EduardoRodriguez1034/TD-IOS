// components/ConfirmModal.tsx

import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

// Definición de las props que recibe el componente ConfirmModal
interface ConfirmModalProps {
  visible: boolean; // Controla si el modal está visible o no
  title: string; // Título que se mostrará en el modal
  message: string; // Mensaje principal del modal
  onConfirm: () => void; // Callback que se ejecuta al confirmar
  onCancel: () => void; // Callback que se ejecuta al cancelar
}

// Componente funcional que representa un modal de confirmación reutilizable
export const ConfirmModal = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    // Modal de React Native con fondo semitransparente y animación de aparición tipo "fade"
    <Modal transparent visible={visible} animationType="fade">
      {/* Capa semitransparente que oscurece el fondo */}
      <View style={styles.modalOverlay}>
        {/* Contenedor principal del contenido del modal */}
        <View style={styles.modalContent}>
          {/* Título del modal */}
          <Text style={styles.title}>{title}</Text>
          
          {/* Mensaje del modal */}
          <Text style={styles.message}>{message}</Text>

          {/* Contenedor de los botones de acción */}
          <View style={styles.buttonsContainer}>
            {/* Botón para cancelar la acción */}
            <Button mode="outlined" onPress={onCancel} style={styles.button}>
              Cancelar
            </Button>

            {/* Botón para confirmar la acción */}
            <Button mode="contained" onPress={onConfirm} style={styles.button}>
              Confirmar
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  // Capa oscura del fondo del modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo negro semitransparente
  },
  // Contenedor del contenido del modal
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  // Estilo del título
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // Estilo del mensaje
  message: {
    marginBottom: 20,
  },
  // Contenedor de los botones en fila y alineados a la derecha
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10, // Separación entre botones
  },
  // Estilo común para los botones
  button: {
    minWidth: 100,
  },
});
