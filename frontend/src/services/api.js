import axios from 'axios';

const API = axios.create({
    // Asegurate de que esta sea la URL actual de tu backend en Render
    baseURL: 'https://avangard-nutrition.onrender.com/api',
    timeout: 50000, // Le damos 50 segundos (Render Free a veces tarda en "despertar")
});

// INTERCEPTOR DE PETICIÓN: Pega el token automáticamente
API.interceptors.request.use((config) => {
    try {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData && userData.token) {
                config.headers.Authorization = `Bearer ${userData.token}`;
            }
        }
    } catch (err) {
        console.error("Error leyendo token del localStorage", err);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// INTERCEPTOR DE RESPUESTA: Evita el cierre de sesión "falso"
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si el servidor responde un 401 real
        if (error.response && error.response.status === 401) {
            // Solo redirigir si no estamos ya logueando
            if (!window.location.pathname.includes('/login')) {
                console.warn("Sesión expirada o token inválido. Redirigiendo...");
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
            }
        }

        // Si es un error de red (Render caído o conexión cerrada)
        if (!error.response || error.code === 'ECONNABORTED') {
            console.error("Error de red o Timeout. No cerramos sesión, es culpa del servidor.");
            // Aquí podrías lanzar un alert suave: 
            // alert("El servidor está tardando. No te desloguees, intenta de nuevo en 10 segundos.");
        }

        return Promise.reject(error);
    }
);

export default API;