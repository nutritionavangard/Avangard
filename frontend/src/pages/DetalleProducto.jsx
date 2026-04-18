import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Importación de imágenes con nombres exactos de assets
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
      { label: "Proteína", value: "13 %" }, { label: "Energía Digestible", value: "2.900 Kcal" },
      { label: "Humedad", value: "10 %" }, { label: "Calcio", value: "0,70 %" },
      { label: "Fósforo", value: "0,60 %" }, { label: "Sodio", value: "0,30 %" },
      { label: "Magnesio", value: "0,20 %" }, { label: "Hierro", value: "80 mg" },
      { label: "Vitamina A", value: "7.200 UI" }, { label: "Vitamina E", value: "285 UI" }
    ],
    aminoacidos: [
      { label: "Arginina", value: "0,94" }, { label: "Isoleucina", value: "0,56" },
      { label: "Leucina", value: "1,13" }, { label: "Lisina", value: "0,71" }
    ],
    ingredientes: "maíz, avena, cebada, pellet de soja, poroto de soja desactivado, afrechillo de trigo, harina de alfalfa, carbonato de calcio, fosfato mono-bicálcico, cloruro de sodio, óxido de magnesio, microminerales, vitaminas, aminoácidos, antioxidantes, levaduras, secuestrante de micotoxinas y saborizantes."
  },
  "psc": { 
    name: "BAL. PSC", 
    price: "$88.000", 
    img: imgPSC, 
    color: "#D4AF37", 
    tagline: "MAXIMIZA EL POTENCIAL",
    desc: "Provee niveles de energía balanceados a partir de fibra degradable, almidón y lípidos; y cantidades de proteína de muy alto valor biológico para un adecuado funcionamiento de las masas musculares.",
    recomendacion: "Se recomienda utilizar a un nivel del 0,5% (mantenimiento), del 1 a 1,5% (competición) del peso vivo, repartido en dos o tres comidas después del consumo de heno.",
    nutricion: [
      { label: "Proteína", value: "13 %" }, { label: "Energía Digestible", value: "2.900 Kcal" },
      { label: "Humedad", value: "10 %" }, { label: "Calcio", value: "0,70 %" },
      { label: "Fósforo", value: "0,60 %" }, { label: "Sodio", value: "0,40 %" },
      { label: "Magnesio", value: "0,15 %" }, { label: "Hierro", value: "80 mg" },
      { label: "Vitamina A", value: "7.200 UI" }, { label: "Vitamina E", value: "285 UI" }
    ],
    aminoacidos: [
      { label: "Arginina", value: "0,94" }, { label: "Histidina", value: "0,38" },
      { label: "Isoleucina", value: "0,56" }, { label: "Lisina", value: "0,71" }
    ],
    ingredientes: "maíz, avena, cebada, pellet de soja, poroto de soja desactivado, afrechillo de trigo, harina de alfalfa, carbonato de calcio, fosfato mono-bicálcico, cloruro de sodio, óxido de magnesio, microminerales, vitaminas, lisina, levaduras, secuestrante de micotoxinas y saborizantes."
  },
  "yeguas": { 
    name: "BAL. YEGUAS", 
    price: "$92.000", 
    img: imgYeguas, 
    color: "#D4AF37", 
    tagline: "NUTRICIÓN GESTACIONAL",
    desc: "Aporta niveles de energía, proteínas, minerales, aminoácidos y vitaminas para cubrir los requerimientos de las yeguas durante la gestación y la lactancia.",
    recomendacion: "Se recomienda utilizar a un nivel del 0,5 al 1% del peso vivo, repartido en dos comidas después de la ración de heno.",
    nutricion: [
      { label: "Proteína", value: "14,50 %" }, { label: "Energía Digestible", value: "2.900 Kcal" },
      { label: "Humedad", value: "10 %" }, { label: "Calcio", value: "0,75 %" },
      { label: "Fósforo", value: "0,65 %" }, { label: "Sodio", value: "0,10 %" },
      { label: "Magnesio", value: "0,15 %" }, { label: "Hierro", value: "100 mg" },
      { label: "Vitamina A", value: "3.300 UI" }, { label: "Vitamina E", value: "80 UI" }
    ],
    aminoacidos: [
      { label: "Arginina", value: "1,07" }, { label: "Histidina", value: "0,43" },
      { label: "Leucina", value: "1,24" }, { label: "Lisina", value: "0,76" }
    ],
    ingredientes: "maíz, avena, cebada, pellet de soja, poroto de soja desactivado, afrechillo de trigo, harina de alfalfa, Macro y Microminerales de alta biodisponibilidad, vitaminas, levaduras, secuestrante de micotoxinas, antioxidantes y saborizantes."
  },
  "potrillos": { 
    name: "BAL. POTRILLOS", 
    price: "$95.000", 
    img: imgPotrillos, 
    color: "#D4AF37", 
    tagline: "DESARROLLO ESQUELÉTICO",
    desc: "Provee niveles de energía equilibrados y proteína de muy alto valor biológico, asegurando el desarrollo esquelético y muscular del potrillo para alta competencia.",
    recomendacion: "Se recomienda utilizar a un nivel del 0,5 al 1% del peso vivo, repartido en dos comidas después del suministro de heno.",
    nutricion: [
      { label: "Proteína", value: "17 %" }, { label: "Energía Digestible", value: "2.800 Kcal" },
      { label: "Humedad", value: "10 %" }, { label: "Calcio", value: "0,72 %" },
      { label: "Fósforo", value: "0,63 %" }, { label: "Sodio", value: "0,10 %" },
      { label: "Magnesio", value: "0,15 %" }, { label: "Hierro", value: "120 mg" },
      { label: "Vitamina A", value: "3.500 UI" }, { label: "Vitamina E", value: "80 UI" }
    ],
    aminoacidos: [
      { label: "Arginina", value: "1,19" }, { label: "Histidina", value: "0,47" },
      { label: "Isoleucina", value: "0,71" }, { label: "Lisina", value: "0,95" }
    ],
    ingredientes: "maíz, avena, cebada, pellet de soja, poroto de soja desactivado, afrechillo de trigo, harina de alfalfa, carbonato de calcio, fosfato mono-bicálcico, cloruro de sodio, óxido de magnesio, microminerales, aminoácidos, vitaminas, antioxidantes, secuestrante de micotoxinas, levadura y saborizantes."
  }
};

const DetalleProducto = () => {
  const { id } = useParams();
  const prod = productosData[id] || productosData["polo"];

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