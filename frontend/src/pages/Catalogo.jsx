import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

// Importación de las nuevas imágenes Premium
import imgEquitacion from '../assets/Premium BAL Equitacion.png';
import imgPolo from '../assets/Premium BAL POLO.png';
import imgPotrillos from '../assets/Premium BAL Potrillos.png';
import imgPSC from '../assets/Premium BAL PSC.png';
import imgVigor from '../assets/Premium BAL Vigor.png';
import imgYeguas from '../assets/Premium BAL Yeguas.png';

const productosPremium = [
  { id: "polo", name: "Bal. Polo", line: "PREMIUM ELITE", price: 85000, image: imgPolo, color: "#D4AF37", desc: "Energía explosiva y recuperación rápida. Diseñado para la alta exigencia del Polo profesional." },
  { id: "psc", name: "Bal. PSC", line: "PREMIUM ELITE", price: 88000, image: imgPSC, color: "#D4AF37", desc: "Desarrollo óptimo para Pura Sangre de Carrera. Maximiza el potencial genético y atlético." },
  { id: "yeguas", name: "Bal. Yeguas", line: "PREMIUM ELITE", price: 92000, image: imgYeguas, color: "#D4AF37", desc: "Cuidado integral para yeguas reproductoras. Nutrición superior para la madre y el futuro potrillo." },
  { id: "potrillos", name: "Bal. Potrillos", line: "PREMIUM ELITE", price: 95000, image: imgPotrillos, color: "#D4AF37", desc: "Crecimiento vigoroso y armónico. Refuerza la estructura ósea y muscular en etapas críticas." },
  { id: "equitacion", name: "Bal. Equitación", line: "PREMIUM ELITE", price: 87000, image: imgEquitacion, color: "#D4AF37", desc: "Rendimiento y elegancia. Concentración y templanza para caballos de salto y adiestramiento." },
  { id: "vigor", name: "Conc. Prot. Vigor", line: "PREMIUM ELITE", price: 105000, image: imgVigor, color: "#D4AF37", desc: "Concentrado proteico de máxima pureza. Vigor equino para ejemplares de exposición y elite." }
];

const Catalogo = () => {
  const [lineaActiva, setLineaActiva] = useState('PREMIUM');

  const botones = [
    { id: 'PREMIUM', label: 'Línea Premium', color: '#D4AF37' },
    { id: 'PERFORMANCE', label: 'Línea Performance', color: '#22c55e' }, // Verde
    { id: 'PROFESSIONAL', label: 'Línea Professional', color: '#2563eb' } // Azul
  ];

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* NAVEGACIÓN DE LÍNEAS (LOS TRES BOTONES) */}
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
          {lineaActiva === 'PREMIUM' ? (
            <motion.div 
              key="premium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-12">
                <h2 className="text-[#D4AF37] font-bold tracking-[0.4em] uppercase text-xs mb-4">Nutrición de Campeones</h2>
                <h1 className="text-7xl font-black text-white uppercase tracking-tighter">
                  Línea <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#f3e3ad]">Premium Elite</span>
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {productosPremium.map((producto, index) => (
                  <ProductCard key={producto.id} product={producto} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="proximamente"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-40 text-center border-2 border-dashed border-gray-900 rounded-3xl"
            >
              <h3 className="text-4xl font-black text-gray-800 uppercase italic">
                {lineaActiva} <br />
                <span className="text-lg font-light tracking-[0.5em]">Próximamente disponible</span>
              </h3>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Catalogo;