import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Importación de la nueva foto de portada
import imgPortada from '../assets/Foto portada.png'; 

const Home = () => {
  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden">
      {/* SECCIÓN HERO / BANNER */}
      <div className="relative h-[90vh] flex items-center">
        
        {/* IMAGEN DE PORTADA */}
        <div className="absolute right-0 top-0 w-full h-full md:w-2/3 z-0">
          <img 
            src={imgPortada} 
            alt="Avangard Equine Portada" 
            className="w-full h-full object-cover object-center opacity-60 md:opacity-90"
            style={{ 
              maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)' 
            }}
          />
        </div>

        {/* TEXTO PRINCIPAL */}
        <div className="container mx-auto px-8 z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base">
              Elite Nutrition for Champions
            </h2>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-8 uppercase tracking-tighter">
              AVANGARD <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                EQUINE
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
              Elevando el estándar del rendimiento deportivo. Nutrición técnica diseñada específicamente para la exigencia del Polo de alta competencia.
            </p>
            
            <div className="flex gap-4">
              <Link to="/catalogo" className="bg-white text-black px-8 py-4 font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-[#D4AF37] hover:text-white transition-all group">
                Ver Catálogo <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;