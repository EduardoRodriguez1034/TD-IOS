import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton, Avatar } from 'react-native-paper';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import { useAppointment, usePatient } from '../store/authStore';

const HomeScreen = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [newPatientCount, setNewPatientCount] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const [unconfirmedAppointments, setUnconfirmedAppointments] = useState(0);
  const { getNewPatients } = usePatient();

  const { getAppointmentByDate, getPendingAppointments, getUnconfirmedAppointmentsThisWeek } = useAppointment();

  const todayRange = useMemo(() => {
    const now = new Date();

    const localStart = new Date(now);
    localStart.setHours(0, 0, 0, 0);

    const localEnd = new Date(now);
    localEnd.setHours(23, 59, 59, 999);

    // ¡Conviértelos directamente a UTC con .toISOString()!
    const startUTC = localStart.toISOString(); // 07:00 UTC para Tijuana
    const endUTC = localEnd.toISOString();     // 06:59:59 UTC del día siguiente
    console.log(startUTC)
    console.log(endUTC)
    return { startUTC, endUTC };
  }, []);

  const formattedDate = useMemo(() => {
    const today = new Date();
    const d = today.toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
    return d.charAt(0).toUpperCase() + d.slice(1);
  }, []);

  const fetchNewPatients = useCallback(async () => {
    const res = await getNewPatients();
    if (res.success) setNewPatientCount(res.count);
  }, [getNewPatients]);

  const fetchPendingAppointments = useCallback(async () => {
    const res = await getPendingAppointments();
    if (res.success) setPendingAppointments(res.count);
  }, [getPendingAppointments]);

  const fetchUnconfirmedAppointmentsThisWeek = useCallback(async () => {
    const res = await getUnconfirmedAppointmentsThisWeek();
    if (res.success) setUnconfirmedAppointments(res.count);
  }, [getUnconfirmedAppointmentsThisWeek]);

  const fetchToday = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getAppointmentByDate(todayRange.startUTC, todayRange.endUTC);
      console.log('Citas recibidas:', response.appointments);
      if (response.success) {
        setAppointments(response.appointments)
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error al traer las citas', error)
    } finally {
      setLoading(false)
    }
  }, [getAppointmentByDate, todayRange])

  // Usamos useFocusEffect en lugar de useEffect
  useFocusEffect(
    useCallback(() => {
      fetchToday();
      fetchNewPatients();
      fetchPendingAppointments();
      fetchUnconfirmedAppointmentsThisWeek();
    }, [fetchToday, fetchNewPatients, fetchPendingAppointments, fetchUnconfirmedAppointmentsThisWeek])
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.clinicTitle}>Truval Dental</Text>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Citas del Día */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.cardTitle}>Citas de Hoy</Title>
                <Text style={styles.dateText}>{formattedDate}</Text>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : appointments.length > 0 ? (
                <Paragraph>Tienes {appointments.length} cita(s) programada(s) para hoy</Paragraph>
              ) : (
                <Paragraph>No tienes citas programadas para hoy</Paragraph>
              )}

            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button
                onPress={() => router.push('/appointments')}
                labelStyle={styles.buttonLabel}
              >
                Ver Agenda
              </Button>
            </Card.Actions>
          </Card>

          {/* Recordatorios */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Recordatorios</Title>
              <View style={styles.reminderItem}>
                <Avatar.Icon size={40} icon="calendar-clock" style={[styles.reminderIcon, { backgroundColor: '#e8f0ff' }]} />
                <View style={styles.reminderText}>
                  <Text style={styles.reminderTitle}>Confirmaciones Pendientes</Text>
                  <Text style={styles.reminderCount}>Tienes {unconfirmedAppointments} cita sin confirmar esta semana</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Resumen de Pacientes */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Resumen de Pacientes</Title>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{newPatientCount}</Text>
                  <Text style={styles.statLabel}>Nuevos{'\n'}Pacientes</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{pendingAppointments}</Text>
                  <Text style={styles.statLabel}>Consultas{'\n'}Pendientes</Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button
                onPress={() => router.push('/patients')}
                labelStyle={styles.buttonLabel}
              >
                Ver Pacientes
              </Button>
            </Card.Actions>
          </Card>
        </ScrollView>
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
  searchIcon: {
    margin: 0,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    marginRight: 48,
  },
  clinicTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    alignContent: 'center',
    color: COLORS.primary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    color: COLORS.primary,
    marginBottom: 8,
    fontWeight: '600',
  },
  dateText: {
    color: '#666',
    fontSize: 14,
  },
  cardActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'flex-end',
  },
  buttonLabel: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reminderIcon: {
    backgroundColor: '#e8f5ed',
  },
  reminderText: {
    marginLeft: 16,
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reminderCount: {
    color: '#666',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertIcon: {
    backgroundColor: '#ffe4e4',
  },
  alertText: {
    marginLeft: 16,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertDescription: {
    color: '#666',
    fontSize: 14,
  },
});

export default HomeScreen; 