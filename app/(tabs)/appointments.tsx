// app/screens/ScheduleScreen.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { View, Platform, StyleSheet } from 'react-native'
import { Agenda } from 'react-native-calendars'
import { useFocusEffect } from 'expo-router'
import { Card, Avatar, Paragraph, ActivityIndicator, Text, Button } from 'react-native-paper'
import { COLORS } from '../constants/theme';
import { useAppointment, usePatient, useTreatment } from '../store/authStore'
import { ConfirmModal } from '../components/ConfirmModal';
import { Alert } from 'react-native'

interface RawAppointment {
  idAppointment: number
  date: string            // "2025-05-03T14:00:00.000Z"
  idPatient: number
  idTreatment: number
  isCompleted: boolean
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
  treatmentType: string
}

function dateToYMDLocal(iso: string) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function ScheduleScreen() {
  const { getAllAppointments, completeAppointment, deleteAppointment, isLoading: loadingApts } = useAppointment()
  const { getAllPatients } = usePatient()
  const { getAllTreatments } = useTreatment()

  const [items, setItems] = useState<Record<string, AgendaItem[]>>({})
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);

  const loadAppointments = useCallback(async () => {
    try {
      // 1. Pide citas, pacientes y tratamientos en paralelo
      const [resA, resP, resT] = await Promise.all([
        getAllAppointments(),
        getAllPatients(),
        getAllTreatments()
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
          idAppointment: appt.idAppointment,              // <–– así garantizas que exista `item.id`
          dateISO: appt.date,
          isCompleted: appt.isCompleted,
          time: new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          patientName: patientMap.get(appt.idPatient)!,
          treatmentType: treatmentMap.get(appt.idTreatment)!
        })
      })

      Object.keys(grouped).forEach(day => {
        grouped[day].sort((a, b) => {
          // getTime() ya devuelve milisegundos absolutos según tu zona
          return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
        })
      })

      setItems(grouped)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
  }, [getAllAppointments, getAllPatients, getAllTreatments])

  const handleDeletePress = (idAppointment: number) => {
    setSelectedAppointment(idAppointment);
    setModalVisible(true);
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

      const { success, error } = await deleteAppointment(selectedAppointment);

      if (!success) {
        loadAppointments(); // Revertir si hay error
        Alert.alert('Error', error || 'No se pudo eliminar');
      }
      // No necesitas else, la UI ya se actualizó optimistamente

    } catch (error) {
      console.error('Error inesperado:', error);
      loadAppointments();
      Alert.alert('Error', 'Error inesperado al eliminar');
    } finally {
      setModalVisible(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAppointments()
      return () => setError(null)
    }, [loadAppointments])
  )

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  // Agenda pide esto para poblar días vacíos
  const loadItemsForMonth = ({ dateString }: { dateString: string }) => {
    if (!items[dateString]) {
      setItems(prev => ({ ...prev, [dateString]: [] }))
    }
  }

  const renderItem = (item: AgendaItem) => {
    const onComplete = async () => {
      try {
        // Actualización optimista
        setItems(prevItems => {
          const updatedItems = { ...prevItems };
          Object.keys(updatedItems).forEach(date => {
            updatedItems[date] = updatedItems[date].map(apt =>
              apt.idAppointment === item.idAppointment
                ? { ...apt, isCompleted: true }
                : apt
            );
          });
          return updatedItems;
        });

        const res = await completeAppointment(item.idAppointment);
        if (!res.success) {
          // Si falla, vuelve a cargar
          loadAppointments();
          Alert.alert('Error', res.error || 'No se pudo completar la cita');
        } else {
          Alert.alert('¡Éxito!', 'La cita ha sido marcada como completada');
        }
      } catch (error) {
        console.error('Error al completar cita:', error);
        loadAppointments();
        Alert.alert('Error', 'Ocurrió un problema al procesar la solicitud');
      }
    };

    return (
      <Card
        key={item.idAppointment}
        style={styles.appointmentCard}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.leftColumn}>
            <Avatar.Text
              size={48}
              label={item.patientName.charAt(0)}
              style={styles.avatar}
            />

            <Paragraph style={styles.patientName} numberOfLines={2}
              ellipsizeMode="tail">Paciente: {item.patientName}</Paragraph>
            <Paragraph style={styles.treatmentText}>Tratamiento: {item.treatmentType}</Paragraph>
          </View>

          <View style={styles.rightColumn}>
            <Text style={{ fontWeight: 'bold' }}>{item.time}</Text>
            <View style={styles.actionButtons}>
              {item.isCompleted && (
                <Button
                  mode="contained"
                  style={styles.actionButton}
                  buttonColor='#76dc9e'
                  textColor='black'
                  contentStyle={styles.buttonContent}
                  disabled={true}
                >
                  Editar
                </Button>
              )}
              {!item.isCompleted && (
                <Button
                  mode="contained"
                  onPress={() => {/* Implementar edición */ }}
                  style={styles.actionButton}
                  contentStyle={styles.buttonContent}
                >
                  Editar
                </Button>
              )}
              {item.isCompleted && (
                <Button
                  mode="contained"
                  style={styles.actionButton}
                  buttonColor='#76dc9e'
                  textColor='black'
                  contentStyle={styles.buttonContent}
                >
                  Completada
                </Button>
              )}
              {!item.isCompleted && (
                <Button
                  mode="contained"
                  onPress={onComplete}
                  style={styles.actionButton}
                  buttonColor='#76dc9e'
                  textColor='black'
                  contentStyle={styles.buttonContent}
                >
                  Completar cita
                </Button>
              )}
              {!item.isCompleted && (
                <Button
                  mode="contained-tonal"
                  onPress={() => handleDeletePress(item.idAppointment)}
                  style={styles.actionButton}
                  buttonColor='#f1948a'
                  textColor='black'
                  contentStyle={styles.buttonContent}
                  loading={deletingId === item.idAppointment}
                  disabled={deletingId === item.idAppointment}
                >
                  Eliminar cita
                </Button>
              )}
              {item.isCompleted && (
                <Button
                  mode="contained-tonal"
                  style={styles.actionButton}
                  buttonColor='#f1948a'
                  textColor='black'
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
  }

  if (loadingApts) return <ActivityIndicator style={{ flex: 1 }} />
  if (error) return <Text style={{ flex: 1, textAlign: 'center', color: 'red', marginTop: 20 }}>{error}</Text>

  const now = new Date()
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        key={Object.keys(items).length}
        items={items}
        loadItemsForMonth={loadItemsForMonth}
        selected={today}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
      <ConfirmModal
        visible={modalVisible}
        title="Eliminar Cita"
        message="¿Estás seguro de que deseas eliminar esta cita?"
        onConfirm={onDeleteConfirm}
        onCancel={() => setModalVisible(false)}
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
  leftColumn: {
    flex: 1,
    gap: 10,
    alignItems: 'flex-start',           // centra el avatar y textos
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',         // alinea hora y botones a la derecha
    gap: 10,
    flexDirection: 'column',
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
    margin: 10,
    backgroundColor: 'white',
  },
  cardContent: {
    padding: Platform.select({
      ios: 12,
      android: 10,
      default: 16
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 4,
    flexShrink: 1, // Permite que el texto se ajuste
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
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',           // permite que los botones bajen de línea
    justifyContent: 'flex-end',
    gap: 8,                     // si tu RN lo soporta, o usa margin en cada botón
  },
  actionButton: {
    minWidth: 100,
    borderRadius: 8,
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
    bottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
})