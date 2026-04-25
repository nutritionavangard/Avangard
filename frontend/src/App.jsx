import React, { useEffect, useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthContext } from './context/AuthContext';

// Componentes
import Navbar from './components/Navbar';
import Layout from './components/Layout';

// Páginas
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Contacto from './pages/Contacto';
import Logistica from './pages/Logistica';
import Login from './pages/Login';
import DetalleProducto from './pages/DetalleProducto';

// --- COMPONENTE DE PROTECCIÓN BLINDADO ---
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // 1. Mientras el Contexto lee el localStorage, no hacemos nada (evita rebotes)
  if (loading) return null; 

  // 2. RED DE SEGURIDAD: 
  // Si 'user' en el estado es null (porque React aún no actualizó), 
  // verificamos si existe físicamente el dato en el disco (localStorage).
  const backupUser = localStorage.getItem('userInfo');

  if (!user && !backupUser) {
    // Solo si AMBOS son nulos, mandamos al login.
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();

  // Sistema de Keep-Alive (Apunta a la URL real de Render)
  useEffect(() => {
    const backendURL = 'https://avangard-nutrition.onrender.com/api/products';
    
    const interval = setInterval(() => {
      fetch(backendURL)
        .then(() => console.log('Ping de actividad enviado al Backend.'))
        .catch(err => console.log('Servidor en reposo o despertando...'));
    }, 600000); // 10 minutos
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* El Navbar queda fijo para evitar parpadeos en la navegación */}
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* Rutas Públicas */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/catalogo" element={<Layout><Catalogo /></Layout>} />
          <Route path="/producto/:id" element={<Layout><DetalleProducto /></Layout>} />
          <Route path="/contacto" element={<Layout><Contacto /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />

          {/* RUTA PROTEGIDA: Solo accesible con sesión activa */}
          <Route 
            path="/logistica" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Logistica />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Catch-all: Si la ruta no existe, vuelve al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;