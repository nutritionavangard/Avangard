import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-[#0f0f0f] border border-gray-900 p-8 rounded-2xl group transition-all hover:border-gray-800 relative overflow-hidden h-full"
    >
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center h-full">
        {/* Contenedor de Imagen con Sombra Dinámica */}
        <div className="relative flex-shrink-0">
          <div 
            className="absolute inset-0 blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-500"
            style={{ backgroundColor: product.color }}
          ></div>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-48 h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-700 relative z-10" 
          />
        </div>
        
        <div className="flex-1 flex flex-col h-full">
          <div className="mb-auto">
            <span 
              className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-4 inline-block border" 
              style={{ 
                backgroundColor: product.color + '15', 
                color: product.color,
                borderColor: product.color + '40'
              }}
            >
              Línea {product.line}
            </span>
            <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter leading-none">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-sm line-clamp-3">{product.desc}</p>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="text-[#D4AF37] text-2xl font-light font-sans tracking-tight">
              ${product.price.toLocaleString()}
            </div>
            
            <Link 
              to={`/producto/${product.id}`}
              className="text-white text-[10px] font-bold uppercase tracking-widest border-b border-gray-700 pb-1 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
            >
              Ver Detalle
            </Link>
          </div>
        </div>
      </div>

      {/* Glow decorativo de esquina */}
      <div 
        className="absolute -top-10 -right-10 w-40 h-40 blur-[100px] z-0 opacity-10 group-hover:opacity-20 transition-opacity" 
        style={{ backgroundColor: product.color }}
      ></div>
    </motion.div>
  );
};

export default ProductCard;