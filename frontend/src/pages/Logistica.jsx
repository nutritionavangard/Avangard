import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Corregido: Importación única desde lucide-react
import { 
  PackagePlus, 
  PackageMinus, 
  History, 
  X, 
  User, 
  ClipboardList, 
  Save, 
  Edit3, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const Logistica = () => {
  // CONFIGURACIÓN CRÍTICA: Prioriza la variable de entorno, pero usa tu URL de Render real por defecto
  const API_URL = import.meta.env.VITE_API_URL || 'https://avangard-mdpp.onrender.com';

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
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  // 2. Cargar productos desde la base de datos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/products`);
      setStock(Array.isArray(response.data) ? response.data : []);
      setErrorStatus(null);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setErrorStatus("No se pudo conectar con el servidor de Avangard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('logistica_logs', JSON.stringify(logs));
  }, [logs]);

  // 3. Procesar movimientos
  const handleAction = async (e) => {
    e.preventDefault();
    
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
      console.error("Error crítico leyendo token");
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    try {
      let data;
      if (modalType === 'precio') {
        const res = await axios.put(
          `${API_URL}/api/stock/price/${selectedProduct._id}`, 
          { price: parseFloat(transaction.newPrice) }, 
          config
        );
        data = res.data;
      } else {
        const res = await axios.post(
          `${API_URL}/api/stock/update`, 
          { 
            productId: selectedProduct._id,
            type: modalType === 'ingreso' ? 'Ingreso' : 'Egreso',
            amount: parseInt(transaction.qty),
            recipient: transaction.recipient || 'Depósito Central'
          }, 
          config
        );
        await fetchProducts();
      }

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
      } else {
         setStock(prev => prev.map(item => item._id === data._id ? data : item));
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
        <p className="font-black italic uppercase tracking-widest text-xs">Sincronizando Avangard...</p>
      </div>
    );
  }

  if (errorStatus) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold uppercase mb-2 italic">Error de Conexión</h2>
        <p className="text-gray-500 mb-6 max-w-xs">{errorStatus}</p>
        <button onClick={() => window.location.reload()} className="bg-[#D4AF37] text-black px-8 py-3 font-black uppercase hover:bg-white transition-all transform hover:scale-105 italic">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen p-4 md:p-8 text-white pt-24 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Control de <span className="text-[#D4AF37]">Logística</span>
            </h1>
            <p className="text-gray-600 font-mono text-[10px] mt-2 tracking-widest uppercase">Admin Terminal // Cloud Sync Active</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6">
              <ClipboardList size={14} /> Inventario en Depósito
            </h2>
            {stock.map((item) => (
              <motion.div 
                layoutId={`item-${item._id}`}
                key={item._id} 
                className="group bg-[#0d0d0d] border border-gray-900 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center hover:border-gray-700 transition-all shadow-2xl"
              >
                <div className="flex flex-col gap-1 w-full md:w-auto mb-4 md:mb-0">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: item.color }}></span>
                    <h3 className="text-xl font-black uppercase italic tracking-tight leading-none">{item.name}</h3>
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('precio'); setTransaction({...transaction, newPrice: item.price}); setIsModalOpen(true); }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 bg-gray-800 rounded text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">
                    Línea {item.line} | <span className="text-green-500 font-mono">${item.price?.toLocaleString()}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
                  <div className="text-right">
                    <span className={`block text-4xl font-mono font-black ${item.qty <= 5 ? 'text-red-600 animate-pulse' : 'text-white'}`}>
                      {item.qty}
                    </span>
                    <span className="text-[9px] uppercase text-gray-600 font-black tracking-widest">Unidades</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('ingreso'); setIsModalOpen(true); }}
                      className="p-4 bg-green-950/20 text-green-500 hover:bg-green-600 hover:text-white transition-all rounded-xl border border-green-900/30"
                    >
                      <PackagePlus size={22} />
                    </button>
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('entrega'); setIsModalOpen(true); }}
                      className="p-4 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white transition-all rounded-xl border border-red-900/30"
                    >
                      <PackageMinus size={22} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* PANEL DE HISTORIAL */}
          <div className="bg-[#080808] rounded-2xl border border-gray-900 p-6 h-[600px] flex flex-col shadow-2xl sticky top-24">
            <h2 className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-8">
              <span className="flex items-center gap-2"><History size={14} /> Registro de Actividad</span>
              {logs.length > 0 && (
                <button 
                  onClick={() => { if(window.confirm("¿Vaciar registro visual?")) setLogs([]); }}
                  className="text-[8px] text-gray-700 hover:text-red-500 uppercase font-black transition-colors"
                >
                  Limpiar
                </button>
              )}
            </h2>
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {logs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-20">
                  <History size={40} className="mb-4" />
                  <p className="text-[10px] uppercase font-black tracking-widest text-center">Esperando movimientos...</p>
                </div>
              )}
              {logs.map((log) => (
                <div key={log.id} className="border-l border-gray-800 pl-4 py-1 relative">
                  <div className={`absolute -left-[4.5px] top-2 w-2 h-2 rounded-full ${log.type === 'ingreso' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-[9px] text-gray-600 font-mono mb-1">{log.date}</p>
                  <p className="text-xs font-black uppercase italic tracking-tighter">
                    <span className={log.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}>
                      {log.type === 'ingreso' ? 'ALTA' : 'BAJA'}
                    </span>
                    <span className="mx-2 text-gray-800">/</span>
                    {log.product}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1">
                      <User size={10} className="text-[#D4AF37]" /> {log.recipient}
                    </p>
                    <p className="font-mono text-xs font-black">{log.type === 'ingreso' ? '+' : '-'}{log.qty}</p>
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f0f0f] border border-gray-800 p-8 rounded-2xl w-full max-w-md relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
              
              <h2 className={`text-2xl font-black uppercase mb-8 flex items-center gap-3 italic ${modalType === 'precio' ? 'text-[#D4AF37]' : modalType === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                {modalType === 'precio' ? <DollarSign size={24}/> : modalType === 'ingreso' ? <PackagePlus size={24}/> : <PackageMinus size={24}/>}
                {modalType === 'precio' ? 'Ajustar Precio' : `Registrar ${modalType === 'ingreso' ? 'Ingreso' : 'Entrega'}`}
              </h2>

              <form onSubmit={handleAction} className="space-y-6">
                <div className="bg-black/40 p-4 rounded-lg border border-gray-900">
                  <label className="text-[9px] uppercase font-black text-gray-600 mb-1 block tracking-widest">Ítem Seleccionado</label>
                  <div className="font-black text-[#D4AF37] italic uppercase tracking-tight text-xl">{selectedProduct?.name}</div>
                </div>
                
                {modalType === 'precio' ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                    <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block">Nuevo Valor de Mercado (ARS)</label>
                    <div className="relative">
                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20}/>
                       <input 
                        type="number" required step="0.01"
                        className="w-full bg-black border border-gray-800 p-4 pl-12 rounded-xl outline-none focus:border-[#D4AF37] text-white font-mono text-3xl transition-all"
                        value={transaction.newPrice}
                        onChange={(e) => setTransaction({...transaction, newPrice: e.target.value})}
                        autoFocus
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block tracking-tight">Cantidad</label>
                        <input 
                          type="number" required min="1"
                          className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-[#D4AF37] text-white font-mono text-2xl transition-all"
                          value={transaction.qty}
                          onChange={(e) => setTransaction({...transaction, qty: e.target.value})}
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block tracking-tight">{modalType === 'ingreso' ? 'Origen' : 'Destino'}</label>
                        <input 
                          type="text" required
                          placeholder="Ej: Rosario"
                          className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-[#D4AF37] text-white uppercase text-xs font-bold transition-all placeholder:text-gray-800"
                          value={transaction.recipient}
                          onChange={(e) => setTransaction({...transaction, recipient: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  disabled={isSubmitting}
                  className={`w-full font-black py-5 uppercase tracking-[0.25em] transition-all flex justify-center items-center gap-3 rounded-xl text-sm italic
                    ${isSubmitting ? 'bg-gray-900 text-gray-700 cursor-not-allowed' : 'bg-white text-black hover:bg-[#D4AF37] hover:text-white active:scale-95'}`}
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-gray-700 border-t-[#D4AF37] animate-spin rounded-full"></div>
                  ) : (
                    <><Save size={18} /> Confirmar Cambios</>
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