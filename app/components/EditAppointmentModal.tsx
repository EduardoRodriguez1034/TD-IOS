import React, { useRef, useState } from 'react';
import { Modal, View, StyleSheet, Animated, TouchableOpacity, FlatList, Dimensions, Platform, ScrollView } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/theme';

interface EditAppointmentModalProps {
    visible: boolean;
    appointment: {
        idAppointment: number;
        dateISO: string;
        treatmentType: string;
        patientName: string;
        isConfirmed: boolean;
    };
    treatments: Array<{ label: string; value: number }>;
    onSave: (updatedData: { date: string; idTreatment: number, isConfirmed: boolean; }) => void;
    onCancel: () => void;
}

interface TreatmentDropdownProps {
    treatment: number;
    setTreatment: (value: number) => void;
    treatmentList: Array<{ label: string; value: number }>;
}

const TreatmentDropdown = ({ treatment, setTreatment, treatmentList }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownAnim = useRef(new Animated.Value(0)).current;
    const selectedLabel = treatmentList.find(t => t.value === treatment)?.label;

    const { height: SCREEN_HEIGHT } = Dimensions.get('window')
    const maxDropdownHeight = SCREEN_HEIGHT * 0.4;

    const toggleDropdown = () => {
        if (dropdownVisible) {
            Animated.timing(dropdownAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start(() => setDropdownVisible(false));
        } else {
            setDropdownVisible(true);
            Animated.timing(dropdownAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    };

    const selectItem = (value) => {
        setTreatment(value);
        toggleDropdown();
    };

    return (
        <View style={styles.dropdownContainer}>
            <TouchableOpacity
                style={styles.dropdownHeader}
                onPress={toggleDropdown}
                activeOpacity={0.8}
            >
                <Text style={styles.dropdownHeaderText}>
                    {selectedLabel || 'Seleccionar tratamiento'}
                </Text>
                <Text style={styles.dropdownArrow}>
                    {dropdownVisible ? '▲' : '▼'}
                </Text>
            </TouchableOpacity>

            {dropdownVisible && (
                <View style={[styles.dropdownList, { maxHeight: maxDropdownHeight }]}>
                    {treatmentList.map((item) => (
                        <TouchableOpacity
                            key={item.value.toString()}
                            style={[
                                styles.dropdownItem,
                                treatment === item.value && styles.selectedItemView
                            ]}
                            onPress={() => selectItem(item.value)}
                        >
                            <Text style={treatment === item.value ? styles.selectedText : styles.itemText}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
    visible,
    appointment,
    treatments,
    onSave,
    onCancel,
}) => {
    const [date, setDate] = useState(new Date(appointment.dateISO));
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [confirmed, setConfirmed] = useState(appointment.isConfirmed);
    const [selectedTreatment, setSelectedTreatment] = useState(() => {
        const currentTreatment = treatments.find(t => t.label === appointment.treatmentType);
        return currentTreatment ? currentTreatment.value : (treatments[0]?.value || 0);
    });

    const handleSave = () => {
        onSave({
            date: date.toISOString(),
            idTreatment: selectedTreatment,
            isConfirmed: confirmed
        });
    };
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <Text style={styles.title}>Editar Cita</Text>

                            <Text style={styles.label}>Paciente:</Text>
                            <Text style={styles.value}>{appointment.patientName}</Text>

                            <Text style={styles.label}>Fecha y Hora:</Text>
                            <Button
                                mode="outlined"
                                onPress={() => {
                                    setPickerMode('date');
                                    setShowDateTimePicker(true);
                                }}
                                style={styles.dateButton}
                            >
                                {date.toLocaleString('es-MX', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                })}
                            </Button>

                            {showDateTimePicker && Platform.OS === 'ios' && (
                                <View style={styles.datePickerContainer}>
                                    <DateTimePicker
                                        value={date}
                                        mode={pickerMode}
                                        is24Hour={false}
                                        display="spinner"
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) {
                                                const updated = new Date(date);
                                                if (pickerMode === 'date') {
                                                    updated.setFullYear(selectedDate.getFullYear());
                                                    updated.setMonth(selectedDate.getMonth());
                                                    updated.setDate(selectedDate.getDate());
                                                } else {
                                                    updated.setHours(selectedDate.getHours());
                                                    updated.setMinutes(selectedDate.getMinutes());
                                                }
                                                setDate(updated);
                                            }
                                        }}
                                    />
                                    <View style={styles.datePickerButtons}>
                                        <Button 
                                            mode="text"
                                            onPress={() => setShowDateTimePicker(false)}
                                            style={styles.datePickerButton}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button 
                                            mode="contained"
                                            onPress={() => {
                                                if (pickerMode === 'date') {
                                                    setPickerMode('time');
                                                } else {
                                                    setShowDateTimePicker(false);
                                                }
                                            }}
                                            style={styles.datePickerButton}
                                        >
                                            {pickerMode === 'date' ? 'Siguiente' : 'Listo'}
                                        </Button>
                                    </View>
                                </View>
                            )}

                            {showDateTimePicker && Platform.OS === 'android' && (
                                <DateTimePicker
                                    value={date}
                                    mode={pickerMode}
                                    is24Hour={false}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        if (event.type === 'set' && selectedDate) {
                                            if (pickerMode === 'date') {
                                                const updated = new Date(date);
                                                updated.setFullYear(selectedDate.getFullYear());
                                                updated.setMonth(selectedDate.getMonth());
                                                updated.setDate(selectedDate.getDate());
                                                setDate(updated);

                                                setPickerMode('time');
                                                setShowDateTimePicker(true);
                                            } else {
                                                const updated = new Date(date);
                                                updated.setHours(selectedDate.getHours());
                                                updated.setMinutes(selectedDate.getMinutes());
                                                setDate(updated);
                                                setShowDateTimePicker(false);
                                            }
                                        } else {
                                            setShowDateTimePicker(false);
                                        }
                                    }}
                                />
                            )}

                            <Text style={styles.label}>Tratamiento:</Text>
                            <View style={styles.dropdownWrapper}>
                                <TreatmentDropdown
                                    treatment={selectedTreatment}
                                    setTreatment={setSelectedTreatment}
                                    treatmentList={treatments}
                                />
                            </View>

                            <Text style={styles.label}>Estado de la cita</Text>
                            <View style={styles.confirmationContainer}>
                                <Button
                                    mode={confirmed ? 'contained' : 'outlined'}
                                    onPress={() => setConfirmed(true)}
                                    style={[styles.confirmButton, confirmed && styles.activeButton]}
                                    labelStyle={confirmed ? styles.activeButtonLabel : styles.inactiveButtonLabel}
                                >
                                    Confirmada
                                </Button>
                                <Button
                                    mode={!confirmed ? 'contained' : 'outlined'}
                                    onPress={() => setConfirmed(false)}
                                    style={[styles.confirmButton, !confirmed && styles.activeButton]}
                                    labelStyle={!confirmed ? styles.activeButtonLabel : styles.inactiveButtonLabel}
                                >
                                    No confirmada
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>

                    <View style={styles.bottomButtonContainer}>
                        <Button
                            mode="outlined"
                            onPress={onCancel}
                            style={styles.bottomButton}
                            labelStyle={styles.buttonLabel}
                        >
                            Cancelar
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            style={styles.bottomButton}
                            labelStyle={styles.buttonLabel}
                        >
                            Guardar
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EditAppointmentModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    cardContent: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: COLORS.primary,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    value: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    dateButton: {
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
    },
    datePickerContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    datePickerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f8f8f8',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    datePickerButton: {
        minWidth: 100,
    },
    dropdownWrapper: {
        zIndex: 2,
        marginBottom: 16,
    },
    confirmationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 8,
    },
    confirmButton: {
        flex: 1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.primary,
        height: 48,
    },
    activeButton: {
        backgroundColor: COLORS.primary,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    activeButtonLabel: {
        color: 'white',
    },
    inactiveButtonLabel: {
        color: COLORS.primary,
    },
    bottomButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    bottomButton: {
        flex: 1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.primary,
        height: 48,
    },
    container: {
        marginVertical: 10,
        zIndex: 1000,
    },
    dropdownContainer: {
        marginVertical: 10,
        zIndex: 1000,
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
        backgroundColor: 'white',
    },
    dropdownHeaderText: {
        fontSize: 16,
    },
    dropdownArrow: {
        fontSize: 12,
        color: '#666',
    },
    dropdownList: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginTop: 5,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    selectedText: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    selectedItemView: {
        backgroundColor: '#f0f0f0',
    },
    selectedItem: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});