import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackagePlus, PackageMinus, History, X, User, ClipboardList, Save, Edit3, DollarSign } from 'lucide-react';

const Logistica = () => {
  // 1. Estado inicial de los productos (Estaticos pero actualizables)
  const initialProducts = [
    { id: 1, name: "BAL. POLO", line: "Premium", price: 15000, qty: 10, color: "#D4AF37" },
    { id: 2, name: "BAL. PSC", line: "Premium", price: 15000, qty: 10, color: "#D4AF37" },
    { id: 3, name: "BAL. YEGUAS", line: "Premium", price: 15000, qty: 10, color: "#D4AF37" },
    { id: 4, name: "BAL. POTRILLOS", line: "Premium", price: 15000, qty: 10, color: "#D4AF37" },
    { id: 5, name: "BAL. EQUITACION", line: "Premium", price: 15000, qty: 10, color: "#D4AF37" },
    { id: 6, name: "BAL. VIGOR", line: "Premium", price: 15000, qty: 10, color: "#D4AF37" },
    { id: 7, name: "BAL. MANTENIMIENTO", line: "Professional", price: 12000, qty: 10, color: "#2563eb" },
    { id: 8, name: "BAL. DEPORTE", line: "Professional", price: 12500, qty: 10, color: "#2563eb" },
  ];

  // 2. Estados de Stock y Logs con persistencia Local
  const [stock, setStock] = useState(() => {
    const savedStock = localStorage.getItem('avangard_stock');
    return savedStock ? JSON.parse(savedStock) : initialProducts;
  });

  const [logs, setLogs] = useState(() => {
    const savedLogs = localStorage.getItem('logistica_logs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('ingreso'); // 'ingreso', 'entrega' o 'precio'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transaction, setTransaction] = useState({ qty: '', recipient: '', notes: '', newPrice: '' });

  // Guardar en localStorage automáticamente cuando cambien los estados
  useEffect(() => {
    localStorage.setItem('avangard_stock', JSON.stringify(stock));
  }, [stock]);

  useEffect(() => {
    localStorage.setItem('logistica_logs', JSON.stringify(logs));
  }, [logs]);

  // Función para procesar movimientos y precios sin Backend (Lógica Local)
  const handleAction = (e) => {
    e.preventDefault();
    
    let updatedStock = [...stock];
    const productIndex = updatedStock.findIndex(p => p.id === selectedProduct.id);

    if (modalType === 'precio') {
      updatedStock[productIndex].price = parseFloat(transaction.newPrice);
    } else {
      const amount = parseInt(transaction.qty);
      const newQty = modalType === 'ingreso' 
        ? updatedStock[productIndex].qty + amount 
        : updatedStock[productIndex].qty - amount;
      
      updatedStock[productIndex].qty = newQty;

      // Registro de Actividad (Log)
      const newLog = {
        id: Date.now(),
        date: new Date().toLocaleString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        product: selectedProduct.name,
        type: modalType,
        qty: amount,
        recipient: transaction.recipient || 'Depósito Central',
      };
      setLogs([newLog, ...logs]);
    }

    setStock(updatedStock);
    setIsModalOpen(false);
    setTransaction({ qty: '', recipient: '', notes: '', newPrice: '' });
  };

  return (
    <div className="bg-[#050505] min-h-screen p-8 text-white pt-24 font-sans">
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
          {/* SECCIÓN DE PRODUCTOS Y CANTIDADES */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">
              <ClipboardList size={16} /> Estado de Stock y Valores
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
                    <h3 className="text-lg font-black uppercase italic tracking-tight">{item.name}</h3>
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('precio'); setTransaction({...transaction, newPrice: item.price}); setIsModalOpen(true); }}
                      className="opacity-0 group-hover:opacity-100 p-1 bg-gray-800 rounded text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
                    >
                      <Edit3 size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                    Línea {item.line} | <span className="text-green-500 font-mono">${item.price?.toLocaleString()}</span>
                  </p>
                </div>

                <div className="flex items-center gap-10">
                  <div className="text-right">
                    <span className={`block text-3xl font-mono font-bold ${item.qty <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                      {item.qty}
                    </span>
                    <span className="text-[9px] uppercase text-gray-600 font-bold tracking-widest">Unidades</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('ingreso'); setIsModalOpen(true); }}
                      className="p-3 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white transition-all rounded-lg border border-green-600/20"
                      title="Registrar Ingreso"
                    >
                      <PackagePlus size={20} />
                    </button>
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('entrega'); setIsModalOpen(true); }}
                      className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all rounded-lg border border-red-600/20"
                      title="Registrar Egreso/Entrega"
                    >
                      <PackageMinus size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* REGISTRO DE LOGS (CON MEMORIA LOCAL) */}
          <div className="bg-[#0a0a0a] rounded-2xl border border-gray-900 p-6 h-[700px] flex flex-col shadow-2xl">
            <h2 className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-6">
              <span className="flex items-center gap-2"><History size={16} /> Registro de Movimientos</span>
              {logs.length > 0 && (
                <button 
                  onClick={() => { if(window.confirm("¿Limpiar historial?")) setLogs([]); }}
                  className="text-[8px] text-gray-700 hover:text-red-500 transition-colors"
                >
                  Limpiar
                </button>
              )}
            </h2>
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              {logs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-800 italic">
                  <History size={32} className="mb-2 opacity-20" />
                  <p className="text-xs">Sin actividad reciente</p>
                </div>
              )}
              {logs.map((log) => (
                <div key={log.id} className="border-l-2 border-gray-900 pl-4 py-1 relative">
                  <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${log.type === 'ingreso' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-[9px] text-gray-600 font-mono mb-1">{log.date}</p>
                  <p className="text-sm font-bold">
                    <span className={log.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}>
                      {log.type === 'ingreso' ? 'ALTA' : 'BAJA'}
                    </span>
                    <span className="mx-2 text-gray-400">|</span>
                    {log.product}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                      <User size={10} className="text-[#D4AF37]" /> {log.recipient}
                    </p>
                    <p className="font-mono text-xs font-bold">{log.type === 'ingreso' ? '+' : '-'}{log.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE OPERACIONES */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-gray-800 p-8 rounded-2xl w-full max-w-md relative z-10 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X /></button>
              
              <h2 className={`text-2xl font-black uppercase mb-6 flex items-center gap-3 ${modalType === 'precio' ? 'text-[#D4AF37]' : modalType === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                {modalType === 'precio' ? <DollarSign size={24}/> : modalType === 'ingreso' ? <PackagePlus size={24}/> : <PackageMinus size={24}/>}
                {modalType === 'precio' ? 'Ajustar Precio' : `Registrar ${modalType}`}
              </h2>

              <form onSubmit={handleAction} className="space-y-5">
                <div className="bg-black/50 p-4 rounded border border-gray-900">
                  <label className="text-[10px] uppercase font-bold text-gray-600 mb-1 block">Producto seleccionado</label>
                  <div className="font-bold text-[#D4AF37] italic uppercase tracking-tight text-lg">{selectedProduct?.name}</div>
                </div>
                
                {modalType === 'precio' ? (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Nuevo Valor de Venta (ARS)</label>
                    <input 
                      type="number" required step="0.01"
                      className="w-full bg-black border border-gray-800 p-4 rounded outline-none focus:border-[#D4AF37] text-white font-mono text-2xl"
                      value={transaction.newPrice}
                      onChange={(e) => setTransaction({...transaction, newPrice: e.target.value})}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Cantidad</label>
                        <input 
                          type="number" required min="1"
                          className="w-full bg-black border border-gray-800 p-4 rounded outline-none focus:border-[#D4AF37] text-white font-mono text-xl"
                          value={transaction.qty}
                          onChange={(e) => setTransaction({...transaction, qty: e.target.value})}
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">{modalType === 'ingreso' ? 'Origen' : 'Destinatario'}</label>
                        <input 
                          type="text" required
                          placeholder={modalType === 'ingreso' ? 'Proveedor' : 'Cliente / Piloto'}
                          className="w-full bg-black border border-gray-800 p-4 rounded outline-none focus:border-[#D4AF37] text-white uppercase text-sm"
                          value={transaction.recipient}
                          onChange={(e) => setTransaction({...transaction, recipient: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button className="w-full bg-white text-black font-black py-4 uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-white transition-all flex justify-center items-center gap-2 mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <Save size={18} /> {modalType === 'precio' ? 'Actualizar Precio' : 'Confirmar en Sistema'}
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