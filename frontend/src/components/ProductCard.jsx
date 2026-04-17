import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-[#0f0f0f] border border-gray-900 p-8 rounded-2xl group transition-all hover:border-gray-700 relative overflow-hidden"
    >
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
        <img src={product.image} alt={product.name} className="w-48 h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500" />
        
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter mb-4 inline-block" style={{ backgroundColor: product.color + '33', color: product.color }}>
            Línea {product.line}
          </span>
          <h3 className="text-3xl font-black text-white mb-2 uppercase">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">{product.desc}</p>
          <div className="text-[#D4AF37] text-2xl font-mono">${product.price.toLocaleString()}</div>
        </div>
      </div>
      {/* Fondo decorativo sutil */}
      <div className="absolute top-0 right-0 w-32 h-32 blur-[100px] z-0 opacity-20" style={{ backgroundColor: product.color }}></div>
    </motion.div>
  );
};

export default ProductCard;