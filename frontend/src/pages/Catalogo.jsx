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

  const imageMap = {
    "polo": imgPolo,
    "psc": imgPSC,
    "yeguas": imgYeguas,
    "potrillos": imgPotrillos,
    "equitacion": imgEquitacion,
    "vigor": imgVigor,
    "mantenimiento": imgMantenimiento,
    "deporte": imgDeporte
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Usamos la URL completa para asegurar conexión si el proxy falla
        const response = await fetch('http://localhost:5000/api/products');
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("El servidor no devolvió JSON. Revisa el Backend.");
        }

        const data = await response.json();
        
        const productosConImagen = data.map(p => {
          const nameLower = (p.name || "").toLowerCase();
          const key = Object.keys(imageMap).find(k => nameLower.includes(k)) || "polo";

          return {
            ...p,
            displayImage: imageMap[key],
            color: (p.line || "").toLowerCase() === 'premium' ? "#D4AF37" : "#2563eb"
          };
        });

        setProductos(productosConImagen);
        setLoading(false);
      } catch (error) {
        console.error("Error detallado:", error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const botones = [
    { id: 'PREMIUM', label: 'Línea Premium', color: '#D4AF37' },
    { id: 'PROFESSIONAL', label: 'Línea Professional', color: '#2563eb' }
  ];

  const productosFiltrados = productos.filter(p => 
    p.line && p.line.toUpperCase() === lineaActiva
  );

  if (loading) return <div className="bg-[#050505] min-h-screen pt-40 text-center font-black uppercase text-[#D4AF37]">Cargando Catálogo...</div>;

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        
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
                    product={{
                      ...producto,
                      image: producto.displayImage
                    }} 
                  />
                ))
              ) : (
                <div className="py-20 text-center col-span-2 border border-dashed border-gray-900 rounded-3xl">
                  <p className="text-gray-600 font-black uppercase italic tracking-widest">
                    No hay productos disponibles en la línea {lineaActiva.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Catalogo;