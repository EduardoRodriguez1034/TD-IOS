import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Próximas Citas</Title>
          <Paragraph>No hay citas programadas para hoy</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => router.push('/appointments')}>Ver Todas</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Pacientes Recientes</Title>
          <Paragraph>No hay pacientes registrados recientemente</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => router.push('/patients')}>Ver Todos</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Acciones Rápidas</Title>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              style={styles.actionButton}
              onPress={() => router.push('/appointments/new')}
            >
              Nueva Cita
            </Button>
            <Button
              mode="contained"
              style={styles.actionButton}
              onPress={() => router.push('/patients/new')}
            >
              Nuevo Paciente
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: COLORS.primary,
  },
});

export default HomeScreen; 