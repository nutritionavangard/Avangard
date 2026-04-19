import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

// Importación de imágenes
import imgEquitacion from '../assets/Premium BAL Equitacion.png';
import imgPolo from '../assets/Premium BAL POLO.png';
import imgPotrillos from '../assets/Premium BAL Potrillos.png';
import imgPSC from '../assets/Premium BAL PSC.png';
import imgVigor from '../assets/Premium BAL Vigor.png';
import imgYeguas from '../assets/Premium BAL Yeguas.png';
import imgMantenimiento from '../assets/Professional BAL Mantenimiento.png';
import imgDeporte from '../assets/Professional BAL Deporte.png';

const Catalogo = () => {
  const [lineaActiva, setLineaActiva] = useState('PREMIUM');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorServer, setErrorServer] = useState(false); // Estado para manejar si el servidor está caído

  const imageMap = {
    'BAL POLO': imgPolo,
    'BAL PSC': imgPSC,
    'BAL YEGUAS': imgYeguas,
    'BAL POTRILLOS': imgPotrillos,
    'BAL EQUITACION': imgEquitacion,
    'BAL VIGOR': imgVigor,
    'BAL MANTENIMIENTO': imgMantenimiento,
    'BAL DEPORTE': imgDeporte
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setErrorServer(false);
      
      // Asegurate de que esta URL sea la correcta según tu entorno (localhost o Render)
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) throw new Error('Error al conectar con el servidor');
      
      const data = await response.json();
      
      const productosProcesados = data.map(p => ({
        ...p,
        image: imageMap[p.name.toUpperCase()] || p.image // Normalizamos a mayúsculas para el match
      }));

      setProductos(productosProcesados);
    } catch (error) {
      console.error("Error en catálogo:", error);
      setErrorServer(true); // Activamos aviso de servidor caído
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const botones = [
    { id: 'PREMIUM', label: 'Línea Premium', color: '#D4AF37' },
    { id: 'PROFESSIONAL', label: 'Línea Professional', color: '#2563eb' }
  ];

  const productosFiltrados = productos.filter(p => 
    p.line && p.line.toUpperCase() === lineaActiva.toUpperCase()
  );

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Selectores de Línea */}
        <div className="flex flex-wrap gap-4 mb-16 justify-center md:justify-start">
          {botones.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setLineaActiva(btn.id)}
              className={`px-8 py-4 border-2 font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 ${
                lineaActiva === btn.id 
                ? 'bg-transparent shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                : 'opacity-40 hover:opacity-100'
              }`}
              style={{ 
                borderColor: lineaActiva === btn.id ? btn.color : '#1a1a1a',
                color: btn.color,
                backgroundColor: '#000000'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white font-bold tracking-widest text-center py-20"
            >
              CARGANDO CATÁLOGO...
            </motion.div>
          ) : errorServer ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 font-bold tracking-widest text-center py-20 border border-red-900/20 bg-red-900/5 rounded-xl"
            >
              ERROR: NO SE PUDO CONECTAR CON EL SERVIDOR.<br/>
              <span className="text-xs text-gray-500 mt-2 block italic">Verifica que el Backend esté encendido en el puerto 5000.</span>
            </motion.div>
          ) : (
            <motion.div 
              key={lineaActiva}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-12">
                <h2 className="font-bold tracking-[0.4em] uppercase text-xs mb-4" style={{ color: lineaActiva === 'PREMIUM' ? '#D4AF37' : '#2563eb' }}>
                  {lineaActiva === 'PREMIUM' ? 'Nutrición de Campeones' : 'Rendimiento Profesional'}
                </h2>
                <h1 className="text-7xl font-black text-white uppercase tracking-tighter">
                  Línea <span className={`text-transparent bg-clip-text bg-gradient-to-r ${lineaActiva === 'PREMIUM' ? 'from-[#D4AF37] to-[#f3e3ad]' : 'from-[#2563eb] to-[#60a5fa]'}`}>
                    {lineaActiva === 'PREMIUM' ? 'Premium Elite' : 'Professional'}
                  </span>
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {productosFiltrados.length > 0 ? (
                  productosFiltrados.map((producto) => (
                    <ProductCard 
                      key={producto._id} 
                      product={producto} 
                    />
                  ))
                ) : (
                  <p className="text-white opacity-50 italic">No hay productos disponibles en esta línea.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Catalogo;