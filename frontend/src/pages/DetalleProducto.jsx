import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Importación de las nuevas imágenes de la línea Premium
import imgEquitacion from '../assets/Premium BAL Equitacion.png';
import imgPolo from '../assets/Premium BAL POLO.png';
import imgPotrillos from '../assets/Premium BAL Potrillos.png';
import imgPSC from '../assets/Premium BAL PSC.png';
import imgVigor from '../assets/Premium BAL Vigor.png';
import imgYeguas from '../assets/Premium BAL Yeguas.png';

const productosData = {
  "polo": { 
    name: "BAL. POLO", 
    price: "$85.000", 
    img: imgPolo, 
    color: "#D4AF37", 
    tagline: "ENERGÍA EXPLOSIVA",
    desc: "Suplemento de alta densidad energética diseñado específicamente para caballos en plena temporada de competencia de Polo. Maximiza la potencia y acelera la recuperación post-esfuerzo." 
  },
  "psc": { 
    name: "BAL. PSC", 
    price: "$88.000", 
    img: imgPSC, 
    color: "#D4AF37", 
    tagline: "DESARROLLO ÓPTIMO",
    desc: "Formulado para Pura Sangre de Carrera. Proporciona el balance exacto de aminoácidos y minerales para maximizar el potencial genético en la pista." 
  },
  "yeguas": { 
    name: "BAL. YEGUAS", 
    price: "$92.000", 
    img: imgYeguas, 
    color: "#D4AF37", 
    tagline: "CUIDADO INTEGRAL",
    desc: "Nutrición superior para yeguas reproductoras. Asegura una gestación saludable y una lactancia óptima para el correcto desarrollo del futuro campeón." 
  },
  "potrillos": { 
    name: "BAL. POTRILLOS", 
    price: "$95.000", 
    img: imgPotrillos, 
    color: "#D4AF37", 
    tagline: "CRECIMIENTO VIGOROSO",
    desc: "Especialmente diseñado para potrillos en crecimiento. Refuerza la estructura ósea y el desarrollo muscular armónico evitando desbalances nutricionales." 
  },
  "equitacion": { 
    name: "BAL. EQUITACIÓN", 
    price: "$87.000", 
    img: imgEquitacion, 
    color: "#D4AF37", 
    tagline: "RENDIMIENTO ELEGANCIA",
    desc: "Ideal para caballos de Salto y Adiestramiento. Brinda la energía necesaria manteniendo la templanza y el foco requeridos en las pistas de equitación." 
  },
  "vigor": { 
    name: "CONC. PROT. VIGOR", 
    price: "$105.000", 
    img: imgVigor, 
    color: "#D4AF37", 
    tagline: "MÁXIMA POTENCIA",
    desc: "Concentrado proteico de altísima pureza. Vigor equino formulado para potenciar la masa muscular y el brillo de salud en ejemplares de elite y exposición." 
  }
};

const DetalleProducto = () => {
  const { id } = useParams();
  const prod = productosData[id] || productosData["polo"]; // Fallback a Polo si no encuentra ID

  return (
    <div className="bg-[#050505] min-h-screen pt-32 px-8 text-white">
      <div className="max-w-6xl mx-auto">
        <Link to="/catalogo" className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-12 inline-block hover:text-white transition-colors">
          ← Volver al Catálogo
        </Link>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group flex justify-center"
          >
            {/* Brillo de fondo dinámico (Aura Dorada) */}
            <div 
              className="absolute inset-0 blur-[120px] opacity-30"
              style={{ backgroundColor: prod.color }}
            ></div>
            <img 
              src={prod.img} 
              alt={prod.name}
              className="relative z-10 w-full max-w-md h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-[#D4AF37] font-bold tracking-[0.4em] uppercase text-xs mb-3">
              {prod.tagline}
            </h2>
            <h1 className="text-7xl font-black uppercase mb-6 tracking-tighter leading-[0.9]">
              {prod.name.split('. ')[0]}<br/>
              <span className="text-[#D4AF37]">{prod.name.split('. ')[1] || ""}</span>
            </h1>
            
            <div className="inline-block px-3 py-1 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase mb-8">
              Premium Elite Line
            </div>

            <p className="text-gray-400 text-xl leading-relaxed mb-10 font-light">
              {prod.desc}
            </p>

            <div className="border-t border-gray-900 pt-10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Precio Sugerido</span>
                <span className="text-5xl font-light text-white italic">{prod.price}</span>
              </div>
              <button className="bg-white text-black px-10 py-5 font-black uppercase text-xs tracking-[0.2em] hover:bg-[#D4AF37] hover:text-white transition-all duration-500">
                Consultar Stock
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;