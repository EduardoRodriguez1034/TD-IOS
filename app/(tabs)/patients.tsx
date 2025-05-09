import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, Platform, Dimensions } from 'react-native';
import { Card, IconButton, Searchbar, FAB, Chip, Menu, Divider } from 'react-native-paper';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import { usePatient, useAppointment } from '../store/authStore';

const PatientsScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const { getAllAppointments } = useAppointment();
  const { getAllPatients, error, isAuthenticated } = usePatient();

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await getAllAppointments();
      if (response.success && Array.isArray(response.appointments)) {
        setAppointments(response.appointments)
      } else {
        setAppointments([])
      }
    } catch (error) {
      console.error('Error al buscar las citas:', error)
    }
  }, [getAllAppointments])

  const fetchPatients = useCallback(async () => {
    try {
      const response = await getAllPatients();
      if (response.success && Array.isArray(response.patient)) {
        setPatients(response.patient)
      } else {
        setPatients([])
      }
    } catch (error) {
      console.error('Error al buscar pacientes:', error)
    }
  }, [getAllPatients])

  const getLastCompletedAppointment = (idPatient: number): Date | null => {
    if (!appointments?.length) return null;

    const completed = appointments.filter(a =>
      a.idPatient === idPatient && a.isCompleted
    );

    if (completed.length === 0) return null

    const mostRecent = completed.reduce((prev, curr) => {
      return new Date(curr.date).getTime() > new Date(prev.date).getTime()
        ? curr
        : prev;
    }, completed[0]);

    return new Date(mostRecent.date)
  }

  const isPatientActive = (idPatient: number): boolean => {
    const lastVisit = getLastCompletedAppointment(idPatient);
    if (!lastVisit) return false;

    const now = new Date();
    const diffInMonths =
      (now.getFullYear() - lastVisit.getFullYear()) * 12 +
      (now.getMonth() - lastVisit.getMonth());

    return diffInMonths < 8;
  };


  useEffect(() => { fetchPatients(); fetchAppointments(); }, [fetchAppointments, fetchPatients]);

  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [fetchPatients])
  )

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isActive = isPatientActive(patient.idPatient);
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'active' && isActive) ||
      (selectedFilter === 'inactive' && !isActive);

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
          {filteredPatients.map((patient) => {
            const fullName = `${patient.name || ''} ${patient.lastName || ''} ${patient.surName || ''}`.trim();

            return (
              <Card
                key={patient.idPatient}
                style={styles.patientCard}
                onPress={() => router.push(`(patient)/${patient.idPatient}`)}
              >
                <Card.Content style={styles.cardContent}>
                  <View style={styles.patientInfo}>
                    <View style={styles.patientDetails}>
                      <Text style={styles.patientName}>
                        {fullName || 'Nombre no disponible'}
                      </Text>
                      <Text style={styles.patientPhone}>{patient.phone}</Text>
                    </View>
                  </View>
                  <View style={styles.patientStatus}>
                    <Chip
                      mode="outlined"
                      style={[styles.statusChip, { borderColor: isPatientActive(patient.idPatient) ? '#4CAF50' : '#9E9E9E' }]}
                      textStyle={{ color: getStatusColor(patient.status) }}
                    >
                      {isPatientActive(patient.idPatient) ? 'Activo' : 'Inactivo'}
                    </Chip>
                  </View>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                  <View style={styles.visitInfo}>
                    <Text style={styles.visitLabel}>Última visita:</Text>
                    <Text style={styles.visitDate}>
                      {getLastCompletedAppointment(patient.idPatient)
                        ? getLastCompletedAppointment(patient.idPatient)!.toLocaleDateString('es-ES')
                        : 'No registrada'
                      }
                    </Text>
                  </View>
                </Card.Actions>
              </Card>
            );
          })}
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
  patientSex: {
    fontSize: 18,
    marginBottom: 4,
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