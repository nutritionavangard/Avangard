import axios from 'axios';

const API = axios.create({
    // CAMBIO CRÍTICO: Usamos la URL donde el diagnóstico confirmó que están los datos
    baseURL: 'https://avangard-mdpp.onrender.com/api',
    timeout: 50000, // 50 segundos para que Render "despierte"
});

// INTERCEPTOR DE PETICIÓN: Pega el token automáticamente
API.interceptors.request.use((config) => {
    try {
        const storedUser = localStorage.getItem('userInfo');
        
        // Verificamos que exista y que no sea un string "undefined" accidental
        if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
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

// INTERCEPTOR DE RESPUESTA: Manejo de errores de conexión y sesión
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response, code } = error;

        // 1. SESIÓN EXPIRADA O TOKEN INVÁLIDO (401)
        if (response && response.status === 401) {
            // Solo redirigir si no estamos ya en el login
            if (!window.location.pathname.includes('/login')) {
                console.warn("Sesión expirada. Limpiando datos y redirigiendo...");
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
            }
        }

        // 2. ERROR DE RED / SERVER DORMIDO (Timeout o Network Error)
        if (!response || code === 'ECONNABORTED') {
            console.error("El servidor de Render (mdpp) no responde. Reintenta en unos segundos.");
            // No redirigimos al login aquí para que el usuario no pierda lo que escribió
        }

        return Promise.reject(error);
    }
);

export default API;