import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { Text, TextInput, Button, Card, Title, Menu } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import { usePatient, useAppointment, useTreatment, useAuthStore } from '../store/authStore';
import { SuccessModal } from '../components/SuccessModal';

const NewAppointmentScreen = () => {
  const router = useRouter();
  const [dateTime, setDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [patient, setPatient] = useState('');
  const [treatment, setTreatment] = useState('');
  const [user, setUser] = useState('');
  const [treatmentList, setTreatmentList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const { getAllUsers } = useAuthStore();
  const { getAllTreatments } = useTreatment();
  const { getAllPatients } = usePatient();
  const { createAppointment, isAuthenticated, isLoading, error } = useAppointment();

  const fetchTreatments = useCallback(async () => {
    try {
      const response = await getAllTreatments();
      const treatments = response.treatment.map((item) => ({
        label: item.treatmentType,
        value: item.idTreatment
      }))

      setTreatmentList(treatments)

    } catch (error) {
      console.error('Error fetching treatments:', error);
      setTreatmentList(null)
    }
  }, [])

  const fetchPatients = useCallback(async () => {
    try {
      const response = await getAllPatients();
      const patients = response.patient.map((item) => ({
        label: `${item.name} ${item.lastName} ${item.surName}`,
        value: item.idPatient
      }))
      setPatientList(patients)
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getAllUsers();
      const users = response.user.map((item) => ({
        label: item.username,
        value: item.idUser
      }))

      setUserList(users);
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }, [])

  useEffect(() => { fetchTreatments(); }, [fetchTreatments])
  useEffect(() => { fetchPatients(); }, [fetchPatients])
  useEffect(() => { fetchUsers(); }, [fetchUsers])

  const resetForm = () => {
    setDateTime(new Date());
    setPatient('');
    setTreatment('');
    setUser('');
  };

  const TreatmentDropdown = ({ treatment, setTreatment, treatmentList }) => {
    const [visible, setVisible] = useState(false);

    return (
      <View style={{ marginVertical: 10 }}>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Button mode="outlined" onPress={() => setVisible(true)}>
              {treatmentList.find(t => t.value === treatment)?.label || 'Selecciona tratamiento'}
            </Button>
          }
        >
          {treatmentList.map(item => (
            <Menu.Item
              key={item.value}
              onPress={() => {
                setTreatment(item.value);
                setVisible(false);
              }}
              title={item.label}
            />
          ))}
        </Menu>
      </View>
    );
  };

  const DentistaDropdown = ({ user, setUser, userList }) => {
    const [visible, setVisible] = useState(false);

    return (
      <View style={{ marginVertical: 10 }}>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Button mode="outlined" onPress={() => setVisible(true)}>
              {userList.find(t => t.value === user)?.label || 'Selecciona dentista'}
            </Button>
          }
        >
          {userList.map(item => (
            <Menu.Item
              key={item.value}
              onPress={() => {
                setUser(item.value);
                setVisible(false);
              }}
              title={item.label}
            />
          ))}
        </Menu>
      </View>
    );
  };

  const PacienteDropdown = ({ patient, setPatient, patientList }) => {
    const [visible, setVisible] = useState(false);

    return (
      <View style={{ marginVertical: 10 }}>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Button mode="outlined" onPress={() => setVisible(true)}>
              {patientList.find(t => t.value === patient)?.label || 'Selecciona paciente'}
            </Button>
          }
        >
          {patientList.map(item => (
            <Menu.Item
              key={item.value}
              onPress={() => {
                setPatient(item.value);
                setVisible(false);
              }}
              title={item.label}
            />
          ))}
        </Menu>
      </View>
    );
  };

  const buildISOString = () => {
    if (!dateTime) return '';
    return new Date(dateTime).toISOString(); // Esto ya da UTC
  };

  const handleCreate = async () => {
    if (!dateTime || !patient || !treatment || !user) return;
    try {
      const res = await createAppointment({
        date: buildISOString(),
        idPatient: patient,
        idTreatment: treatment,
        idUser: user
      });
      if (res.success) {
        resetForm();
        setSuccessModalVisible(true);
        setTimeout(() => {
          setSuccessModalVisible(false);
          router.replace('/(tabs)');
        }, 2000);
      } else {
        console.error('No se pudo crear cita:', res.error);
      }
    } catch (error) {
      console.error('Error while creating the appointment:', error);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.mainContainer}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.screenTitle}>Nueva Cita</Text>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Información de la Cita</Title>

              <View style={styles.inputContainer}>
                <PacienteDropdown
                  patient={patient}
                  setPatient={setPatient}
                  patientList={patientList}

                />

                <View style={{ marginVertical: 10 }}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker(true)}
                    style={styles.input}
                  >
                    {dateTime.toLocaleString('es-MX', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </Button>

                  {showDatePicker && (
                    <DateTimePicker
                      value={dateTime}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'inline' : 'default'}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          const updatedDate = new Date(dateTime);
                          updatedDate.setFullYear(selectedDate.getFullYear());
                          updatedDate.setMonth(selectedDate.getMonth());
                          updatedDate.setDate(selectedDate.getDate());
                          setDateTime(updatedDate);
                          setShowTimePicker(true); // Mostrar el segundo picker después
                        }
                      }}
                    />
                  )}

                  {showTimePicker && (
                    <DateTimePicker
                      value={dateTime}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                          const updatedTime = new Date(dateTime);
                          updatedTime.setHours(selectedTime.getHours());
                          updatedTime.setMinutes(selectedTime.getMinutes());
                          setDateTime(updatedTime);
                        }
                      }}
                    />
                  )}
                </View>

                <TreatmentDropdown
                  treatment={treatment}
                  setTreatment={setTreatment}
                  treatmentList={treatmentList}
                />

                <DentistaDropdown
                  user={user}
                  setUser={setUser}
                  userList={userList}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => router.back()}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={() => { handleCreate() }}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  disabled={!dateTime || !patient || !user || !treatment || isLoading}
                >
                  {isLoading ? 'Cargando...' : 'Crear Cita'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
      <SuccessModal
        visible={successModalVisible}
        title="Cita creada exitosamente"
        message="La cita ha sido registrada en el sistema."
        buttonText="Volver al listado"
        onDismiss={() => {
          setSuccessModalVisible(false);
        }}
      />
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
  sectionTitle: {
    marginBottom: 24,
    color: COLORS.primary,
    fontSize: 20,
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 16,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default NewAppointmentScreen; 