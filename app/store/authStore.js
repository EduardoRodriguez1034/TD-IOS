import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

<<<<<<< Updated upstream
    signup: async (email, password, username) => {
        set({ isLoading: true, error: null });
        try {
            // Simulate a signup process
            const response = await fetch(`https://54.176.10.118:8443/api/signup`, {
=======
    signup: async (username, email, password) => {
        set({ isLoading: true, error: null });

        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/signup`, {
>>>>>>> Stashed changes
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
<<<<<<< Updated upstream
                body: JSON.stringify({ email, password, username }),
            })
            const data = await response.json();
        } catch (error) {
            console.log(error);
        }
    },
    
=======
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

>>>>>>> Stashed changes
    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/verify-email`, {
<<<<<<< Updated upstream
                method: 'POST', 
=======
                method: 'POST',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ code }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al verificar correo:", error);
            throw error;
=======

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
>>>>>>> Stashed changes
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/forgot-password`, {
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/reset-password/${token}`, {
<<<<<<< Updated upstream
                method: 'POST', 
=======
                method: 'POST',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al cambiar contraseña:", error);
            throw error;
=======

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
>>>>>>> Stashed changes
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/login`, {
<<<<<<< Updated upstream
                method: 'POST', 
=======
                method: 'POST',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error en login:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/logout`, {
<<<<<<< Updated upstream
                method: 'POST', 
=======
                method: 'POST',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al cerrar sesión:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },

    updateUser: async (idUser, username, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/user/${idUser}`, {
<<<<<<< Updated upstream
                method: 'PUT', 
=======
                method: 'PUT',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar usuario:", error);
            throw error;
=======

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
>>>>>>> Stashed changes
        }
    },

    deleteUser: async (idUser) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/user/${idUser}`, {
<<<<<<< Updated upstream
                method: 'DELETE', 
=======
                method: 'DELETE',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, user: data.user });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar usuario:", error);
            throw error;
=======

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
>>>>>>> Stashed changes
        }
    },
}));

export const usePatient = create((set) => ({
<<<<<<< Updated upstream
    patient: null, 
=======
    patient: null,
>>>>>>> Stashed changes
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createPatient: async (name, lastName, surName, sex, phone, birthDate) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient`, {
<<<<<<< Updated upstream
                method: 'POST', 
=======
                method: 'POST',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, lastName, surName, sex, phone, birthDate }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, patient: data.patient });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear paciente:", error);
            throw error;
=======

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
>>>>>>> Stashed changes
        }
    },
    getAllPatient: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient`, {
<<<<<<< Updated upstream
                method: 'GET', 
=======
                method: 'GET',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, patient: data.patient });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener los pacientes:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    getAPatient: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient/${idPatient}`, {
<<<<<<< Updated upstream
                method: 'GET', 
=======
                method: 'GET',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, patient: data.patient });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener el paciente:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    updatePatient: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient/${idPatient}`, {
<<<<<<< Updated upstream
                method: 'PUT', 
=======
                method: 'PUT',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, lastName, surName, sex, phone, birthDate }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, patient: data.patient });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar el paciente:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    deletePatient: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/patient/${idPatient}`, {
<<<<<<< Updated upstream
                method: 'DELETE', 
=======
                method: 'DELETE',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, patient: data.patient });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar el paciente:", error);
            throw error;
=======
            if (!response.ok) {
                set({ error: data.message });
                return { isLoading: false, success: false, error: data.message };
            }

            return { success: true, isLoading: false, isAuthenticated: true, patient: data.patient };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar paciente:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
>>>>>>> Stashed changes
        }
    },
}));

export const useTreatment = create((set) => ({
<<<<<<< Updated upstream
    treatment: null, 
=======
    treatment: null,
>>>>>>> Stashed changes
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createTreatment: async (treatmentType, description, price) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment`, {
<<<<<<< Updated upstream
                method: 'POST', 
=======
                method: 'POST',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentType, description, price }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, treatment: data.treatment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear tratamiento:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    getAllTreatments: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment`, {
<<<<<<< Updated upstream
                method: 'GET', 
=======
                method: 'GET',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentType, description, price }),
            });
            const data = await response.json();
<<<<<<< Updated upstream
            console.log("Response data:", data);
            set({ isLoading: false, isAuthenticated: true, treatment: data.treatment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener los tratamientos:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    getATreatment: async (idTreatment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment/${idTreatment}`, {
<<<<<<< Updated upstream
                method: 'GET', 
=======
                method: 'GET',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentType, description, price }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, treatment: data.treatment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener el tratamiento:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    updateTreatment: async (idTreatment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment/${idTreatment}`, {
<<<<<<< Updated upstream
                method: 'PUT', 
=======
                method: 'PUT',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentType, description, price }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, treatment: data.treatment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar el tratamiento:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    deleteTreatment: async (idTreatment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/treatment/${idTreatment}`, {
<<<<<<< Updated upstream
                method: 'DELETE', 
=======
                method: 'DELETE',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idTreatment }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, treatment: data.treatment });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar el tratamiento:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
}));

