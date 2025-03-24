import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, Platform, Dimensions } from 'react-native';
import { Card, Title, Button, IconButton, Searchbar, FAB, Avatar, Chip, Menu, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';

// Datos de ejemplo
const patients = [
  {
    id: '1',
    name: 'Juan Pérez',
    lastVisit: '2024-03-15',
    nextAppointment: '2024-03-25',
    status: 'active',
    phone: '+34 123 456 789',
  },
  {
    id: '2',
    name: 'María García',
    lastVisit: '2024-03-10',
    nextAppointment: null,
    status: 'inactive',
    phone: '+34 987 654 321',
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    lastVisit: '2024-03-18',
    nextAppointment: '2024-04-01',
    status: 'active',
    phone: '+34 456 789 123',
  },
  {
    id: '4',
    name: 'Ana Martínez',
    lastVisit: '2024-02-28',
    nextAppointment: '2024-03-30',
    status: 'active',
    phone: '+34 789 123 456',
  },
  {
    id: '5',
    name: 'Pedro Sánchez',
    lastVisit: '2024-01-15',
    nextAppointment: null,
    status: 'inactive',
    phone: '+34 321 654 987',
  },
  {
    id: '6',
    name: 'Laura López',
    lastVisit: '2024-03-20',
    nextAppointment: '2024-04-05',
    status: 'active',
    phone: '+34 654 321 987',
  },
  {
    id: '7',
    name: 'Miguel Torres',
    lastVisit: '2024-03-12',
    nextAppointment: '2024-03-28',
    status: 'active',
    phone: '+34 147 258 369',
  },
  {
    id: '8',
    name: 'Sofia Ruiz',
    lastVisit: '2024-02-20',
    nextAppointment: null,
    status: 'inactive',
    phone: '+34 258 369 147',
  },
  {
    id: '9',
    name: 'David Moreno',
    lastVisit: '2024-03-19',
    nextAppointment: '2024-04-02',
    status: 'active',
    phone: '+34 369 147 258',
  },
  {
    id: '10',
    name: 'Carmen Jiménez',
    lastVisit: '2024-03-17',
    nextAppointment: '2024-03-29',
    status: 'active',
    phone: '+34 741 852 963',
  },
  {
    id: '11',
    name: 'Roberto Díaz',
    lastVisit: '2024-01-10',
    nextAppointment: null,
    status: 'inactive',
    phone: '+34 852 963 741',
  },
  {
    id: '12',
    name: 'Isabel Castro',
    lastVisit: '2024-03-21',
    nextAppointment: '2024-04-03',
    status: 'active',
    phone: '+34 963 741 852',
  }
];

const PatientsScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || patient.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

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
            <Text style={styles.screenTitle}>Pacientes</Text>
          </View>
          <IconButton
            icon="filter-variant"
            size={24}
            onPress={() => setFilterMenuVisible(true)}
            style={styles.filterIcon}
          />
        </View>

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar paciente..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={COLORS.primary}
            inputStyle={styles.searchInput}
          />
        </View>

        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredPatients.map((patient) => (
            <Card 
              key={patient.id} 
              style={styles.patientCard}
              onPress={() => router.push(`/patients/${patient.id}`)}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.patientInfo}>
                  <Avatar.Text 
                    size={50} 
                    label={patient.name.split(' ').map(n => n[0]).join('')}
                    style={styles.avatar}
                  />
                  <View style={styles.patientDetails}>
                    <Title style={styles.patientName}>{patient.name}</Title>
                    <Text style={styles.patientPhone}>{patient.phone}</Text>
                  </View>
                </View>
                <View style={styles.patientStatus}>
                  <Chip 
                    mode="outlined" 
                    style={[styles.statusChip, { borderColor: getStatusColor(patient.status) }]}
                    textStyle={{ color: getStatusColor(patient.status) }}
                  >
                    {getStatusLabel(patient.status)}
                  </Chip>
                </View>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <View style={styles.visitInfo}>
                  <Text style={styles.visitLabel}>Última visita:</Text>
                  <Text style={styles.visitDate}>
                    {new Date(patient.lastVisit).toLocaleDateString('es-ES')}
                  </Text>
                </View>
                {patient.nextAppointment && (
                  <View style={styles.visitInfo}>
                    <Text style={styles.visitLabel}>Próxima cita:</Text>
                    <Text style={styles.visitDate}>
                      {new Date(patient.nextAppointment).toLocaleDateString('es-ES')}
                    </Text>
                  </View>
                )}
              </Card.Actions>
            </Card>
          ))}
        </ScrollView>

        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={{ x: Dimensions.get('window').width - 50, y: 0 }}
        >
          <Menu.Item 
            onPress={() => {
              setSelectedFilter('all');
              setFilterMenuVisible(false);
            }}
            title="Todos"
            leadingIcon="account-group"
            disabled={selectedFilter === 'all'}
          />
          <Divider />
          <Menu.Item 
            onPress={() => {
              setSelectedFilter('active');
              setFilterMenuVisible(false);
            }}
            title="Activos"
            leadingIcon="check-circle"
            disabled={selectedFilter === 'active'}
          />
          <Menu.Item 
            onPress={() => {
              setSelectedFilter('inactive');
              setFilterMenuVisible(false);
            }}
            title="Inactivos"
            leadingIcon="close-circle"
            disabled={selectedFilter === 'inactive'}
          />
        </Menu>

        <FAB
          icon="account-plus"
          style={styles.fab}
          onPress={() => router.push('/new-patient')}
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
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  filterIcon: {
    margin: 0,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  patientCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
  patientDetails: {
    marginLeft: 16,
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    marginBottom: 4,
  },
  patientPhone: {
    color: '#666',
    fontSize: 14,
  },
  patientStatus: {
    marginLeft: 16,
  },
  statusChip: {
    borderRadius: 16,
  },
  cardActions: {
    padding: 16,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  visitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  visitLabel: {
    color: '#666',
    fontSize: 14,
    marginRight: 4,
  },
  visitDate: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
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

export default PatientsScreen; 