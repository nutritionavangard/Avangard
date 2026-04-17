import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const productos = [
  {
    id: 1,
    name: "Professional Elite",
    line: "Professional",
    price: 85000,
    image: "/assets/bolsa-azul.png",
    color: "#0055ff",
    desc: "Suplemento de alta densidad energética para caballos en plena temporada de competencia."
  },
  {
    id: 2,
    name: "Performance Elite",
    line: "Performance",
    price: 72000,
    image: "/assets/bolsa-verde.png", // Asegurate de tener esta imagen
    color: "#39FF14",
    desc: "Equilibrio nutricional óptimo para entrenamiento y mantenimiento de condición corporal."
  }
];

const Catalogo = () => {
  return (
    <div className="bg-[#050505] min-h-screen pt-12 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h2 className="text-[#D4AF37] font-bold tracking-widest uppercase text-sm mb-2">Portfolio</h2>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Nuestros <span className="text-gray-500">Productos</span></h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {productos.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalogo;