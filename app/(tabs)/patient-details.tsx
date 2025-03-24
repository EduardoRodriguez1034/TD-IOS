import React from 'react';
import { View, StyleSheet, ScrollView, Platform, SafeAreaView } from 'react-native';
import { Text, Card, Title, Avatar, Chip, Divider, IconButton, FAB } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../constants/theme';

// Datos de ejemplo (después se reemplazarán con datos reales)
const MOCK_PATIENT = {
  id: '1',
  name: 'Juan Pérez',
  age: 35,
  birthDate: '1989-03-15',
  phone: '+34 123 456 789',
  email: 'juan.perez@email.com',
  lastVisit: '2024-03-15',
  nextAppointment: '2024-03-25',
  status: 'active',
  treatments: [
    {
      id: '1',
      date: '2024-03-15',
      type: 'Limpieza Dental',
      notes: 'Paciente con buena higiene dental',
      status: 'Completado'
    },
    {
      id: '2',
      date: '2024-02-10',
      type: 'Empaste',
      notes: 'Caries en molar superior',
      status: 'Completado'
    }
  ]
};

const PatientDetailsScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#9E9E9E';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.screenTitle}>Detalles del Paciente</Text>
          </View>
          <IconButton
            icon="pencil"
            size={24}
            onPress={() => {/* Implementar edición */}}
            style={styles.editIcon}
          />
        </View>

        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.patientHeader}>
                <Avatar.Text 
                  size={80} 
                  label={MOCK_PATIENT.name.split(' ').map(n => n[0]).join('')}
                  style={styles.avatar}
                />
                <View style={styles.patientInfo}>
                  <Title style={styles.patientName}>{MOCK_PATIENT.name}</Title>
                  <Chip 
                    mode="outlined" 
                    style={[styles.statusChip, { borderColor: getStatusColor(MOCK_PATIENT.status) }]}
                    textStyle={{ color: getStatusColor(MOCK_PATIENT.status) }}
                  >
                    {getStatusLabel(MOCK_PATIENT.status)}
                  </Chip>
                </View>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.infoSection}>
                <Title style={styles.sectionTitle}>Información Personal</Title>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Fecha de Nacimiento</Text>
                    <Text style={styles.infoValue}>
                      {new Date(MOCK_PATIENT.birthDate).toLocaleDateString('es-ES')}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Edad</Text>
                    <Text style={styles.infoValue}>{MOCK_PATIENT.age} años</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Teléfono</Text>
                    <Text style={styles.infoValue}>{MOCK_PATIENT.phone}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{MOCK_PATIENT.email}</Text>
                  </View>
                </View>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.infoSection}>
                <Title style={styles.sectionTitle}>Próxima Cita</Title>
                {MOCK_PATIENT.nextAppointment ? (
                  <Card style={styles.appointmentCard}>
                    <Card.Content>
                      <View style={styles.appointmentHeader}>
                        <Text style={styles.appointmentDate}>
                          {new Date(MOCK_PATIENT.nextAppointment).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                        <View style={styles.appointmentActions}>
                          <IconButton
                            icon="pencil"
                            size={20}
                            onPress={() => {/* Implementar edición de cita */}}
                            style={styles.actionIcon}
                          />
                          <IconButton
                            icon="delete"
                            size={20}
                            onPress={() => {/* Implementar eliminación de cita */}}
                            style={styles.actionIcon}
                          />
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                ) : (
                  <Text style={styles.noAppointmentText}>No hay citas programadas</Text>
                )}
              </View>

              <Divider style={styles.divider} />

              <View style={styles.infoSection}>
                <Title style={styles.sectionTitle}>Historial de Tratamientos</Title>
                {MOCK_PATIENT.treatments.map((treatment) => (
                  <Card key={treatment.id} style={styles.treatmentCard}>
                    <Card.Content>
                      <View style={styles.treatmentHeader}>
                        <Text style={styles.treatmentType}>{treatment.type}</Text>
                        <Text style={styles.treatmentDate}>
                          {new Date(treatment.date).toLocaleDateString('es-ES')}
                        </Text>
                      </View>
                      <Text style={styles.treatmentNotes}>{treatment.notes}</Text>
                      <Chip 
                        mode="outlined" 
                        style={styles.treatmentStatus}
                        textStyle={{ color: COLORS.primary }}
                      >
                        {treatment.status}
                      </Chip>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            </Card.Content>
          </Card>
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
      </View>
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
  editIcon: {
    margin: 0,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: COLORS.primary,
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 24,
    marginBottom: 8,
  },
  statusChip: {
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: COLORS.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
  },
  treatmentCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  treatmentType: {
    fontSize: 16,
    fontWeight: '600',
  },
  treatmentDate: {
    fontSize: 14,
    color: '#666',
  },
  treatmentNotes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  treatmentStatus: {
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  appointmentCard: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#e7f3ff',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentDate: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  appointmentActions: {
    flexDirection: 'row',
  },
  actionIcon: {
    margin: 0,
  },
  noAppointmentText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
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

export default PatientDetailsScreen; 