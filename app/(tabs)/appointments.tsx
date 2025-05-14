import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { View, Platform, StyleSheet, ScrollView } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { Card, Avatar, ActivityIndicator, Text, Button, Chip, FAB } from 'react-native-paper'
import { COLORS } from '../constants/theme';
import { useAppointment, useAuthStore, usePatient, useTreatment } from '../store/authStore'
import { ConfirmModal } from '../components/ConfirmModal';
import { Alert } from 'react-native'
import { CreateAppointmentModal } from '../components/CreateAppointment';
import { EditAppointmentModal } from '../components/EditAppointmentModal'
import { SuccessModal } from '../components/SuccessModal'
import { Redirect, router, useFocusEffect } from 'expo-router';

interface RawAppointment {
  idAppointment: number
  date: string            // "2025-05-03T14:00:00.000Z"
  idPatient: number
  idTreatment: number
  isCompleted: boolean
  isConfirmed: boolean
}

interface PatientInfo {
  idPatient: number
  name: string
  lastName: string
  surName: string
  phone: string
}

interface TreatmentInfo {
  idTreatment: number
  treatmentType: string
}

interface AgendaItem {
  idAppointment: number
  dateISO: string        // ISO completo
  isCompleted: boolean
  time: string           // hh:mm
  patientName: string
  patientPhone: string
  treatmentType: string
  isConfirmed: boolean
  name: string;
  height: number;
  day: string;
}

