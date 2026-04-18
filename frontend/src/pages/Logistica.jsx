import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackagePlus, PackageMinus, History, X, User, ClipboardList, Save, Edit3, DollarSign } from 'lucide-react';

const Logistica = () => {
  // 1. Estado de Stock con Precios incluidos
  const [stock, setStock] = useState([
    { id: 1, name: 'BAL. POLO', qty: 120, line: 'Premium', color: '#D4AF37', price: 25500 },
    { id: 2, name: 'BAL. PSC', qty: 85, line: 'Premium', color: '#D4AF37', price: 28200 },
    { id: 3, name: 'BAL. YEGUAS', qty: 40, line: 'Premium', color: '#D4AF37', price: 21900 },
    { id: 4, name: 'BAL. POTRILLOS', qty: 30, line: 'Premium', color: '#D4AF37', price: 32400 },
    { id: 5, name: 'BAL. MANTENIMIENTO', qty: 200, line: 'Professional', color: '#2563eb', price: 17800 },
    { id: 6, name: 'BAL. DEPORTE', qty: 150, line: 'Professional', color: '#2563eb', price: 20500 },
  ]);

  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('ingreso'); // 'ingreso', 'entrega' o 'precio'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transaction, setTransaction] = useState({ qty: '', recipient: '', notes: '', newPrice: '' });

  // Función unificada para procesar movimientos y precios
  const handleAction = (e) => {
    e.preventDefault();
    
    if (modalType === 'precio') {
      // Actualizar Precio
      setStock(stock.map(item => 
        item.id === selectedProduct.id ? { ...item, price: parseFloat(transaction.newPrice) } : item
      ));
    } else {
      // Actualizar Stock
      const amount = parseInt(transaction.qty);
      setStock(stock.map(item => {
        if (item.id === selectedProduct.id) {
          return { ...item, qty: modalType === 'ingreso' ? item.qty + amount : item.qty - amount };
        }
        return item;
      }));

      // Registrar en el Log
      const newLog = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        product: selectedProduct.name,
        type: modalType,
        qty: amount,
        recipient: transaction.recipient || 'Depósito Central',
      };
      setLogs([newLog, ...logs]);
    }

    // Cerrar y limpiar
    setIsModalOpen(false);
    setTransaction({ qty: '', recipient: '', notes: '', newPrice: '' });
  };

  return (
    <div className="bg-[#050505] min-h-screen p-8 text-white pt-24">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter">
              Control de <span className="text-[#D4AF37]">Logística</span>
            </h1>
            <p className="text-gray-500 font-mono text-sm mt-2 tracking-widest uppercase">Admin Panel - Avangard Equine</p>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* TABLA DE STOCK Y PRECIOS */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">
              <ClipboardList size={16} /> Inventario y Valores
            </h2>
            {stock.map((item) => (
              <motion.div 
                layoutId={`item-${item.id}`}
                key={item.id} 
                className="group bg-[#0f0f0f] border border-gray-900 p-6 rounded-xl flex justify-between items-center hover:border-gray-700 transition-all shadow-xl"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <h3 className="text-lg font-black uppercase italic">{item.name}</h3>
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('precio'); setTransaction({...transaction, newPrice: item.price}); setIsModalOpen(true); }}
                      className="opacity-0 group-hover:opacity-100 p-1 bg-gray-800 rounded text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
                    >
                      <Edit3 size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                    Línea {item.line} | <span className="text-green-500 font-mono">${item.price.toLocaleString()}</span>
                  </p>
                </div>

                <div className="flex items-center gap-10">
                  <div className="text-right">
                    <span className="block text-3xl font-mono font-bold">{item.qty}</span>
                    <span className="text-[9px] uppercase text-gray-600 font-bold tracking-widest">Unidades</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('ingreso'); setIsModalOpen(true); }}
                      className="p-3 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white transition-all rounded-lg border border-green-600/20"
                    >
                      <PackagePlus size={20} />
                    </button>
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('entrega'); setIsModalOpen(true); }}
                      className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all rounded-lg border border-red-600/20"
                    >
                      <PackageMinus size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* REGISTRO DE ACTIVIDAD */}
          <div className="bg-[#0a0a0a] rounded-2xl border border-gray-900 p-6 h-[700px] overflow-y-auto shadow-2xl">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-6">
              <History size={16} /> Registro Reciente
            </h2>
            <div className="space-y-6">
              {logs.length === 0 && <p className="text-gray-700 text-sm italic">No hay actividad registrada.</p>}
              {logs.map((log) => (
                <div key={log.id} className="border-l border-gray-800 pl-4 py-1">
                  <p className="text-[9px] text-gray-600 font-mono mb-1">{log.date}</p>
                  <p className="text-sm font-bold">
                    <span className={log.type === 'ingreso' ? 'text-green-500' : 'text-red-500 uppercase'}>
                      {log.type === 'ingreso' ? '+ ' : '- '} {log.qty}
                    </span> {log.product}
                  </p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 uppercase tracking-tighter">
                    <User size={10} /> {log.recipient}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL MULTIUSO */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-gray-800 p-8 rounded-2xl w-full max-w-md relative z-10 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
              
              <h2 className={`text-2xl font-black uppercase mb-6 flex items-center gap-3 ${modalType === 'precio' ? 'text-[#D4AF37]' : modalType === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                {modalType === 'precio' ? <DollarSign size={24}/> : modalType === 'ingreso' ? <PackagePlus size={24}/> : <PackageMinus size={24}/>}
                {modalType === 'precio' ? 'Editar Precio' : `Registrar ${modalType}`}
              </h2>

              <form onSubmit={handleAction} className="space-y-4">
                <div className="bg-black/50 p-4 rounded border border-gray-900">
                  <label className="text-[10px] uppercase font-bold text-gray-600 mb-1 block">Producto</label>
                  <div className="font-bold text-[#D4AF37] italic uppercase tracking-tight">{selectedProduct?.name}</div>
                </div>
                
                {modalType === 'precio' ? (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Nuevo Precio (ARS)</label>
                    <input 
                      type="number" required placeholder="0.00"
                      className="w-full bg-black border border-gray-800 p-4 rounded outline-none focus:border-[#D4AF37] text-white font-mono text-xl"
                      value={transaction.newPrice}
                      onChange={(e) => setTransaction({...transaction, newPrice: e.target.value})}
                    />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Cantidad</label>
                        <input 
                          type="number" required placeholder="0"
                          className="w-full bg-black border border-gray-800 p-4 rounded outline-none focus:border-[#D4AF37] text-white"
                          value={transaction.qty}
                          onChange={(e) => setTransaction({...transaction, qty: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Destinatario</label>
                        <input 
                          type="text" required placeholder="Nombre"
                          className="w-full bg-black border border-gray-800 p-4 rounded outline-none focus:border-[#D4AF37] text-white"
                          value={transaction.recipient}
                          onChange={(e) => setTransaction({...transaction, recipient: e.target.value})}
                        />
                      </div>
                    </div>
                  </>
                )}

                <button className="w-full bg-white text-black font-black py-4 uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-white transition-all flex justify-center items-center gap-2 mt-4 shadow-lg">
                  <Save size={18} /> {modalType === 'precio' ? 'Actualizar Valor' : 'Confirmar Operación'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Logistica;