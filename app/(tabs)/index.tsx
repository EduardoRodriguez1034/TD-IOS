import React from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, Platform } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';

const HomeScreen = () => {
  const router = useRouter();
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  // Capitalizar primera letra
  const dateString = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <IconButton
            icon="magnify"
            size={24}
            onPress={() => router.push('/search')}
            style={styles.searchIcon}
          />
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
                <Text style={styles.dateText}>{dateString}</Text>
              </View>
              <Paragraph>No hay citas programadas para hoy</Paragraph>
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
                <Avatar.Icon size={40} icon="tooth-outline" style={styles.reminderIcon} />
                <View style={styles.reminderText}>
                  <Text style={styles.reminderTitle}>Seguimiento de Tratamientos</Text>
                  <Text style={styles.reminderCount}>3 pacientes pendientes de seguimiento</Text>
                </View>
              </View>
              <View style={styles.reminderItem}>
                <Avatar.Icon size={40} icon="calendar-clock" style={[styles.reminderIcon, { backgroundColor: '#e8f0ff' }]} />
                <View style={styles.reminderText}>
                  <Text style={styles.reminderTitle}>Confirmaciones Pendientes</Text>
                  <Text style={styles.reminderCount}>5 citas por confirmar esta semana</Text>
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
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Tratamientos{'\n'}Activos</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>3</Text>
                  <Text style={styles.statLabel}>Nuevos{'\n'}Pacientes</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>8</Text>
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

          {/* Inventario y Alertas */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Inventario y Alertas</Title>
              <View style={styles.alertItem}>
                <Avatar.Icon 
                  size={40} 
                  icon="alert-circle-outline" 
                  style={[styles.alertIcon, { backgroundColor: '#ffe4e4' }]} 
                  color="#cc0000" 
                />
                <View style={styles.alertText}>
                  <Text style={styles.alertTitle}>Materiales por Agotar</Text>
                  <Text style={styles.alertDescription}>2 productos necesitan reabastecimiento</Text>
                </View>
              </View>
              <View style={styles.alertItem}>
                <Avatar.Icon 
                  size={40} 
                  icon="medical-bag" 
                  style={[styles.alertIcon, { backgroundColor: '#fff0e6' }]} 
                  color="#cc5500" 
                />
                <View style={styles.alertText}>
                  <Text style={styles.alertTitle}>Mantenimiento de Equipos</Text>
                  <Text style={styles.alertDescription}>Próximo mantenimiento en 5 días</Text>
                </View>
              </View>
            </Card.Content>
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
    marginRight: 48,
  },
  clinicTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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