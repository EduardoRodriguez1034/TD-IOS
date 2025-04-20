import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, Dimensions, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { Text, TextInput, Button, Card, Title, IconButton, Menu, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import * as DocumentPicker from 'expo-document-picker';

const { width } = Dimensions.get('window');

const NewPatientScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [gender, setGender] = useState('');
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const openGenderMenu = () => setGenderMenuVisible(true);
  const closeGenderMenu = () => setGenderMenuVisible(false);

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      if (result.type === 'success') {
        console.log('Archivo seleccionado:', result.uri);
        // Aquí puedes manejar el archivo seleccionado
      }
    } catch (error) {
      console.error('Error al seleccionar el archivo:', error);
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
                  label="Nombre"
                  value={firstName}
                  onChangeText={setFirstName}
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
                  value={middleName}
                  onChangeText={setMiddleName}
                  style={styles.input}
                  right={<TextInput.Icon icon="account" />}
                  mode="outlined"
                />

                <Menu
                  visible={genderMenuVisible}
                  onDismiss={closeGenderMenu}
                  anchor={<Button onPress={openGenderMenu} mode="outlined" style={styles.input}>Seleccionar Sexo</Button>}
                >
                  <Menu.Item onPress={() => setGender('Hombre')} title="Hombre" />
                  <Menu.Item onPress={() => setGender('Mujer')} title="Mujer" />
                </Menu>

                <TextInput
                  label="Fecha de Nacimiento"
                  value={birthDate}
                  onChangeText={(text) => {
                    setBirthDate(text);
                    // Aquí podrías agregar validación de fecha si lo deseas
                  }}
                  placeholder="YYYY-MM-DD"
                  style={styles.input}
                  right={<TextInput.Icon icon="calendar-account" />}
                  mode="outlined"
                />

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
                <Button
                  mode="outlined"
                  onPress={handleDocumentUpload}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  Subir Consentimiento Informado
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

export default NewPatientScreen; 