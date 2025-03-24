import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton, Divider, List, FAB, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';

// Datos de ejemplo (después se reemplazarán con datos reales de la base de datos)
const MOCK_APPOINTMENTS = [
  {
    id: '1',
    patientName: 'Juan Pérez',
    time: '09:00',
    treatment: 'Limpieza Dental',
    status: 'Confirmada'
  },
  {
    id: '2',
    patientName: 'María García',
    time: '10:30',
    treatment: 'Extracción',
    status: 'Pendiente'
  },
  {
    id: '3',
    patientName: 'Carlos López',
    time: '12:00',
    treatment: 'Revisión',
    status: 'Confirmada'
  }
];

const AppointmentsScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.mainContainer}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.screenTitle}>Citas del Día</Text>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.calendarContainer}>
            {/* Aquí se agregará el calendario cuando implementemos la selección de fechas */}
          </View>

          <View style={styles.appointmentsList}>
            {MOCK_APPOINTMENTS.map((appointment) => (
              <Card 
                key={appointment.id} 
                style={styles.appointmentCard}
                onPress={() => {/* Implementar ver detalles */}}
              >
                <Card.Content style={styles.cardContent}>
                  <View style={styles.appointmentInfo}>
                    <Avatar.Text 
                      size={50} 
                      label={appointment.patientName.split(' ').map(n => n[0]).join('')}
                      style={styles.avatar}
                    />
                    <View style={styles.appointmentDetails}>
                      <Title style={styles.patientName}>{appointment.patientName}</Title>
                      <Text style={styles.treatmentText}>{appointment.treatment}</Text>
                    </View>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{appointment.time}</Text>
                    <Text style={[
                      styles.statusBadge,
                      { backgroundColor: appointment.status === 'Confirmada' ? '#e7f3ff' : '#fff3e6' }
                    ]}>
                      {appointment.status}
                    </Text>
                  </View>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                  <View style={styles.actionButtons}>
                    <Button
                      mode="outlined"
                      onPress={() => {/* Implementar edición */}}
                      style={styles.actionButton}
                      contentStyle={styles.buttonContent}
                    >
                      Editar
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => {/* Implementar ver detalles */}}
                      style={styles.actionButton}
                      contentStyle={styles.buttonContent}
                    >
                      Ver Detalles
                    </Button>
                  </View>
                </Card.Actions>
              </Card>
            ))}
          </View>
        </ScrollView>

        <FAB
          icon="calendar-plus"
          style={styles.fab}
          onPress={() => router.push('/new-appointment')}
          mode="elevated"
          color="white"
          size="large"
          customSize={64}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 8 : 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  calendarContainer: {
    marginBottom: 16,
  },
  appointmentsList: {
    gap: 16,
  },
  appointmentCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
  appointmentDetails: {
    marginLeft: 16,
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    marginBottom: 4,
  },
  treatmentText: {
    color: '#666',
    fontSize: 14,
  },
  timeContainer: {
    alignItems: 'flex-end',
    marginLeft: 16,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 12,
  },
  cardActions: {
    padding: 16,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    minWidth: 100,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  fab: {
    position: 'absolute',
    margin: 0,
    right: 16,
    bottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default AppointmentsScreen; 