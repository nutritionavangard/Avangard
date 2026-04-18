import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

// Importaciones con nombres exactos de assets
import imgPremium from '../assets/Avangard Premium.png';
import imgProfessional from '../assets/Avangard Professional.png';

const productos = [
  {
    id: 1,
    name: "Professional Elite",
    line: "Professional",
    price: 85000,
    image: imgProfessional,
    color: "#0055ff",
    desc: "Suplemento de alta densidad energética para caballos en plena temporada de competencia."
  },
  {
    id: 2,
    name: "Premium Gold",
    line: "Premium",
    price: 98000,
    image: imgPremium,
    color: "#D4AF37",
    desc: "Máxima excelencia en nutrición. Formulado para ejemplares de elite con requerimientos superiores."
  }
];

const Catalogo = () => {
  return (
    // Agregué pt-32 para que el título no quede debajo del Navbar fijo
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-l-4 border-[#D4AF37] pl-6"
        >
          <h2 className="text-[#D4AF37] font-bold tracking-[0.4em] uppercase text-xs mb-4">Portfolio de Excelencia</h2>
          <h1 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            Nuestra <br />
            <span className="text-gray-600 italic">Nutrición</span>
          </h1>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {productos.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalogo;