import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

// Importamos las imágenes con los nombres exactos de tu carpeta assets
import imgPremium from '../assets/Avangard Premium.png';
import imgProfessional from '../assets/Avangard Professional.png';

const productos = [
  {
    id: 1,
    name: "Professional Elite",
    line: "Professional",
    price: 85000,
    image: imgProfessional, // Usamos la variable importada
    color: "#0055ff",
    desc: "Suplemento de alta densidad energética para caballos en plena temporada de competencia."
  },
  {
    id: 2,
    name: "Premium Gold",
    line: "Premium",
    price: 98000,
    image: imgPremium, // Usamos la variable importada
    color: "#D4AF37",
    desc: "Máxima excelencia en nutrición. Formulado para ejemplares de elite con requerimientos superiores."
  }
];

const Catalogo = () => {
  return (
    <div className="bg-[#050505] min-h-screen pt-24 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase text-xs mb-4">Portfolio de Excelencia</h2>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            Nuestra <span className="text-gray-600 italic">Nutrición</span>
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