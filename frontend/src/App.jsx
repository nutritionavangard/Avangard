import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

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

function App() {
  const location = useLocation();

  // Sistema de Keep-Alive para evitar que Render se duerma (Plan Free)
  // IMPORTANTE: Apuntamos al backend para que la base de datos esté siempre lista
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/api/products') // Cambia a tu URL de Render cuando hagas deploy
        .then(() => console.log('Ping de actividad enviado al Backend.'))
        .catch(err => console.log('Error en ping:', err));
    }, 600000); // 10 minutos
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* El Navbar queda fijo fuera de las rutas para consistencia */}
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={
              <Layout>
                <Home />
              </Layout>
            } 
          />
          <Route 
            path="/catalogo" 
            element={
              <Layout>
                <Catalogo />
              </Layout>
            } 
          />
          {/* Ruta dinámica para ver el detalle de cada producto */}
          <Route 
            path="/producto/:id" 
            element={
              <Layout>
                <DetalleProducto />
              </Layout>
            } 
          />
          <Route 
            path="/contacto" 
            element={
              <Layout>
                <Contacto />
              </Layout>
            } 
          />
          {/* Panel de administración de stock y precios */}
          <Route 
            path="/logistica" 
            element={
              <Layout>
                <Logistica />
              </Layout>
            } 
          />
          <Route 
            path="/login" 
            element={
              <Layout>
                <Login />
              </Layout>
            } 
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;