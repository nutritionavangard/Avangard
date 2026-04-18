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
import DetalleProducto from './pages/DetalleProducto'; // <--- IMPORTANTE: Asegurate de que la ruta sea correcta

function App() {
  const location = useLocation();

  // Sistema de Keep-Alive para evitar que Render se duerma (Plan Free)
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/').then(() => console.log('Ping de actividad enviado.'));
    }, 600000); // Se ejecuta cada 10 minutos
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
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
          {/* NUEVA RUTA: Sin esto, al recargar en un producto te dará 404 siempre */}
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