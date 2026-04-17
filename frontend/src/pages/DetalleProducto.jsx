import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DetalleProducto = () => {
  const { id } = useParams();

  return (
    <div className="bg-[#050505] min-h-screen pt-24 px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/catalogo" className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-8 inline-block hover:underline">
          ← Volver al Catálogo
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.img 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src="/assets/bolsa-detalle.png" 
            className="w-full h-auto drop-shadow-[0_0_30px_rgba(0,85,255,0.3)]"
          />
          <div>
            <h1 className="text-5xl font-black uppercase mb-4 tracking-tighter">Detalle de <span className="text-blue-600">Producto</span></h1>
            <p className="text-gray-400 leading-relaxed mb-6">
              Información técnica detallada sobre la composición nutricional y beneficios específicos para el rendimiento deportivo.
            </p>
            <div className="border-t border-gray-800 pt-6">
              <span className="text-3xl font-mono text-[#D4AF37]">$85.000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;