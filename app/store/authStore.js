import { create } from 'zustand';
import { getAuthCookie } from '../store/getAuthCookie';

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    signup: async (username, email, password) => {
        set({ isLoading: true, error: null });

        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, user: data.user };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al registrarse:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, user: data.user };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al verificar codigo de confirmación:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email
                }),
            });
            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, user: data.user };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al mandar correo de recuperación:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }
            set({ isLoading: false, isAuthenticated: true, user: data.user });
            return { success: true, isLoading: false, isAuthenticated: true, user: data.user };

        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al cambiar contraseña:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, user: data.user };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al iniciar sesión:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, user: data.user };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al cerrar sesión:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },

    getAllUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/user`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }
            set({ isLoading: false, isAuthenticated: true, user: data.user });
            return { success: true, isLoading: false, isAuthenticated: true, user: data.user };

        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener usuarios:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, user: data.user };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar usuario:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, user: data.user };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar usuario:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, patient: data.patient };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al registrar paciente:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getAllPatients: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, patient: data.patient };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener los pacientes:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getAPatient: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient/${idPatient}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, patient: data.patient };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al buscar paciente:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, patient: data.patient };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar paciente:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    deletePatient: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient/${idPatient}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 204 ||
                (response.headers.get('Content-Type') === null &&
                    response.status >= 200 && response.status < 300)) {
                return { success: true, isLoading: false, isAuthenticated: true, patient: null };
            }
            const contentLength = response.headers.get('Content-Length');
            if (contentLength === '0' || !response.ok) {
                return { isLoading: false, success: false, error: error.message };
            }

            // Solo intenta parsear JSON si hay contenido
            const data = await response.json();
            return { success: true, isLoading: false, isAuthenticated: true, patient: null };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar paciente:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, treatment: data.treatment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear tratamiento:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getAllTreatments: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, treatment: data.treatment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener todos los tratamientos:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getATreatment: async (idTreatment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment/${idTreatment}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, treatment: data.treatment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al buscar tratamiento:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, treatment: data.treatment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar tratamiento:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, treatment: data.treatment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar tratamiento:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, note: data.note };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear nota:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, note: data.note };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener todas las notas:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, note: data.note };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al buscar nota:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, note: data.note };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar nota:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    deleteNote: async (idNote) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note/${idNote}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, note: data.note };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar nota:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
                body: JSON.stringify({ noteType, description }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, noteType: data.noteType };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear tipo de nota:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getAllNoteTypes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note-type`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ noteType, description }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, noteType: data.noteType };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener todos los tipos de notas:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, noteType: data.noteType };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al buscar tipo de nota:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, noteType: data.noteType };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar tipo de nota:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    deleteNoteType: async (idNoteType) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note-type/${idNoteType}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, noteType: data.noteType };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar tipo de nota:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
}));

export const useAppointment = create((set) => ({
    appointment: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createAppointment: async ({ date, idPatient, idTreatment, idUser }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    date,
                    idUser,
                    idPatient,
                    idTreatment,
                }),
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, appointment: data.appointment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear cita:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getAllAppointments: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, appointments: data.appointments };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener todas las citas:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getAnAppointment: async (idAppointment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/${idAppointment}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, appointment: data.appointment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al buscar cita:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    // dentro de useAppointment:
    getNextAppointmentForPatient: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(
                `https://truval-dental.ddns.net:8443/appointments/patient/${idPatient}/next-appointment`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                }
            );
            const data = await response.json();
            if (!response.ok) {
                set({ error: data.message });
                return { success: true, error: data.message };
            }
            // suponemos que el backend devuelve { success: true, appointment: {...} }
            return { success: true, appointment: data.appointment };
        } catch (err) {
            console.error("Error al obtener próxima cita:", err);
            set({ error: err.message });
            return { success: false, error: err.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getAppointmentByPatientId: async (date, idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/patient/${idPatient}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, appointment: data.appointment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al buscar citas por paciente:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getAppointmentByDoctor: async (idUser) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/doctor/${idUser}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, appointment: data.appointment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al buscar citas por dentista:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getAppointmentByDate: async (date) => {
        set({ isLoading: true, error: null });
        try {
            const authToken = await getAuthCookie();
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/date?date=${date}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}`);
            }

            if (!data.success) {
                throw new Error(data.message || "Error al obtener citas");
            }

            return {
                success: true,
                appointments: data.appointments || [],
                message: data.message
            };
        } catch (error) {
            console.error("Error al buscar citas:", error);
            set({ error: error.message });
            return {
                success: false,
                error: error.message,
                isNetworkError: error.message.includes('Failed to fetch')
            };
        } finally {
            set({ isLoading: false });
        }
    },
    getAppointmentByDateRange: async (startDate, endDate) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/range`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, appointment: data.appointment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al buscar citas por rango de fechas:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    completeAppointment: async (idAppointment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/complete/${idAppointment}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, appointment: data.appointment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al marcar cita como completada:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    updateAppointment: async (idAppointment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/${idAppointment}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ date, idUser, idPatient, idTreatment }),
            });
            const data = await response.json();
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, appointment: data.appointment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al atualizar cita:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    deleteAppointment: async (idAppointment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/${idAppointment}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                credentials: 'include',
            });
    
            // 1. Verificación explícita para 204
            if (response.status === 204) {
                return { 
                    success: true, 
                    isLoading: false,
                    error: null
                };
            }
    
            // 2. Solo intentar leer respuesta si no es 204
            if (!response.ok) {
                // Manejo de errores con verificación de contenido
                const text = await response.text();
                let errorMessage = 'Error al eliminar cita';
                
                try {
                    const errorData = text ? JSON.parse(text) : {};
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // Si no es JSON válido, usa el texto plano o mensaje por defecto
                    errorMessage = text || errorMessage;
                }
                
                return {
                    success: false,
                    isLoading: false,
                    error: errorMessage
                };
            }
    
            // 3. Para otros códigos de éxito (no 204)
            return {
                success: true,
                isLoading: false,
                error: null
            };
    
        } catch (error) {
            console.error("Error en deleteAppointment:", error);
            return {
                isLoading: false,
                success: false,
                error: error.message || 'Error de conexión'
            };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, clinical: data.clinical };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear historial clinico:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getAllClinicalRecords: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, clinical: data.clinical };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener todos los historiales clinicos:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getClinicalRecordByPk: async (idClinicalRecord) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/${idClinicalRecord}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, clinical: data.clinical };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al buscar historial clinico:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getClinicalRecordByPatientId: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/patient/${idPatient}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, clinical: data.clinical };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener historial clinico del paciente:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
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
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, clinical: data.clinical };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar historial clinico:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    deleteClinicalRecord: async (idClinicalRecord) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/${idClinicalRecord}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, clinical: data.clinical };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar historial clinico:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
}));

export const useInformedConsent = create((set) => ({
    consent: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    addInformedConsent: async (idPatient, file) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType,
            });

            const response = await fetch(`https://truval-dental.ddns.net:8443/informed-consent/${idPatient}`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, clinical: data.clinical };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al añadir documento de consentimiento informado:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },

    getInformedConsent: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/informed-consent/${idPatient}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, clinical: data.clinical };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al buscar historial clinico:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
}))
