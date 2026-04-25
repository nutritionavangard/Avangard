import React, { useEffect, useContext } from 'react'; // Agregamos useContext
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthContext } from './context/AuthContext'; // Importamos el contexto

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

// --- COMPONENTE DE PROTECCIÓN ---
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // Esperamos a que el sistema lea el localStorage

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();

  // Sistema de Keep-Alive Corregido
  useEffect(() => {
    const backendURL = 'https://avangard-nutrition.onrender.com/api/products';
    
    const interval = setInterval(() => {
      fetch(backendURL)
        .then(() => console.log('Ping de actividad enviado al Backend en Render.'))
        .catch(err => console.log('Error en ping (normal si el server duerme):', err));
    }, 600000); // 10 minutos
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/catalogo" element={<Layout><Catalogo /></Layout>} />
          <Route path="/producto/:id" element={<Layout><DetalleProducto /></Layout>} />
          <Route path="/contacto" element={<Layout><Contacto /></Layout>} />
          
          {/* PANEL DE LOGÍSTICA PROTEGIDO */}
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

          <Route path="/login" element={<Layout><Login /></Layout>} />
          
          {/* Redirección por defecto si alguien escribe cualquier cosa */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;