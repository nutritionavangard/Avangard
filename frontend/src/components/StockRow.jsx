import React from 'react';
import { PackagePlus, PackageMinus, History } from 'lucide-react';

const StockRow = ({ item, onUpdate }) => {
  return (
    <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-lg flex flex-col md:flex-row justify-between items-center mb-4">
      <div>
        <h3 className="text-xl font-bold text-white">{item.product.name}</h3>
        <p className="text-gray-500 text-sm">Línea: {item.product.line} | Depósito: {item.warehouse}</p>
      </div>

      <div className="flex items-center gap-12 mt-4 md:mt-0">
        <div className="text-center">
          <span className="block text-4xl font-black text-white">{item.quantity}</span>
          <span className="text-[10px] uppercase text-[#D4AF37] font-bold tracking-widest">Bolsas</span>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => onUpdate(item.product._id, 'Ingreso')}
            className="p-3 bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white transition-all rounded"
          >
            <PackagePlus size={20} />
          </button>
          <button 
            onClick={() => onUpdate(item.product._id, 'Egreso')}
            className="p-3 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white transition-all rounded"
          >
            <PackageMinus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockRow;