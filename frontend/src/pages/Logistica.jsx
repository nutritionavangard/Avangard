import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackagePlus, PackageMinus, History, X, User, ClipboardList, Save, Edit3, DollarSign } from 'lucide-center';
import { PackagePlus as PackagePlusIcon, PackageMinus as PackageMinusIcon, History as HistoryIcon, X as XIcon, User as UserIcon, ClipboardList as ClipboardListIcon, Save as SaveIcon, Edit3 as Edit3Icon, DollarSign as DollarSignIcon } from 'lucide-react';
import axios from 'axios';

const Logistica = () => {
  // 1. Estados principales
  const [stock, setStock] = useState([]);
  const [logs, setLogs] = useState(() => {
    try {
      const savedLogs = localStorage.getItem('logistica_logs');
      return (savedLogs && savedLogs !== "undefined") ? JSON.parse(savedLogs) : [];
    } catch (e) {
      console.error("Error al parsear logs:", e);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('ingreso'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transaction, setTransaction] = useState({ qty: '', recipient: '', notes: '', newPrice: '' });
  
  // Estados de UI y Red
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  // 2. Cargar productos desde MongoDB
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      setStock(Array.isArray(response.data) ? response.data : []);
      setErrorStatus(null);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setErrorStatus("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Persistencia local para el historial visual
  useEffect(() => {
    localStorage.setItem('logistica_logs', JSON.stringify(logs));
  }, [logs]);

  // 3. Función para procesar movimientos con validaciones
  const handleAction = async (e) => {
    e.preventDefault();
    
    // Validación de stock insuficiente (Solo para egresos)
    if (modalType === 'entrega' && parseInt(transaction.qty) > selectedProduct.qty) {
      alert("⚠️ Error: No puedes entregar más unidades de las que hay en stock.");
      return;
    }

    setIsSubmitting(true);
    
    let token = null;
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo && userInfo !== "undefined") {
        token = JSON.parse(userInfo).token;
      }
    } catch (e) {
      console.error("Error crítico leyendo token de autenticación");
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    let updatedFields = {};
    if (modalType === 'precio') {
      updatedFields.price = parseFloat(transaction.newPrice);
    } else {
      const amount = parseInt(transaction.qty);
      updatedFields.qty = modalType === 'ingreso' 
        ? selectedProduct.qty + amount 
        : selectedProduct.qty - amount;
    }

    try {
      // Petición al Backend
      const { data } = await axios.put(
        `http://localhost:5000/api/products/${selectedProduct._id}`, 
        updatedFields, 
        config
      );

      // Sincronizar estado local con la respuesta del servidor
      setStock(prevStock => prevStock.map(item => item._id === data._id ? data : item));

      // Registrar en el historial visual del panel derecho
      if (modalType !== 'precio') {
        const newLog = {
          id: Date.now(),
          date: new Date().toLocaleString('es-AR'),
          product: selectedProduct.name,
          type: modalType,
          qty: parseInt(transaction.qty),
          recipient: transaction.recipient || 'Depósito Central',
        };
        setLogs(prev => [newLog, ...prev]);
      }

      setIsModalOpen(false);
      setTransaction({ qty: '', recipient: '', notes: '', newPrice: '' });

    } catch (error) {
      console.error("Error en la transacción:", error);
      alert(error.response?.data?.message || "Error al actualizar la base de datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[#D4AF37]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37] mb-4"></div>
        <p className="font-black italic uppercase tracking-widest">Sincronizando Avangard...</p>
      </div>
    );
  }

  if (errorStatus) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <XIcon size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold uppercase mb-2">Error de Sistema</h2>
        <p className="text-gray-500 mb-6">{errorStatus}</p>
        <button onClick={() => window.location.reload()} className="bg-[#D4AF37] text-black px-6 py-2 font-bold uppercase hover:bg-white transition-colors">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen p-8 text-white pt-24 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter">
              Control de <span className="text-[#D4AF37]">Logística</span>
            </h1>
            <p className="text-gray-500 font-mono text-sm mt-2 tracking-widest uppercase">Admin Panel - Safe Mode Active</p>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">
              <ClipboardListIcon size={16} /> Estado de Stock en tiempo real
            </h2>
            {stock.map((item) => (
              <motion.div 
                layoutId={`item-${item._id}`}
                key={item._id} 
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
                      <Edit3Icon size={12} />
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
                    >
                      <PackagePlusIcon size={20} />
                    </button>
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('entrega'); setIsModalOpen(true); }}
                      className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all rounded-lg border border-red-600/20"
                    >
                      <PackageMinusIcon size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* PANEL DE LOGS */}
          <div className="bg-[#0a0a0a] rounded-2xl border border-gray-900 p-6 h-[700px] flex flex-col shadow-2xl">
            <h2 className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-6">
              <span className="flex items-center gap-2"><HistoryIcon size={16} /> Movimientos Recientes</span>
              {logs.length > 0 && (
                <button 
                  onClick={() => { if(window.confirm("¿Limpiar historial visual?")) setLogs([]); }}
                  className="text-[8px] text-gray-700 hover:text-red-500 uppercase font-black"
                >
                  Limpiar
                </button>
              )}
            </h2>
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              {logs.length === 0 && <p className="text-gray-800 text-[10px] uppercase text-center mt-10 tracking-widest">Sin actividad reciente</p>}
              {logs.map((log) => (
                <div key={log.id} className="border-l-2 border-gray-900 pl-4 py-1 relative">
                  <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${log.type === 'ingreso' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-[9px] text-gray-600 font-mono mb-1">{log.date}</p>
                  <p className="text-sm font-bold uppercase italic">
                    <span className={log.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}>
                      {log.type === 'ingreso' ? 'ALTA' : 'BAJA'}
                    </span>
                    <span className="mx-2 text-gray-400">|</span>
                    {log.product}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                      <UserIcon size={10} className="text-[#D4AF37]" /> {log.recipient}
                    </p>
                    <p className="font-mono text-xs font-bold">{log.type === 'ingreso' ? '+' : '-'}{log.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL UNIFICADO */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-gray-800 p-8 rounded-2xl w-full max-w-md relative z-10 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><XIcon /></button>
              
              <h2 className={`text-2xl font-black uppercase mb-6 flex items-center gap-3 ${modalType === 'precio' ? 'text-[#D4AF37]' : modalType === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                {modalType === 'precio' ? <DollarSignIcon size={24}/> : modalType === 'ingreso' ? <PackagePlusIcon size={24}/> : <PackageMinusIcon size={24}/>}
                {modalType === 'precio' ? 'Ajustar Precio' : `Registrar ${modalType === 'ingreso' ? 'Ingreso' : 'Entrega'}`}
              </h2>

              <form onSubmit={handleAction} className="space-y-5">
                <div className="bg-black/50 p-4 rounded border border-gray-900">
                  <label className="text-[10px] uppercase font-bold text-gray-600 mb-1 block">Producto seleccionado</label>
                  <div className="font-bold text-[#D4AF37] italic uppercase tracking-tight text-lg">{selectedProduct?.name}</div>
                </div>
                
                {modalType === 'precio' ? (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Nuevo Precio (ARS)</label>
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
                          className="w-full bg-black border border-gray-800 p-4 rounded outline-none focus:border-[#D4AF37] text-white uppercase text-sm"
                          value={transaction.recipient}
                          onChange={(e) => setTransaction({...transaction, recipient: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  disabled={isSubmitting}
                  className={`w-full font-black py-4 uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-2 mt-4 
                    ${isSubmitting ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-[#D4AF37] hover:text-white'}`}
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-gray-500 border-t-[#D4AF37] animate-spin rounded-full"></div>
                  ) : (
                    <><SaveIcon size={18} /> Confirmar en Base de Datos</>
                  )}
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