import axios from 'axios';

const API = axios.create({
    // Aseguramos que apunte a la URL unificada de Avangard
    baseURL: 'https://avangard-nutrition.onrender.com/api',
    timeout: 50000, // 50 segundos para despertar al servidor de Render
});

// INTERCEPTOR DE PETICIÓN: Pega el token automáticamente
API.interceptors.request.use((config) => {
    try {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser && storedUser !== "undefined") {
            const userData = JSON.parse(storedUser);
            if (userData && userData.token) {
                config.headers.Authorization = `Bearer ${userData.token}`;
            }
        }
    } catch (err) {
        console.error("Error en interceptor de petición:", err);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// INTERCEPTOR DE RESPUESTA: Manejo inteligente de errores
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response, code } = error;

        // 1. SESIÓN EXPIRADA (401 Real)
        if (response && response.status === 401) {
            // Solo limpiamos si no estamos ya en el login para evitar bucles
            if (!window.location.pathname.includes('/login')) {
                console.warn("Acceso denegado: Token inválido o expirado.");
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
            }
        }

        // 2. ERROR DE RED / SERVER DORMIDO (Timeout o Network Error)
        if (!response || code === 'ECONNABORTED') {
            console.error("El servidor de Render está tardando en responder. No cerramos sesión.");
            // No redirigimos, dejamos que el usuario reintente.
        }

        return Promise.reject(error);
    }
);

export default API;