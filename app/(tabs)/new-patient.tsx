import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Title } from 'react-native-paper';
import { useFocusEffect, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/theme';
import { usePatient } from '../store/authStore';
import { SuccessModal } from '../components/SuccessModal';

const NewPatientScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [surName, setSurName] = useState('');
  const [sex, setSex] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [phone, setPhone] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { createPatient, error, isLoading, isAuthenticated } = usePatient();

  const resetForm = () => {
    setName('');
    setLastName('');
    setSurName('');
    setSex('');
    setPhone('');
    setBirthDate(new Date());
  };

  const BackHandler = () => {
    resetForm();
    router.replace('/(tabs)')
  }

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [])
  );

  const handleNewPatient = async (e) => {
    e.preventDefault();
    if (!name || !lastName || !surName || !sex || !phone || !birthDate) {
      Alert.alert('Error', 'Todos loc campos son obligatorios.');
      return;
    }
    try {
      const result = await createPatient(name, lastName, surName, sex, phone, birthDate);

      if (!result.success) {
        console.log('Error:', result.message);
        return;
      } else {
        resetForm();
        setSuccessModalVisible(true);
        setTimeout(() => {
          setSuccessModalVisible(false);
          router.replace('/(tabs)');
        }, 2000);
      }
    } catch (error) {
      console.error('Error al crear el paciente:', error);
      return;
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
            <Text style={styles.screenTitle}>Nuevo Paciente</Text>
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
              <Title style={styles.sectionTitle}>Información Personal</Title>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Nombre Completo"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  right={<TextInput.Icon icon="account" />}
                  mode="outlined"
                />

                <TextInput
                  label="Apellido Paterno"
                  value={lastName}
                  onChangeText={setLastName}
                  style={styles.input}
                  right={<TextInput.Icon icon="account" />}
                  mode="outlined"
                />

                <TextInput
                  label="Apellido Materno"
                  value={surName}
                  onChangeText={setSurName}
                  style={styles.input}
                  right={<TextInput.Icon icon="account" />}
                  mode="outlined"
                />

                <View style={styles.sexContainer}>
                  <Text style={styles.label}>Sexo</Text>
                  <View style={styles.sexOptions}>
                    {['Hombre', 'Mujer'].map((option) => (
                      <Button
                        key={option}
                        mode={sex === option ? 'contained' : 'outlined'}
                        onPress={() => setSex(option)}
                        style={styles.sexButton}
                      >
                        {option}
                      </Button>
                    ))}
                  </View>
                </View>

                <Button
                  mode="outlined"
                  onPress={() => setShowDatePicker(true)}
                  style={styles.input}
                  icon="calendar"
                >
                  {birthDate.toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Button>

                {showDatePicker && (
                  <DateTimePicker
                    value={birthDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    maximumDate={new Date()} // para evitar seleccionar el futuro
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (event.type === 'set' && selectedDate) {
                        setBirthDate(selectedDate);
                      }
                    }}
                  />
                )}

                <TextInput
                  label="Teléfono"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={styles.input}
                  right={<TextInput.Icon icon="phone" />}
                  mode="outlined"
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => { BackHandler() }}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  {isLoading ? 'Cargando...' : 'Cancelar'}
                </Button>
                {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
                <Button
                  mode="contained"
                  onPress={handleNewPatient}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  disabled={!name.trim() || !lastName.trim() || !surName.trim() || isLoading}
                >
                  {isLoading ? 'Cargando...' : 'Añadir Paciente'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
      <SuccessModal
        visible={successModalVisible}
        title="Paciente creado exitosamente"
        message="El paciente ha sido registrado en el sistema."
        buttonText="Volver al inicio del sistema"
        onDismiss={() => {
          setSuccessModalVisible(false);
          router.replace('/(tabs)');
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
  sexContainer: {
    marginBottom: 16,
  },
  sexOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  sexButton: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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

export default NewPatientScreen; 