export const useNote = create((set) => ({
<<<<<<< Updated upstream
    note: null, 
=======
    note: null,
>>>>>>> Stashed changes
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createNote: async (title, description, idNoteType, idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note`, {
<<<<<<< Updated upstream
                method: 'POST', 
=======
                method: 'POST',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, description, idNoteType, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, note: data.note });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear la nota:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    getAllNotes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note`, {
<<<<<<< Updated upstream
                method: 'GET', 
=======
                method: 'GET',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, note: data.note });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener las notas:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    getANote: async (idNote) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note/${idNote}`, {
<<<<<<< Updated upstream
                method: 'GET', 
=======
                method: 'GET',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, description, idNoteType, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, note: data.note });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener la nota:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    updateNote: async (idNote) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note/${idNote}`, {
<<<<<<< Updated upstream
                method: 'PUT', 
=======
                method: 'PUT',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, description, idNoteType, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, note: data.note });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar la nota:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    deleteNote: async (idNote) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note/${idNote}`, {
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
        }
    },
}));

export const useNoteType = create((set) => ({
<<<<<<< Updated upstream
    noteType: null, 
=======
    noteType: null,
>>>>>>> Stashed changes
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createNoteType: async (noteType, description) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note-type`, {
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
        }
    },
    getAllNoteTypes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note-type`, {
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
        }
    },
    getANoteType: async (idNoteType) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note-type/${idNoteType}`, {
<<<<<<< Updated upstream
                method: 'GET', 
=======
                method: 'GET',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ noteType, description }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, noteType: data.noteType });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener el tipo de nota:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    updateNoteType: async (idNoteType) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note-type/${idNoteType}`, {
<<<<<<< Updated upstream
                method: 'PUT', 
=======
                method: 'PUT',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ noteType, description }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, noteType: data.noteType });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar la nota:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    deleteNoteType: async (idNoteType) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/note-type/${idNoteType}`, {
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
        }
    },
}));

export const useAppointment = create((set) => ({
<<<<<<< Updated upstream
    appointment: null, 
=======
    appointment: null,
>>>>>>> Stashed changes
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createAppointment: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments`, {
<<<<<<< Updated upstream
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
=======
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ appointmentDate, appointmentHour, idUser, idPatient, idTreatment }),
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
>>>>>>> Stashed changes
        }
    },
    getAllAppointments: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments`, {
<<<<<<< Updated upstream
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
=======
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ appointmentDate, appointmentHour, idUser, idPatient, idTreatment }),
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
            console.error("Error al obtener todas las citas:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
>>>>>>> Stashed changes
        }
    },
    getAnAppointment: async (idAppointment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/${idAppointment}`, {
<<<<<<< Updated upstream
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
=======
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ appointmentDate, appointmentHour, idUser, idPatient, idTreatment }),
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
    getAppointmentByPatient: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/patient/${idPatient}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ appointmentDate, appointmentHour, idUser, idPatient, idTreatment }),
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
                body: JSON.stringify({ appointmentDate, appointmentHour, idUser, idPatient, idTreatment }),
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
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/date`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ appointmentDate, appointmentHour, idUser, idPatient, idTreatment }),
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
            console.error("Error al buscar citas por fecha:", error);
            return { isLoading: false, success: false, error: error.message };
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
                body: JSON.stringify({ startDate, endDate, appointmentDate, appointmentHour, idUser, idPatient, idTreatment }),
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
                body: JSON.stringify({ appointmentDate, appointmentHour, idUser, idPatient, idTreatment }),
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
>>>>>>> Stashed changes
        }
    },
    updateAppointment: async (idAppointment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/${idAppointment}`, {
<<<<<<< Updated upstream
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
=======
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ appointmentDate, appointmentHour, idUser, idPatient, idTreatment }),
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
>>>>>>> Stashed changes
        }
    },
    deleteAppointment: async (idAppointment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/appointments/${idAppointment}`, {
<<<<<<< Updated upstream
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
=======
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

            return { success: true, isLoading: false, isAuthenticated: true, appointment: data.appointment };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al eliminar cita:", error);
            return { isLoading: false, success: false, error: error.message };
        } finally {
            set({ isLoading: false });
>>>>>>> Stashed changes
        }
    },
}));

export const useClinicalRecord = create((set) => ({
<<<<<<< Updated upstream
    clinical: null, 
=======
    clinical: null,
>>>>>>> Stashed changes
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    createClinicalRecord: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record`, {
<<<<<<< Updated upstream
                method: 'POST', 
=======
                method: 'POST',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentsDone, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, clinical: data.clinical });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al crear el expediente clinico:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    getAllClinicalRecords: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/`, {
<<<<<<< Updated upstream
                method: 'GET', 
=======
                method: 'GET',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentsDone, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, clinical: data.clinical });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener los expedientes clinicos:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    getClinicalRecordByPk: async (idClinicalRecord) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/${idClinicalRecord}`, {
<<<<<<< Updated upstream
                method: 'GET', 
=======
                method: 'GET',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentsDone, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, clinical: data.clinical });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al obtener el expediente clinico:", error);
            throw error;
        }
    },    
=======
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
>>>>>>> Stashed changes
    getClinicalRecordByPatientId: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/patient/${idPatient}`, {
<<<<<<< Updated upstream
                method: 'GET', 
=======
                method: 'GET',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentsDone, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
        }
    },
    updateClinicalRecord: async (idClinicalRecord) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/${idClinicalRecord}`, {
<<<<<<< Updated upstream
                method: 'PUT', 
=======
                method: 'PUT',
>>>>>>> Stashed changes
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ treatmentsDone, idPatient }),
            });
            const data = await response.json();
            console.log("Response data:", data);
<<<<<<< Updated upstream
            set({ isLoading: false, isAuthenticated: true, clinical: data.clinical });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error("Error al actualizar el expediente clinico:", error);
            throw error;
=======
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
>>>>>>> Stashed changes
        }
    },
    deleteClinicalRecord: async (idClinicalRecord) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/clinical-record/${idClinicalRecord}`, {
<<<<<<< Updated upstream
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
=======
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

    addInformedConcent: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/informed-consent/${idPatient}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({file }),
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

    getInformedConcent: async (idPatient) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`https://truval-dental.ddns.net:8443/informed-consent/${idPatient}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ file }),
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
>>>>>>> Stashed changes
