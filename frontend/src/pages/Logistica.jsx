import React, { useState } from 'react';
import { PackagePlus, PackageMinus, History } from 'lucide-react';

const Logistica = () => {
  // Mock data inicial (luego vendrá de la API)
  const [stock, setStock] = useState([
    { id: 1, name: 'Professional Elite (Azul)', qty: 120, line: 'Blue' },
    { id: 2, name: 'Performance Elite (Verde)', qty: 85, line: 'Green' }
  ]);

  return (
    <div className="bg-[#050505] min-h-screen p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-8 border-b border-gray-800 pb-4 uppercase tracking-tighter">
          Gestión de <span className="text-[#D4AF37]">Stock</span>
        </h1>

        <div className="grid gap-6">
          {stock.map((item) => (
            <div key={item.id} className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-lg flex flex-col md:flex-row justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-gray-500 text-sm">Bolsas de 25kg | Depósito San Miguel</p>
              </div>

              <div className="flex items-center gap-12 mt-4 md:mt-0">
                <div className="text-center">
                  <span className="block text-4xl font-black text-white">{item.qty}</span>
                  <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Disponibles</span>
                </div>

                <div className="flex gap-2">
                  <button className="p-3 bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white transition-all rounded">
                    <PackagePlus size={20} />
                  </button>
                  <button className="p-3 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white transition-all rounded">
                    <PackageMinus size={20} />
                  </button>
                  <button className="p-3 bg-gray-800 text-gray-400 hover:bg-white hover:text-black transition-all rounded">
                    <History size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logistica;