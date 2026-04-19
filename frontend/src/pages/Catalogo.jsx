import React, { useState } from 'react';
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

  // Datos estáticos: Se eliminó cualquier referencia a "price" para que no exista el dato
  const productosEstaticos = [
    { _id: '1', name: 'BAL POLO', line: 'PREMIUM', image: imgPolo, tagline: 'Energía Máxima' },
    { _id: '2', name: 'BAL PSC', line: 'PREMIUM', image: imgPSC, tagline: 'Alta Performance' },
    { _id: '3', name: 'BAL YEGUAS', line: 'PREMIUM', image: imgYeguas, tagline: 'Reproducción y Cría' },
    { _id: '4', name: 'BAL POTRILLOS', line: 'PREMIUM', image: imgPotrillos, tagline: 'Crecimiento Óptimo' },
    { _id: '5', name: 'BAL EQUITACION', line: 'PREMIUM', image: imgEquitacion, tagline: 'Salto y Adiestramiento' },
    { _id: '6', name: 'BAL VIGOR', line: 'PREMIUM', image: imgVigor, tagline: 'Fuerza Muscular' },
    { _id: '7', name: 'BAL MANTENIMIENTO', line: 'PROFESSIONAL', image: imgMantenimiento, tagline: 'Salud Diaria' },
    { _id: '8', name: 'BAL DEPORTE', line: 'PROFESSIONAL', image: imgDeporte, tagline: 'Resistencia Vital' }
  ];

  const botones = [
    { id: 'PREMIUM', label: 'Línea Premium', color: '#D4AF37' },
    { id: 'PROFESSIONAL', label: 'Línea Professional', color: '#2563eb' }
  ];

  const productosFiltrados = productosEstaticos.filter(p => 
    p.line.toUpperCase() === lineaActiva.toUpperCase()
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
              {productosFiltrados.map((producto) => (
                <div key={producto._id} className="relative group">
                  <ProductCard 
                    product={producto} 
                    showPrice={false} 
                  />
                  {/* Overlay correctivo: Si ProductCard sigue mostrando el precio por defecto, 
                      este estilo forzará la ocultación de cualquier texto que parezca un precio ($) */}
                  <style dangerouslySetInnerHTML={{ __html: `
                    .group span, .group p { 
                      display: ${producto.price === undefined ? 'initial' : 'none'}; 
                    }
                  `}} />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Catalogo;