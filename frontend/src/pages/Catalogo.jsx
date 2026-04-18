import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

// Importación de las nuevas imágenes
import imgEquitacion from '../assets/Premium BAL Equitacion.png';
import imgPolo from '../assets/Premium BAL POLO.png';
import imgPotrillos from '../assets/Premium BAL Potrillos.png';
import imgPSC from '../assets/Premium BAL PSC.png';
import imgVigor from '../assets/Premium BAL Vigor.png';
import imgYeguas from '../assets/Premium BAL Yeguas.png';

const productosPremium = [
  {
    id: "polo",
    name: "Bal. Polo",
    line: "PREMIUM ELITE",
    price: 85000,
    image: imgPolo,
    color: "#D4AF37",
    desc: "Energía explosiva y recuperación rápida. Diseñado para la alta exigencia del Polo profesional."
  },
  {
    id: "psc",
    name: "Bal. PSC",
    line: "PREMIUM ELITE",
    price: 88000,
    image: imgPSC,
    color: "#D4AF37",
    desc: "Desarrollo óptimo para Pura Sangre de Carrera. Maximiza el potencial genético y atlético."
  },
  {
    id: "yeguas",
    name: "Bal. Yeguas",
    line: "PREMIUM ELITE",
    price: 92000,
    image: imgYeguas,
    color: "#D4AF37",
    desc: "Cuidado integral para yeguas reproductoras. Nutrición superior para la madre y el futuro potrillo."
  },
  {
    id: "potrillos",
    name: "Bal. Potrillos",
    line: "PREMIUM ELITE",
    price: 95000,
    image: imgPotrillos,
    color: "#D4AF37",
    desc: "Crecimiento vigoroso y armónico. Refuerza la estructura ósea y muscular en etapas críticas."
  },
  {
    id: "equitacion",
    name: "Bal. Equitación",
    line: "PREMIUM ELITE",
    price: 87000,
    image: imgEquitacion,
    color: "#D4AF37",
    desc: "Rendimiento y elegancia. Concentración y templanza para caballos de salto y adiestramiento."
  },
  {
    id: "vigor",
    name: "Conc. Prot. Vigor",
    line: "PREMIUM ELITE",
    price: 105000,
    image: imgVigor,
    color: "#D4AF37",
    desc: "Concentrado proteico de máxima pureza. Vigor equino para ejemplares de exposición y elite."
  }
];

const Catalogo = () => {
  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera del Catálogo */}
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] font-bold tracking-[0.4em] uppercase text-xs mb-4"
          >
            Nutrición de Campeones
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl font-black text-white uppercase tracking-tighter"
          >
            Línea <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#f3e3ad]">Premium Elite</span>
          </motion.h1>
        </div>

        {/* Grilla de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {productosPremium.map((producto, index) => (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={producto} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalogo;