import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parseando usuario:", error);
                localStorage.removeItem('userInfo');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await API.post('/auth/login', { email, password });
            
            // 1. PERSISTENCIA INMEDIATA: 
            // Guardamos en LocalStorage antes que nada para que el Router lo encuentre.
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            // 2. ACTUALIZACIÓN DE ESTADO:
            setUser(data);
            
            // 3. CONFIRMACIÓN:
            return data; 
        } catch (error) {
            console.error("Error en login:", error);
            throw error; 
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        // Redirección limpia al salir
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {/* Solo renderizamos la app cuando loading es false */}
            {!loading && children}
        </AuthContext.Provider>
    );
};