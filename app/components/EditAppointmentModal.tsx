import React, { useRef, useState } from 'react';
import { Modal, View, StyleSheet, Animated, TouchableOpacity, FlatList, Dimensions, Platform } from 'react-native';
import { Button, TextInput, Text, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/theme';
import { DatePickerModal } from 'react-native-paper-dates';

interface EditAppointmentModalProps {
    visible: boolean;
    appointment: {
        idAppointment: number;
        dateISO: string;
        treatmentType: string;
        patientName: string;
    };
    treatments: Array<{ label: string; value: number }>;
    onSave: (updatedData: { date: string; idTreatment: number }) => void;
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

    const dropdownHeight = dropdownAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [
            0, Math.min(treatmentList.length * 50, maxDropdownHeight)
        ]
    })

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
                <Animated.View
                    style={[
                        styles.dropdownList,
                        // on web, force a real number height
                        Platform.OS === 'web'
                            ? { height: dropdownHeight }
                            : {}
                    ]}
                >
                    <FlatList
                        data={treatmentList}
                        keyExtractor={(item) => item.value.toString()}
                        style={{ flexGrow: 0 }}
                        scrollEnabled={true}
                        bounces={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
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
                        )}
                    />
                </Animated.View>
            )}
        </View>
    );
};
export const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
    visible,
    appointment,
    treatments,
    onSave,
    onCancel,
}) => {
    const [date, setDate] = useState(new Date(appointment.dateISO));
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [selectedTreatment, setSelectedTreatment] = useState(() => {
        const currentTreatment = treatments.find(t => t.label === appointment.treatmentType);
        return currentTreatment ? currentTreatment.value : (treatments[0]?.value || 0);
    });

    const handleSave = () => {
        onSave({
            date: date.toISOString(),
            idTreatment: selectedTreatment,
        });
    };

    function setTime(arg0: string) {
        throw new Error('Function not implemented.');
    }

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <Card style={styles.card}>
                    <Card.Content>
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
                            style={styles.input}
                        >
                            {date.toLocaleString('es-MX', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                            })}
                        </Button>

                        {showDateTimePicker && (
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
                                        setShowDateTimePicker(false); // cancelado
                                    }
                                }}
                            />
                        )}

                        <Text style={styles.label}>Tratamiento:</Text>
                        <View style={{ zIndex: 2 }}>

                            <TreatmentDropdown
                                treatment={selectedTreatment}
                                setTreatment={setSelectedTreatment}
                                treatmentList={treatments}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                mode="outlined"
                                onPress={onCancel}
                                style={styles.button}
                            >
                                Cancelar
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleSave}
                                style={styles.button}
                            >
                                Guardar
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    card: {
        width: '90%',
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: COLORS.primary,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        backgroundColor: 'white',
    },
    dropdownText: {
        fontSize: 16,
    },
    dropdownIcon: {
        fontSize: 12,
        color: '#666',
    },
    dropdownDialog: {
        maxHeight: '60%',
        backgroundColor: 'white',
    },
    dropdownOptions: {
        padding: 10,
    },
    dropdownOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedOption: {
        backgroundColor: COLORS.primary,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    selectedOptionText: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    container: {
        marginVertical: 10,
        zIndex: 1000, // Asegura que el menú aparezca sobre otros elementos
    },
    buttonContent: {
        flexDirection: 'row-reverse',
    },
    menuStyle: {
        marginTop: 40, // Ajusta según sea necesario
        width: '80%', // Controla el ancho del menú
    },
    item: {
        color: '#333',
        fontSize: 16,
    },
    selectedItemView: {
        backgroundColor: '#f0f0f0',
    },
    selectedItem: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16,
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
            web: { overflowY: 'auto' },
            default: { overflow: 'hidden' },
        }),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        maxHeight: Dimensions.get('window').height * 0.4,
        zIndex: 1000
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
});