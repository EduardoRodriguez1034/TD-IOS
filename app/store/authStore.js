import { create } from 'zustand';

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

    checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/check-auth`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();

            if (!data.user) {
                set({ isLoading: false, isCheckingAuth: false, isAuthenticated: false });
                return { success: true, isLoading: false, isCheckingAuth: false, isAuthenticated: true };

            } else {
                set({ isLoading: false, isCheckingAuth: false, isAuthenticated: true, user: data.user });
                return { success: true, isLoading: false, isCheckingAuth: false, isAuthenticated: true, user: data.user };
            }

        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener usuarios:", error);
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
    getNewPatients: async () => {
        try {
            const response = await fetch('https://truval-dental.ddns.net:8443/patient', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // si estás usando cookies
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener pacientes');
            }

            const now = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);

            const nuevos = data.patient.filter((p) => {
                const created = new Date(p.createdAt);
                return created >= oneMonthAgo;
            });
            return { success: true, count: nuevos.length };
        } catch (error) {
            console.error('Error al obtener pacientes nuevos:', error);
            return { success: false, count: 0 };
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
    updatePatient: async (idPatient, { name, lastName, surName, sex, phone, birthDate }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient/${idPatient}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, lastName, surName, sex, phone, birthDate }),
            });
            const data = await response.json();

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

    createTreatment: async (treatmentType, price, description) => {
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    treatmentType,
                    price,
                    description,
                }),
            });
            const data = await response.json();

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
    updateTreatment: async (idTreatment, { treatmentType, description, price }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment/${idTreatment}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentType, description, price }),
            });
            const data = await response.json();

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
            });
            const data = await response.json();

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
            });
            const data = await response.json();

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
    getNoteByPatientId: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note/patient/${idPatient}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, note: data.note };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al buscar tipo de nota:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    updateNote: async (idNote, { title, description, idNoteType, idPatient }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note/${idNote}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, description, idNoteType, idPatient }),
            });
            const data = await response.json();

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
            });
            const data = await response.json();

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
            });
            const data = await response.json();

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
    getPendingAppointments: async () => {
        try {
            const response = await fetch('https://truval-dental.ddns.net:8443/appointments', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener citas');
            }


            const pendientes = data.appointments.filter((a) => a.isCompleted === false);

            return { success: true, count: pendientes.length };
        } catch (error) {
            console.error('Error al obtener citas pendientes:', error);
            return { success: false, count: 0 };
        }
    },
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
    getUnconfirmedAppointmentsThisWeek: async () => {
        try {
            const today = new Date();
            const dow = today.getDay(); // 0 = dom … 6 = sáb
            const weekDates = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(today);
                d.setDate(today.getDate() - dow + i);
                return d.toISOString().slice(0, 10);
            });

            // 2) Trae TODAS las citas (GET sin body)
            const response = await fetch(
                'https://truval-dental.ddns.net:8443/appointments',
                { credentials: 'include' }
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            const allAppointments = Array.isArray(data.appointments)
                ? data.appointments
                : [];

            // —— 4) Filtrado robusto —— 
            const pendientes = allAppointments.filter(a => {
                const dateOnly = a.date.slice(0, 10);
                const confirmed = Boolean(a.isConfirmed);
                return !confirmed && weekDates.includes(dateOnly);
            });

            return { success: true, count: pendientes.length };
        } catch (error) {
            return { success: false, count: 0 };
        }
    },
    getAppointmentByPatientId: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/patient/${idPatient}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, appointments: data.appointments };
        } catch (error) {
            set({ isLoading: false, error: error.message });
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

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, appointment: data.appointment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
    getAppointmentByDate: async (start, end) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/date?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, appointment: data.appointment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
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
    updateAppointment: async (idAppointment, { date, idTreatment, isConfirmed }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/${idAppointment}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ date, idTreatment, isConfirmed }),
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

            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message, history: [] };
            }

            const hist = Array.isArray(data.history) ? data.history : [];
            return { success: true, isLoading: false, isAuthenticated: true, history: hist };
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

    getInformedConsent: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/informed-consent/${idPatient}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();

            if (!response.ok) {
                set({ error: data.message, isLoading: false });
                return { success: false, error: data.message };
            }

            const { result } = data;
            return {
                success: true,
                consent: {
                    filename: result.filename,
                    idPatient: result.idPatient,
                    url: result.url
                }
            };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al buscar historial clinico:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
}))