function dateToYMDLocal(iso: string) {
  const localDate = new Date(iso);
  const y = localDate.getFullYear()
  const m = String(localDate.getMonth() + 1).padStart(2, '0')
  const day = String(localDate.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatToLocalTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function ScheduleScreen() {
  const [items, setItems] = useState<Record<string, AgendaItem[]>>({})
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);


  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<AgendaItem | null>(null);
  const [treatmentOptions, setTreatmentOptions] = useState<Array<{ label: string, value: number }>>([]);
  const [userOptions, setUserOptions] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);

  const { createAppointment, getAllAppointments, completeAppointment, updateAppointment, deleteAppointment, isLoading: loadingApts } = useAppointment()
  const { getAllPatients } = usePatient()
  const { getAllTreatments } = useTreatment()
  const { getAllUsers } = useAuthStore()
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  // Si no está logueado, redirige al login
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)");
    }
  }, [isAuthenticated]);

  const now = new Date()
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')

  const [selectedDate, setSelectedDate] = useState<string>(today)

  const loadAppointments = useCallback(async () => {
    try {
      // 1. Pide citas, pacientes y tratamientos en paralelo
      const [resA, resP, resT] = await Promise.all([
        getAllAppointments(),
        getAllPatients(),
        getAllTreatments(),
        getAllUsers()
      ])

      if (!resA.success) throw new Error(resA.error || 'Error al cargar citas')
      if (!resP.success) throw new Error(resP.error || 'Error al cargar pacientes')
      if (!resT.success) throw new Error(resT.error || 'Error al cargar tratamientos')

      const rawA: RawAppointment[] = Array.isArray(resA.appointments) ? resA.appointments : []
      const rawP: PatientInfo[] = Array.isArray(resP.patient) ? resP.patient : []
      const rawT: TreatmentInfo[] = Array.isArray(resT.treatment) ? resT.treatment : []
      // 2. Crea mapas para acceder rápido
      const patientMap = new Map<number, string>(
        rawP.map(p => [p.idPatient, `${p.name} ${p.lastName} ${p.surName}`])
      )

      const patientMapPhone = new Map<number, string>(
        rawP.map(p => [p.idPatient, `${p.phone}`])
      )

      const treatmentMap = new Map<number, string>(
        rawT.map(t => [t.idTreatment, t.treatmentType])
      )

      // 3. Ordena globalmente
      rawA.sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      // 4. Agrupa y transforma a AgendaItem
      const grouped: Record<string, AgendaItem[]> = {}
      rawA.forEach(appt => {
        const day = dateToYMDLocal(appt.date)
        if (!grouped[day]) grouped[day] = []
        grouped[day].push({
          idAppointment: appt.idAppointment, // <–– así garantizas que exista `item.id`
          dateISO: appt.date,
          isCompleted: appt.isCompleted,
          time: formatToLocalTime(appt.date),
          patientName: patientMap.get(appt.idPatient)!,
          patientPhone: patientMapPhone.get(appt.idPatient),
          treatmentType: treatmentMap.get(appt.idTreatment)!,
          name: patientMap.get(appt.idPatient)!,
          height: 120,
          day: day,
          isConfirmed: appt.isConfirmed
        })
      })

      Object.keys(grouped).forEach(day => {
        grouped[day].sort((a, b) => {
          // getTime() ya devuelve milisegundos absolutos según tu zona
          return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
        })
      })

      setItems(prev => ({
        ...prev,
        ...grouped
      }));

    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
  }, [getAllAppointments, getAllPatients, getAllTreatments])


  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const dayAppointments = useMemo(() => items[selectedDate] || [], [items, selectedDate]);

  const handleCreateAppointment = async ({ date, idPatient, idTreatment, idUser }) => {
    try {
      const res = await createAppointment({ date, idPatient, idTreatment, idUser });
      if (res.success) {
        setCreateModalVisible(false);
        setSuccessModalVisible(true);
        loadAppointments();
        setTimeout(() => setSuccessModalVisible(false), 2000);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear la cita');
    }
  };

  const handleSaveAppointment = async ({ date, idTreatment, isConfirmed }: { date: string; idTreatment: number, isConfirmed: boolean }) => {
    if (!currentAppointment) return;

    try {
      const newDate = new Date(date);
      const newDay = dateToYMDLocal(date);
      const oldDay = dateToYMDLocal(currentAppointment.dateISO);

      setItems(prevItems => {
        const updatedItems = { ...prevItems };

        // Si el día cambió
        if (newDay !== oldDay) {
          // 1. Quitar del día viejo
          if (updatedItems[oldDay]) {
            updatedItems[oldDay] = updatedItems[oldDay].filter(
              apt => apt.idAppointment !== currentAppointment.idAppointment
            );
          }

          // 2. Agregar al nuevo día
          const updatedAppointment: AgendaItem = {
            ...currentAppointment,
            dateISO: date,
            treatmentType: treatmentOptions.find(t => t.value === idTreatment)?.label || currentAppointment.treatmentType,
            time: formatToLocalTime(date),
            isConfirmed,
            day: newDay
          };

          if (!updatedItems[newDay]) updatedItems[newDay] = [];
          updatedItems[newDay].push(updatedAppointment);

          // Ordena las citas del nuevo día por hora
          updatedItems[newDay].sort((a, b) =>
            new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
          );
        } else {
          // Día no cambió, solo actualizar datos
          updatedItems[oldDay] = updatedItems[oldDay].map(apt =>
            apt.idAppointment === currentAppointment.idAppointment
              ? {
                ...apt,
                dateISO: date,
                treatmentType: treatmentOptions.find(t => t.value === idTreatment)?.label || apt.treatmentType,
                time: formatToLocalTime(date),
                isConfirmed
              }
              : apt
          );
        }

        return updatedItems;
      });

      await updateAppointment(currentAppointment.idAppointment, { date, idTreatment, isConfirmed });

      setEditModalVisible(false);
      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la cita');
    }
  };

  const onDeleteConfirm = async () => {
    if (!selectedAppointment) return;

    try {
      // Actualización optimista
      setItems(prevItems => {
        const updatedItems = { ...prevItems };
        Object.keys(updatedItems).forEach(date => {
          updatedItems[date] = updatedItems[date].filter(
            apt => apt.idAppointment !== selectedAppointment
          );
        });
        return updatedItems;
      });

      setDeleteModalVisible(false);

      const { success, error } = await deleteAppointment(selectedAppointment);

      if (!success) {
        Alert.alert('Error', error || 'No se pudo eliminar');
      }

      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
      }, 2000);

    } catch (error) {
      console.error('Error inesperado:', error);
      Alert.alert('Error', 'Error inesperado al eliminar');
    }
  };

  const onComplete = async () => {
    if (!selectedAppointment) return;

    try {
      // Actualización optimista
      setItems(prevItems => {
        const updatedItems = { ...prevItems };
        Object.keys(updatedItems).forEach(date => {
          updatedItems[date] = updatedItems[date].map(apt =>
            apt.idAppointment === selectedAppointment
              ? { ...apt, isCompleted: true }
              : apt
          );
        });
        return updatedItems;
      });
      setCompleteModalVisible(false);
      const { success, error } = await completeAppointment(selectedAppointment);

      if (!success) {
        Alert.alert('Error', error || 'No se pudo eliminar');
      }

      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
      }, 2000);

    } catch (error) {
      console.error('Error inesperado:', error);
      Alert.alert('Error', 'Error inesperado al eliminar');
    }
  };

  const handleDeletePress = (idAppointment: number) => {
    setSelectedAppointment(idAppointment);
    setDeleteModalVisible(true);
  };

  const handleCompletePress = (idAppointment: number) => {
    setSelectedAppointment(idAppointment);
    setCompleteModalVisible(true);
  }

  const fetchTreatments = useCallback(async () => {
    try {
      const res = await getAllTreatments();
      if (res.success) {
        setTreatmentOptions(
          res.treatment.map(t => ({ label: t.treatmentType, value: t.idTreatment })))
      }
    } catch (error) {
      console.error('Error al obtener los tratamientos', error)
    }
  }, [])

  const fetchPatients = useCallback(async () => {
    try {
      const res = await getAllPatients();
      if (res.success) {
        setPatientOptions(res.patient.map(p => ({
          label: `${p.name} ${p.lastName} ${p.surName}`,
          value: p.idPatient
        })));
      };
    } catch (error) {
      console.error('Error al obtener los pacientes', error)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getAllUsers();
      if (res.success) {
        setUserOptions(res.user.map(u => ({ label: u.username, value: u.idUser })));
      }
    } catch (error) {
      console.error('Error al obtener los dentistas', error)
    }
  }, [])

  const handleEditPress = (appointment: AgendaItem) => {
    setCurrentAppointment(appointment);
    setEditModalVisible(true);
  };

  const renderItem = useCallback((item: AgendaItem) => {
    return (
      <Card
        key={item.idAppointment}
        style={styles.appointmentCard}
      >
        <Card.Content style={styles.cardContent}>

          <View style={styles.leftColumn}>
            <Chip
              mode="outlined"
              style={{
                marginTop: 4,
                alignSelf: 'flex-start',
                marginBottom: 10,
                backgroundColor: item.isConfirmed ? '#e0f8e9' : '#fdecea',
                borderColor: item.isConfirmed ? '#4caf50' : '#f44336'
              }}
              textStyle={{
                color: item.isConfirmed ? '#388e3c' : '#c62828',
                fontWeight: 'bold'
              }}
            >
              {item.isConfirmed ? 'Confirmada' : 'No confirmada'}
            </Chip>
            <Avatar.Text
              size={48}
              label={item.patientName.charAt(0)}
              style={styles.avatar}
            />

            <Text style={{ fontWeight: 'bold' }}>{item.time}</Text>
            <Text variant="bodyMedium" style={styles.patientName} numberOfLines={2}
              ellipsizeMode="tail">Paciente: {item.patientName}</Text>
            <Text variant="bodyMedium" style={styles.treatmentText} numberOfLines={2}
              ellipsizeMode="tail">Telefono: {item.patientPhone}</Text>
            <Text variant="bodyMedium" style={styles.treatmentText}>Tratamiento: {item.treatmentType}</Text>
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.actionButtons}>
              {!item.isCompleted && (
                <Button
                  icon="pencil"
                  onPress={() => handleEditPress(item)}
                  style={styles.actionButton}
                  contentStyle={styles.buttonContent}
                >
                  Editar
                </Button>
              )}
              {item.isCompleted && (
                <Button
                  icon="pencil"
                  style={styles.actionButton}
                  buttonColor='#76dc9e'
                  textColor='black'
                  contentStyle={styles.buttonContent}
                  disabled={true}
                >
                  Editar
                </Button>
              )}
              {item.isCompleted && (
                <Button
                  style={styles.actionButton}
                  textColor='#76dc9e'
                  contentStyle={styles.buttonContent}
                >
                  Completada
                </Button>
              )}
              {!item.isCompleted && (
                <Button
                  icon='check'
                  onPress={() => handleCompletePress(item.idAppointment)}
                  style={styles.actionButton}
                  textColor='#76dc9e'
                  contentStyle={styles.buttonContent}
                >
                  Completar
                </Button>
              )}
              {!item.isCompleted && (
                <Button
                  icon="delete"
                  textColor="red"
                  onPress={() => handleDeletePress(item.idAppointment)}
                  style={styles.actionButton}
                  contentStyle={styles.buttonContent}
                  loading={deletingId === item.idAppointment}
                  disabled={deletingId === item.idAppointment}
                >
                  Eliminar cita
                </Button>
              )}
              {item.isCompleted && (
                <Button
                  style={styles.actionButton}
                  icon="delete"
                  textColor="red"
                  contentStyle={styles.buttonContent}
                  disabled={true}
                >
                  Eliminar cita
                </Button>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    )
  }, [completeAppointment, setItems])

  useFocusEffect(
    useCallback(() => {
      setIsLoadingAppointments(true)
      loadAppointments().finally(() => setIsLoadingAppointments(false));
      fetchTreatments();
      fetchPatients();
      fetchUsers();
    }, [loadAppointments, fetchTreatments, fetchPatients, fetchUsers])
  );

  if (loadingApts) return <ActivityIndicator style={{ flex: 1 }} />
  if (error) return <Text style={{ flex: 1, textAlign: 'center', color: 'red', marginTop: 20 }}>{error}</Text>
  return (
    <View style={styles.mainContainer}>
      {/* Sección del Calendario */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={today}
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: {
              selected: true,
              marked: true,
              selectedColor: COLORS.primary,
            },
            ...Object.keys(items).reduce((acc, date) => ({
              ...acc,
              [date]: {
                marked: true,
                dotColor: COLORS.primary,
                selected: date === selectedDate
              }
            }), {}),
            [selectedDate]: {
              selected: true,
              selectedColor: COLORS.primary,
              marked: true,
              dotColor: 'white'
            }
          }}
          theme={{
            calendarBackground: '#fff',
            textSectionTitleColor: COLORS.primary,
            selectedDayBackgroundColor: COLORS.primary,
            selectedDayTextColor: '#fff',
            todayTextColor: COLORS.primary,
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: COLORS.primary,
            selectedDotColor: '#fff',
            arrowColor: COLORS.primary,
            monthTextColor: COLORS.primary,
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>

      {/* Sección de Citas */}
      <ScrollView style={styles.appointmentsContainer} contentContainerStyle={{ paddingBottom: 75 }}>

        {isLoadingAppointments ? (
          <Text>Cargando citas...</Text>
        ) : dayAppointments.length > 0 ? (
          dayAppointments.map((item) => (
            <View key={item.idAppointment} style={styles.appointmentItem}>
              {renderItem(item)}
            </View>
          ))
        ) : (
          <Text style={styles.noAppointmentsText}>
            No hay citas programadas para este día
          </Text>
        )}
      </ScrollView>
      <ConfirmModal
        visible={deleteModalVisible}
        title="Eliminar Cita"
        message="¿Estás seguro de que deseas eliminar esta cita?"
        onConfirm={onDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      />
      <ConfirmModal
        visible={completeModalVisible}
        title="Completar Cita"
        message="¿Estás seguro de que deseas completar esta cita?"
        onConfirm={onComplete}
        onCancel={() => setCompleteModalVisible(false)}
      />
      <CreateAppointmentModal
        visible={createModalVisible}
        onDismiss={() => setCreateModalVisible(false)}
        onCreate={handleCreateAppointment}
        patientList={patientOptions}
        treatmentList={treatmentOptions}
        userList={userOptions}
      />
      <EditAppointmentModal
        visible={editModalVisible}
        appointment={currentAppointment || {
          idAppointment: 0,
          dateISO: new Date().toISOString(),
          treatmentType: '',
          patientName: '',
          isConfirmed: null,
        }}
        treatments={treatmentOptions}
        onSave={handleSaveAppointment}
        onCancel={() => setEditModalVisible(false)}
      />
      <SuccessModal
        visible={successModalVisible}
        title="Cita actualizada exitosamente"
        message="La cita ha sido actualizada en el sistema."
        buttonText="Volver al listado"
        onDismiss={() => {
          setSuccessModalVisible(false);
        }}
      />
      <FAB
        icon="calendar-plus"
        style={styles.fab}
        onPress={() => setCreateModalVisible(true)}
        mode="elevated"
        color="white"
        size="large"
        customSize={64}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentsContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  buttonActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  appointmentItem: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noAppointmentsText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
    fontSize: 16,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  // ... (otros estilos se mantienen igual, pero puedes ajustar según necesites)
  appointmentCard: {
    borderRadius: 10,
    margin: 0, // Eliminamos el margin para que lo controle el contenedor padre
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 16, // Espacio entre columnas
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 4,
  },
  rightColumn: {
    width: 140,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 8,
    width: '100%',
  },
  actionButton: {
    borderRadius: 6,
    paddingHorizontal: 4,
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
  appointmentsList: {
    gap: 16,
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
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
    maxWidth: 180,
  },
  treatmentText: {
    color: '#666',
    fontSize: 14,
    flexShrink: 1, // Permite que el texto se ajuste
  },
  timeContainer: {
    alignItems: 'flex-end',
    marginLeft: 16,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12, // Más espacio bajo la hora
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
  buttonContent: {
    paddingVertical: 8,
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
    padding: 4,
    borderRadius: 4,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 0,
    right: 16,
    bottom: Platform.OS === 'ios' ? 34 : 70,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
})