import React from 'react';
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

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      
      {/* AnimatePresence permite que las transiciones de salida funcionen */}
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