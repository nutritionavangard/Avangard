import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo'); // Unificamos nombre a 'userInfo'
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
            
            // Según tu backend, 'data' ya trae _id, name, email y token
            // Lo guardamos todo junto para que sea fácil de recuperar
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            return data; // Retornamos para que el componente de Login pueda redireccionar
        } catch (error) {
            console.error("Error en login:", error);
            throw error; // Re-lanzamos para que el UI muestre el error
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        // Evitamos usar clear() para no borrar otros datos locales (como logs)
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};