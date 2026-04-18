import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Importamos las mismas imágenes para que el detalle sea real
import imgPremium from '../assets/Avangard Premium.png';
import imgProfessional from '../assets/Avangard Professional.png';

const productosData = {
  "1": { name: "Professional Elite", price: "$85.000", img: imgProfessional, color: "#0055ff", desc: "Suplemento de alta densidad energética para caballos en plena temporada de competencia de Polo." },
  "2": { name: "Premium Gold", price: "$98.000", img: imgPremium, color: "#D4AF37", desc: "Máxima excelencia en nutrición. Formulado para ejemplares de elite con requerimientos superiores." }
};

const DetalleProducto = () => {
  const { id } = useParams();
  const prod = productosData[id] || productosData["1"]; // Fallback al 1 si no encuentra

  return (
    <div className="bg-[#050505] min-h-screen pt-32 px-8 text-white">
      <div className="max-w-5xl mx-auto">
        <Link to="/catalogo" className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-12 inline-block hover:text-white transition-colors">
          ← Volver al Catálogo
        </Link>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            {/* Brillo de fondo dinámico según el color del producto */}
            <div 
              className="absolute inset-0 blur-[100px] opacity-20"
              style={{ backgroundColor: prod.color }}
            ></div>
            <img 
              src={prod.img} 
              alt={prod.name}
              className="relative z-10 w-full h-auto drop-shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase text-xs mb-2">Línea {prod.name.split(' ')[0]}</h2>
            <h1 className="text-6xl font-black uppercase mb-6 tracking-tighter leading-none">
              {prod.name.split(' ')[0]} <br/>
              <span style={{ color: prod.color }}>{prod.name.split(' ')[1]}</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              {prod.desc}
            </p>
            <div className="border-t border-gray-800 pt-8 flex items-center justify-between">
              <span className="text-4xl font-light text-white">{prod.price}</span>
              <button className="bg-white text-black px-8 py-4 font-bold uppercase text-sm tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all">
                Consultar
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;