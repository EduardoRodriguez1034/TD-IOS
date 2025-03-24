import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { Text, TextInput, Button, IconButton, Card, Title } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';

const NewAppointmentScreen = () => {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [patient, setPatient] = useState('');
  const [treatment, setTreatment] = useState('');

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
                <TextInput
                  label="Paciente"
                  value={patient}
                  onChangeText={setPatient}
                  style={styles.input}
                  right={<TextInput.Icon icon="account-search" />}
                  mode="outlined"
                />

                <TextInput
                  label="Fecha"
                  value={date}
                  onChangeText={setDate}
                  style={styles.input}
                  right={<TextInput.Icon icon="calendar" />}
                  mode="outlined"
                />

                <TextInput
                  label="Hora"
                  value={time}
                  onChangeText={setTime}
                  style={styles.input}
                  right={<TextInput.Icon icon="clock" />}
                  mode="outlined"
                />

                <TextInput
                  label="Tratamiento"
                  value={treatment}
                  onChangeText={setTreatment}
                  style={styles.input}
                  right={<TextInput.Icon icon="medical-bag" />}
                  mode="outlined"
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
                  onPress={() => {/* Implementar guardado */}}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  Guardar
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
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