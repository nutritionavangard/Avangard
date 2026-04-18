import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// IMPORTANTE: Verifica que estos nombres coincidan EXACTAMENTE con tus archivos en /assets
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
    desc: "Este alimento balanceado está elaborado con materias primas de primera calidad. Provee niveles de energía balanceados a partir de fibra degradable, almidón y lípidos; y cantidades de proteína de muy alto valor biológico para un adecuado funcionamiento de las masas musculares.",
    recomendacion: "Se recomienda utilizar a un nivel del 0,5 al 1% del peso vivo, repartido en dos comidas después del consumo de heno.",
    nutricion: [
      { label: "Proteína", value: "13 %" },
      { label: "Energía Digestible", value: "2.900 Kcal" },
      { label: "Humedad", value: "10 %" },
      { label: "Calcio", value: "0,70 %" },
      { label: "Fósforo", value: "0,60 %" },
      { label: "Magnesio", value: "0,20 %" },
      { label: "Hierro", value: "80 mg" },
      { label: "Zinc", value: "50 mg" },
      { label: "Vitamina A", value: "7.200 UI" },
      { label: "Vitamina E", value: "285 UI" }
    ],
    aminoacidos: [
      { label: "Lisina", value: "0,71" },
      { label: "Metionina", value: "0,24" },
      { label: "Treonina", value: "0,48" },
      { label: "Arginina", value: "0,94" }
    ],
    ingredientes: "maíz, avena, cebada, pellet de soja, poroto de soja desactivado, afrechillo de trigo, harina de alfalfa, carbonato de calcio, fosfato mono-bicálcico, cloruro de sodio, óxido de magnesio, microminerales, vitaminas, aminoácidos, antioxidantes, levaduras."
  },
  // Repetir estructura para psc, yeguas, potrillos, equitacion, vigor...
};

const DetalleProducto = () => {
  const { id } = useParams();
  
  // Buscamos el producto. Si no existe, usamos "polo" por defecto para evitar pantalla negra.
  const prod = productosData[id] || productosData["polo"];

  // Si aún así algo falla, mostramos un error simple
  if (!prod) {
    return (
      <div className="bg-[#050505] min-h-screen flex items-center justify-center text-white">
        <p>Producto no encontrado.</p>
        <Link to="/catalogo" className="ml-4 text-[#D4AF37]">Volver</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-8 text-white">
      <div className="max-w-6xl mx-auto">
        <Link to="/catalogo" className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-12 inline-block hover:text-white transition-colors">
          ← Volver al Catálogo
        </Link>
        
        <div className="grid md:grid-cols-2 gap-16 items-start mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative flex justify-center">
            <div className="absolute inset-0 blur-[120px] opacity-30" style={{ backgroundColor: prod.color }}></div>
            <img src={prod.img} alt={prod.name} className="relative z-10 w-full max-w-md h-auto drop-shadow-2xl" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-[#D4AF37] font-bold tracking-[0.4em] uppercase text-xs mb-3">{prod.tagline}</h2>
            <h1 className="text-7xl font-black uppercase mb-6 tracking-tighter leading-[0.9]">
              {prod.name.split('. ')[0]}<br/>
              <span className="text-[#D4AF37]">{prod.name.split('. ')[1] || ""}</span>
            </h1>
            <p className="text-gray-400 text-xl leading-relaxed mb-6 font-light">{prod.desc}</p>
            <div className="bg-gray-900/30 border-l-2 border-[#D4AF37] p-4 mb-8">
              <p className="text-[#D4AF37] text-sm italic">{prod.recomendacion}</p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-900 pt-8">
              <span className="text-5xl font-light italic">{prod.price}</span>
              <button className="bg-white text-black px-10 py-5 font-black uppercase text-xs tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all duration-500">
                Consultar Stock
              </button>
            </div>
          </motion.div>
        </div>

        {/* TABLAS TÉCNICAS */}
        <div className="grid md:grid-cols-3 gap-12 border-t border-gray-900 pt-16">
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#D4AF37]"></span> Aportes Nutricionales
            </h3>
            <div className="space-y-3">
              {prod.nutricion?.map((item, i) => (
                <div key={i} className="flex justify-between border-b border-gray-900 pb-2 text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="text-gray-200 font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#D4AF37]"></span> Aminoácidos (%)
            </h3>
            <div className="space-y-3">
              {prod.aminoacidos?.map((item, i) => (
                <div key={i} className="flex justify-between border-b border-gray-900 pb-2 text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="text-gray-200 font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#D4AF37]"></span> Composición
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 uppercase tracking-wider">{prod.ingredientes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;