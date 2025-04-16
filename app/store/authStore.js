import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    signup: async (email, password, username) => {
        set({ isLoading: true, error: null });
        try {
            // Simulate a signup process
            const response = await fetch(`https://54.176.10.118:8443/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password, username }),
            })
            const data = await response.json();
        } catch (error) {
            console.log(error);
        }
    },
    
    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/verify-email`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ code }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al verificar correo:", error);
            throw error;
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/forgot-password`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al mandar correo de recuperacion de contraseña:", error);
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/reset-password/${token}`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al cambiar contraseña:", error);
            throw error;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/login`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error en login:", error);
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/logout`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al cerrar sesión:", error);
            throw error;
        }
    },

    updateUser: async (idUser, username, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/user/${idUser}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar usuario:", error);
            throw error;
        }
    },

    deleteUser: async (idUser) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/user/${idUser}`, {
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar usuario:", error);
            throw error;
        }
    },
}));

export const usePatient = create((set) => ({
    patient: null, 
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createPatient: async (name, lastName, surName, sex, phone, birthDate) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, lastName, surName, sex, phone, birthDate }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, patient: data.patient });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear paciente:", error);
            throw error;
        }
    },
    getAllPatient: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, patient: data.patient });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener los pacientes:", error);
            throw error;
        }
    },
    getAPatient: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient/${idPatient}`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, patient: data.patient });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener el paciente:", error);
            throw error;
        }
    },
    updatePatient: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient/${idPatient}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, lastName, surName, sex, phone, birthDate }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, patient: data.patient });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar el paciente:", error);
            throw error;
        }
    },
    deletePatient: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient/${idPatient}`, {
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, patient: data.patient });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar el paciente:", error);
            throw error;
        }
    },
}));

export const useTreatment = create((set) => ({
    treatment: null, 
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createTreatment: async (treatmentType, description, price) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentType, description, price }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, treatment: data.treatment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear tratamiento:", error);
            throw error;
        }
    },
    getAllTreatments: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentType, description, price }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, treatment: data.treatment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener los tratamientos:", error);
            throw error;
        }
    },
    getATreatment: async (idTreatment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment/${idTreatment}`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentType, description, price }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, treatment: data.treatment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener el tratamiento:", error);
            throw error;
        }
    },
    updateTreatment: async (idTreatment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment/${idTreatment}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentType, description, price }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, treatment: data.treatment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar el tratamiento:", error);
            throw error;
        }
    },
    deleteTreatment: async (idTreatment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment/${idTreatment}`, {
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idTreatment }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, treatment: data.treatment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar el tratamiento:", error);
            throw error;
        }
    },
}));

export const useNote = create((set) => ({
    note: null, 
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createNote: async (title, description, idNoteType, idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, description, idNoteType, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, note: data.note });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear la nota:", error);
            throw error;
        }
    },
    getAllNotes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, note: data.note });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener las notas:", error);
            throw error;
        }
    },
    getANote: async (idNote) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note/${idNote}`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, description, idNoteType, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, note: data.note });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener la nota:", error);
            throw error;
        }
    },
    updateNote: async (idNote) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note/${idNote}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, description, idNoteType, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, note: data.note });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar la nota:", error);
            throw error;
        }
    },
    deleteNote: async (idNote) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note/${idNote}`, {
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, note: data.note });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar la nota:", error);
            throw error;
        }
    },
}));

export const useNoteType = create((set) => ({
    noteType: null, 
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createNoteType: async (noteType, description) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note-type`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({noteType, description }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, noteType: data.noteType });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear el tipo de nota:", error);
            throw error;
        }
    },
    getAllNoteTypes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note-type`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({noteType, description}),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, noteType: data.noteType });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener los tipos de notas:", error);
            throw error;
        }
    },
    getANoteType: async (idNoteType) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note-type/${idNoteType}`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ noteType, description }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, noteType: data.noteType });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener el tipo de nota:", error);
            throw error;
        }
    },
    updateNoteType: async (idNoteType) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note-type/${idNoteType}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ noteType, description }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, noteType: data.noteType });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar la nota:", error);
            throw error;
        }
    },
    deleteNoteType: async (idNoteType) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note-type/${idNoteType}`, {
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, noteType: data.noteType });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar el tipo de nota:", error);
            throw error;
        }
    },
}));

export const useAppointment = create((set) => ({
    appointment: null, 
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createAppointment: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ appointmentDate, appointmentHour, idUser, idPatient , idTreatment }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, appointment: data.appointment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear la cita:", error);
            throw error;
        }
    },
    getAllAppointments: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ appointmentDate, appointmentHour, idUser, idPatient , idTreatment }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, appointment: data.appointment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener las citas:", error);
            throw error;
        }
    },
    getAnAppointment: async (idAppointment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/${idAppointment}`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ appointmentDate, appointmentHour, idUser, idPatient , idTreatment }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, appointment: data.appointment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener la cita:", error);
            throw error;
        }
    },
    updateAppointment: async (idAppointment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/${idAppointment}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ appointmentDate, appointmentHour, idUser, idPatient , idTreatment }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, appointment: data.appointment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar la cita:", error);
            throw error;
        }
    },
    deleteAppointment: async (idAppointment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/${idAppointment}`, {
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, appointment: data.appointment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar la cita:", error);
            throw error;
        }
    },
}));

export const useClinicalRecord = create((set) => ({
    clinical: null, 
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createClinicalRecord: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentsDone, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, clinical: data.clinical });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear el expediente clinico:", error);
            throw error;
        }
    },
    getAllClinicalRecords: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentsDone, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, clinical: data.clinical });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener los expedientes clinicos:", error);
            throw error;
        }
    },
    getClinicalRecordByPk: async (idClinicalRecord) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/${idClinicalRecord}`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentsDone, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, clinical: data.clinical });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener el expediente clinico:", error);
            throw error;
        }
    },    
    getClinicalRecordByPatientId: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/patient/${idPatient}`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentsDone, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, clinical: data.clinical });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener el expediente clinico:", error);
            throw error;
        }
    },
    addInformedConcent: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record//informed-concent/${idPatient}`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentsDone, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, clinical: data.clinical });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al añadir consentimiento informado:", error);
            throw error;
        }
    },
    getInformedConcent: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record//informed-concent/${idPatient}`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentsDone, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, clinical: data.clinical });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener el consentimiento informado:", error);
            throw error;
        }
    },
    updateClinicalRecord: async (idClinicalRecord) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/${idClinicalRecord}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentsDone, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, clinical: data.clinical });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar el expediente clinico:", error);
            throw error;
        }
    },
    deleteClinicalRecord: async (idClinicalRecord) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/${idClinicalRecord}`, {
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(),
            });
            const data = await response.json();
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, clinical: data.clinical });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar el expediente clinico:", error);
            throw error;
        }
    },
}));