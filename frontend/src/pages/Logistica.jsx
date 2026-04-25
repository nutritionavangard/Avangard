import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import axios from 'axios';

const Logistica = () => {
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
  const [transaction, setTransaction] = useState({ 
    qty: '', 
    recipient: '', 
    newPrice: '',
    name: '',
    line: 'Professional',
    color: '#D4AF37'
  });
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  // 2. Cargar productos
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

  // 3. Procesar acciones (Alta, Stock o Precio)
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
    } catch (e) { console.error("Error leyendo token"); }

    const config = {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    };

    try {
      if (modalType === 'nuevo') {
        await axios.post(`${API_URL}/api/products`, {
          name: transaction.name,
          qty: parseInt(transaction.qty),
          line: transaction.line,
          color: transaction.color,
          price: parseFloat(transaction.newPrice)
        }, config);
      } else if (modalType === 'precio') {
        await axios.put(`${API_URL}/api/stock/price/${selectedProduct._id}`, 
          { price: parseFloat(transaction.newPrice) }, config);
      } else {
        await axios.post(`${API_URL}/api/stock/update`, { 
          productId: selectedProduct._id,
          type: modalType === 'ingreso' ? 'Ingreso' : 'Egreso',
          amount: parseInt(transaction.qty),
          recipient: transaction.recipient || 'Depósito Central'
        }, config);
      }

      // Actualizar logs visuales si no es cambio de precio
      if (modalType !== 'precio' && modalType !== 'nuevo') {
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

      await fetchProducts();
      setIsModalOpen(false);
      setTransaction({ qty: '', recipient: '', newPrice: '', name: '', line: 'Professional', color: '#D4AF37' });

    } catch (error) {
      alert(error.response?.data?.message || "Error al actualizar la base de datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[#D4AF37]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37] mb-4"></div>
        <p className="font-black italic uppercase tracking-widest text-xs text-center">Sincronizando con Avangard Cloud...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen p-4 md:p-8 text-white pt-32 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Corregido para que no se corte */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              Control de <br /><span className="text-[#D4AF37]">Logística</span>
            </h1>
            <p className="text-gray-600 font-mono text-[10px] mt-4 tracking-widest uppercase border-l border-[#D4AF37] pl-4">
              Admin Terminal // Stock Management System
            </p>
          </div>
          
          <button 
            onClick={() => { 
              setModalType('nuevo'); 
              setTransaction({ name: '', qty: '', line: 'Professional', color: '#D4AF37', newPrice: '' });
              setIsModalOpen(true); 
            }}
            className="group bg-white text-black px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all flex items-center gap-3 italic shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            <PlusCircle size={18} className="group-hover:rotate-90 transition-transform"/>
            Alta de Producto
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">
              <ClipboardList size={14} /> Inventario Actual ({stock.length})
            </h2>
            
            {stock.map((item) => (
              <motion.div 
                layoutId={`item-${item._id}`}
                key={item._id} 
                className="group bg-[#0d0d0d] border border-gray-900 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center hover:border-gray-700 transition-all shadow-2xl"
              >
                <div className="flex flex-col gap-1 w-full md:w-auto mb-4 md:mb-0">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 15px ${item.color}50` }}></span>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight leading-none">{item.name}</h3>
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('precio'); setTransaction({...transaction, newPrice: item.price}); setIsModalOpen(true); }}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-gray-800 rounded-lg text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-2">
                    Línea {item.line} | <span className="text-green-500 font-mono">${item.price?.toLocaleString()}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto">
                  <div className="text-right">
                    <span className={`block text-5xl font-mono font-black ${item.qty <= 5 ? 'text-red-600 animate-pulse' : 'text-white'}`}>
                      {item.qty}
                    </span>
                    <span className="text-[9px] uppercase text-gray-600 font-black tracking-[0.3em]">Unidades</span>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('ingreso'); setIsModalOpen(true); }}
                      className="p-5 bg-green-950/10 text-green-500 hover:bg-green-600 hover:text-white transition-all rounded-2xl border border-green-900/20"
                    >
                      <PackagePlus size={24} />
                    </button>
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('entrega'); setIsModalOpen(true); }}
                      className="p-5 bg-red-950/10 text-red-500 hover:bg-red-600 hover:text-white transition-all rounded-2xl border border-red-900/20"
                    >
                      <PackageMinus size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Registro de Actividad */}
          <div className="bg-[#080808] rounded-3xl border border-gray-900 p-6 h-[650px] flex flex-col shadow-2xl sticky top-24">
            <h2 className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-8">
              <span className="flex items-center gap-2"><History size={14} /> Log de Movimientos</span>
              {logs.length > 0 && (
                <button onClick={() => setLogs([])} className="text-[8px] text-gray-700 hover:text-red-500 transition-colors uppercase font-black">Limpiar</button>
              )}
            </h2>
            <div className="space-y-6 overflow-y-auto pr-2 flex-1 custom-scrollbar">
              {logs.length === 0 && <p className="text-center text-gray-800 text-[10px] mt-20 uppercase font-black tracking-widest">Sin actividad reciente</p>}
              {logs.map((log) => (
                <div key={log.id} className="border-l-2 border-gray-900 pl-4 py-1 relative">
                  <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${log.type === 'ingreso' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-[9px] text-gray-600 font-mono mb-1">{log.date}</p>
                  <p className="text-xs font-black uppercase italic">{log.product}</p>
                  <div className="flex justify-between items-center mt-2 font-mono text-[10px]">
                    <span className="text-gray-500 italic lowercase">@{log.recipient}</span>
                    <span className={log.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}>
                      {log.type === 'ingreso' ? '+' : '-'}{log.qty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL MAESTRO */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f0f0f] border border-gray-800 p-8 rounded-3xl w-full max-w-md relative shadow-[0_0_100px_rgba(212,175,55,0.1)]"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={20}/></button>
              
              <h2 className={`text-2xl font-black uppercase mb-8 italic flex items-center gap-3 ${modalType === 'nuevo' || modalType === 'precio' ? 'text-[#D4AF37]' : modalType === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                {modalType === 'nuevo' ? <PlusCircle size={24}/> : modalType === 'precio' ? <DollarSign size={24}/> : <ClipboardList size={24}/>}
                {modalType === 'nuevo' ? 'Nuevo Producto' : modalType === 'precio' ? 'Ajustar Precio' : `Stock: ${modalType}`}
              </h2>

              <form onSubmit={handleAction} className="space-y-6">
                {modalType === 'nuevo' ? (
                  <div className="space-y-4">
                    <input type="text" placeholder="Nombre del Producto" required className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-[#D4AF37] uppercase font-bold text-sm"
                      value={transaction.name} onChange={(e) => setTransaction({...transaction, name: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <select className="bg-black border border-gray-800 p-4 rounded-xl text-xs font-bold uppercase text-gray-400"
                        value={transaction.line} onChange={(e) => setTransaction({...transaction, line: e.target.value})}>
                        <option value="Professional">Línea Professional</option>
                        <option value="Premium">Línea Premium</option>
                      </select>
                      <input type="color" className="w-full h-12 bg-black border border-gray-800 p-1 rounded-xl cursor-pointer"
                        value={transaction.color} onChange={(e) => setTransaction({...transaction, color: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" placeholder="Stock Inicial" required className="bg-black border border-gray-800 p-4 rounded-xl font-mono"
                        value={transaction.qty} onChange={(e) => setTransaction({...transaction, qty: e.target.value})} />
                      <input type="number" placeholder="Precio ARS" required className="bg-black border border-gray-800 p-4 rounded-xl font-mono text-green-500"
                        value={transaction.newPrice} onChange={(e) => setTransaction({...transaction, newPrice: e.target.value})} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-black/50 p-4 rounded-xl border border-gray-900 mb-6 text-center">
                      <p className="text-[10px] text-gray-600 uppercase font-black mb-1">Producto</p>
                      <p className="text-xl font-black text-[#D4AF37] italic uppercase">{selectedProduct?.name}</p>
                    </div>
                    {modalType === 'precio' ? (
                      <input type="number" step="0.01" required className="w-full bg-black border border-gray-800 p-6 rounded-xl font-mono text-4xl text-center text-[#D4AF37]"
                        value={transaction.newPrice} onChange={(e) => setTransaction({...transaction, newPrice: e.target.value})} autoFocus />
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Cantidad" required className="bg-black border border-gray-800 p-5 rounded-xl font-mono text-2xl text-center"
                          value={transaction.qty} onChange={(e) => setTransaction({...transaction, qty: e.target.value})} autoFocus />
                        <input type="text" placeholder={modalType === 'ingreso' ? 'Origen' : 'Destino'} required className="bg-black border border-gray-800 p-5 rounded-xl uppercase text-[10px] font-black"
                          value={transaction.recipient} onChange={(e) => setTransaction({...transaction, recipient: e.target.value})} />
                      </div>
                    )}
                  </div>
                )}

                <button disabled={isSubmitting} className="w-full bg-white text-black font-black py-5 uppercase tracking-[0.3em] rounded-2xl hover:bg-[#D4AF37] hover:text-white transition-all disabled:opacity-50 italic">
                  {isSubmitting ? "Sincronizando..." : "Confirmar Operación"}
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