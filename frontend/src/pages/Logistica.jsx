import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PackagePlus, PackageMinus, History, X, ClipboardList, 
  Edit3, PlusCircle, RefreshCw, Trash2 
} from 'lucide-react';
import API from '../services/api'; 

const Logistica = () => {
  const CATALOGO_PRODUCTOS = [
    "BAL POLO", "BAL PSC", "BAL Yeguas Reproductoras", "BAL Potrillos",
    "BAL Equitacion", "Conc. Prot. Vigor. Equino", "BAL Mantenimiento",
    "BAL Deporte", "Cubos de Alfalfa", "Palet de Alfalfa", "Avena"
  ];

  const [stock, setStock] = useState([]);
  const [logs, setLogs] = useState(() => {
    try {
      const savedLogs = localStorage.getItem('logistica_logs');
      return (savedLogs && savedLogs !== "undefined") ? JSON.parse(savedLogs) : [];
    } catch (e) { return []; }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('ingreso'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [transaction, setTransaction] = useState({ 
    qty: '', 
    recipient: '', 
    newPrice: '', 
    name: CATALOGO_PRODUCTOS[0], 
    line: 'Premium', 
    tagline: 'MÁXIMO RENDIMIENTO',
    category: 'Equine',
    desc: '' 
  });
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  const fetchProducts = async () => {
    try {
      setErrorStatus(null);
      const response = await API.get('/products');
      setStock(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorStatus("Sincronizando con la terminal...");
      setTimeout(fetchProducts, 5000);
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

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este ítem permanentemente?")) return;
    try {
      await API.delete(`/products/${id}`);
      await fetchProducts();
    } catch (error) {
      alert("Error al eliminar el producto");
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let response;
      if (modalType === 'nuevo') {
        response = await API.post('/products', {
          name: transaction.name, 
          tagline: transaction.tagline,
          desc: transaction.desc || "",
          line: transaction.line, 
          price: Number(transaction.newPrice),
          category: transaction.category,
          qty: Number(transaction.qty), 
          color: transaction.line === 'Premium' ? '#D4AF37' : '#2563eb'
        });
      } else if (modalType === 'precio') {
        const payload = {
          name: selectedProduct.name,
          tagline: selectedProduct.tagline || 'MÁXIMO RENDIMIENTO',
          desc: selectedProduct.desc || "",
          line: selectedProduct.line,
          price: Number(transaction.newPrice),
          category: selectedProduct.category || "Equine",
          qty: Number(selectedProduct.qty),
          color: selectedProduct.color || "#D4AF37"
        };
        response = await API.put(`/products/${selectedProduct._id}`, payload);
      } else {
        response = await API.post('/stock/update', { 
          productId: selectedProduct._id,
          type: modalType === 'ingreso' ? 'Ingreso' : 'Egreso',
          amount: Number(transaction.qty),
          recipient: transaction.recipient || 'Depósito Central'
        });
      }

      const newLog = {
        id: Date.now(),
        date: new Date().toLocaleString('es-AR'),
        product: modalType === 'nuevo' ? transaction.name : selectedProduct.name,
        type: modalType === 'nuevo' ? 'ingreso' : modalType,
        qty: modalType === 'precio' ? 0 : Number(transaction.qty),
        recipient: modalType === 'precio' ? 'Ajuste de Valor' : (transaction.recipient || 'Depósito Central'),
      };
      
      if (modalType !== 'precio') setLogs(prev => [newLog, ...prev]);
      await fetchProducts();
      setIsModalOpen(false);
      setTransaction({ 
        qty: '', recipient: '', newPrice: '', 
        name: CATALOGO_PRODUCTOS[0], line: 'Premium', 
        tagline: 'MÁXIMO RENDIMIENTO', category: 'Equine',
        desc: ''
      });
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "Error al procesar"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && stock.length === 0) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[#D4AF37]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#D4AF37] mb-4"></div>
      <p className="font-black italic uppercase tracking-widest text-[10px]">Cargando Sistema...</p>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen p-4 md:p-8 text-white pt-36 font-sans relative overflow-x-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
              Gestión de <br /><span className="text-[#D4AF37]">Stock</span>
            </h1>
            <p className="text-gray-600 font-mono text-[10px] mt-6 tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-4">
              Avangard Logistics Terminal
            </p>
          </div>
          
          <button 
            onClick={() => { 
              setModalType('nuevo'); 
              setTransaction({ ...transaction, qty: '', newPrice: '', desc: '' });
              setIsModalOpen(true); 
            }}
            className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all flex items-center gap-3 italic shadow-2xl active:scale-95"
          >
            <PlusCircle size={20}/> Alta de Ingreso
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">
              <ClipboardList size={14} /> Ítems en Depósito ({stock.length})
            </h2>
            
            {stock.map((item) => (
              <motion.div layoutId={`item-${item._id}`} key={item._id} 
                className="bg-[#0d0d0d] border border-gray-900 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center hover:border-gray-700 transition-all shadow-2xl relative group"
              >
                <button 
                  onClick={() => handleDeleteProduct(item._id)}
                  className="absolute -top-2 -right-2 bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                >
                  <Trash2 size={14} />
                </button>

                <div className="flex flex-col gap-2 w-full md:w-auto mb-6 md:mb-0">
                  <h3 className="text-3xl font-black uppercase italic tracking-tight leading-none">{item.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                      Línea {item.line} <span className="mx-2">|</span> 
                      <span className="text-green-500 text-lg font-mono tracking-tighter">${item.price?.toLocaleString()}</span>
                    </p>
                    <button 
                      onClick={() => { setSelectedProduct(item); setModalType('precio'); setTransaction({...transaction, newPrice: item.price}); setIsModalOpen(true); }}
                      className="p-3 bg-gray-900 text-[#D4AF37] rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all active:scale-90"
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
                  <div className="text-right min-w-[100px]">
                    <span className={`block text-6xl font-mono font-black leading-none ${item.qty <= 5 ? 'text-red-600 animate-pulse' : 'text-white'}`}>{item.qty}</span>
                    <span className="text-[10px] uppercase text-gray-600 font-black tracking-widest">Stock Disp.</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setSelectedProduct(item); setModalType('ingreso'); setIsModalOpen(true); }} className="p-5 bg-green-950/20 text-green-500 hover:bg-green-600 hover:text-white transition-all rounded-2xl border border-green-900/20 active:scale-90"><PackagePlus size={28} /></button>
                    <button onClick={() => { setSelectedProduct(item); setModalType('entrega'); setIsModalOpen(true); }} className="p-5 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white transition-all rounded-2xl border border-red-900/20 active:scale-90"><PackageMinus size={28} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#080808] rounded-3xl border border-gray-900 p-6 h-[600px] flex flex-col sticky top-36">
            <header className="flex items-center justify-between mb-8">
              <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">
                <History size={14} /> Historial
              </h2>
              <button 
                onClick={() => { if(window.confirm("¿Limpiar todo el historial visual?")) setLogs([]); }}
                className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-900 rounded-lg hover:bg-red-900/20 hover:text-red-500 transition-colors"
              >
                Limpiar
              </button>
            </header>
            
            <div className="space-y-6 overflow-y-auto pr-2 flex-1 custom-scrollbar">
              {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <History size={40} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-center">Sin registros recientes</p>
                </div>
              )}
              {logs.map((log) => (
                <div key={log.id} className="border-l-2 border-gray-800 pl-4 py-1 relative">
                  <div className={`absolute -left-[3px] top-2 w-1.5 h-1.5 rounded-full ${log.type === 'ingreso' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                  <p className="text-[8px] text-gray-600 font-mono mb-1">{log.date}</p>
                  <p className="text-[11px] font-black uppercase italic tracking-tight">{log.product}</p>
                  <div className="flex justify-between mt-1 text-[10px] font-mono">
                    <span className="text-gray-500">@{log.recipient}</span>
                    <span className={log.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}>{log.type === 'ingreso' ? '+' : '-'}{log.qty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0f0f0f] border border-gray-800 p-8 rounded-[2rem] w-full max-w-md relative shadow-3xl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white p-2 bg-gray-900 rounded-full transition-all active:scale-90"><X size={20}/></button>
              
              <h2 className={`text-2xl font-black uppercase mb-8 italic ${modalType === 'nuevo' || modalType === 'precio' ? 'text-[#D4AF37]' : modalType === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                {modalType === 'nuevo' ? 'Alta de Producto' : modalType === 'precio' ? 'Ajuste de Valor' : `Registro de ${modalType}`}
              </h2>

              <form onSubmit={handleAction} className="space-y-6">
                {modalType === 'nuevo' ? (
                  <div className="space-y-5">
                    <div>
                      <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-widest">Producto</label>
                      <select className="w-full bg-black border border-gray-800 p-5 rounded-2xl text-white font-bold uppercase text-sm focus:border-[#D4AF37] outline-none appearance-none"
                        value={transaction.name} onChange={(e) => setTransaction({...transaction, name: e.target.value})}>
                        {CATALOGO_PRODUCTOS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-widest">Línea</label>
                        <select className="w-full bg-black border border-gray-800 p-5 rounded-2xl text-xs font-bold uppercase focus:border-[#D4AF37] outline-none appearance-none"
                          value={transaction.line} onChange={(e) => setTransaction({...transaction, line: e.target.value})}>
                          <option value="Premium">Premium</option>
                          <option value="Professional">Professional</option>
                          <option value="Standard">Standard</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-widest">Precio ARS</label>
                        <input type="number" required className="w-full bg-black border border-gray-800 p-5 rounded-2xl font-mono text-green-500 focus:border-green-500 outline-none"
                          value={transaction.newPrice} onChange={(e) => setTransaction({...transaction, newPrice: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block tracking-widest text-center">Stock Inicial</label>
                      <input type="number" required className="w-full bg-black border border-gray-800 p-6 rounded-2xl font-mono text-3xl text-center focus:border-[#D4AF37] outline-none"
                        value={transaction.qty} onChange={(e) => setTransaction({...transaction, qty: e.target.value})} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-black/80 p-5 rounded-2xl border border-gray-900 text-center shadow-inner">
                      <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1">Modificando Stock para</p>
                      <p className="text-2xl font-black text-[#D4AF37] italic uppercase tracking-tighter">{selectedProduct?.name}</p>
                    </div>
                    {modalType === 'precio' ? (
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] text-3xl font-black opacity-50">$</span>
                        <input type="number" step="0.01" className="w-full bg-black border border-gray-800 p-8 pl-14 rounded-2xl font-mono text-5xl text-center text-[#D4AF37] focus:border-[#D4AF37] outline-none"
                          value={transaction.newPrice} onChange={(e) => setTransaction({...transaction, newPrice: e.target.value})} autoFocus />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="relative">
                          <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block text-center tracking-[0.2em]">Cantidad</label>
                          <input type="number" required className="w-full bg-black border border-gray-800 p-6 rounded-2xl font-mono text-4xl text-center focus:border-[#D4AF37] outline-none"
                            value={transaction.qty} onChange={(e) => setTransaction({...transaction, qty: e.target.value})} autoFocus />
                        </div>
                        <div className="relative">
                          <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block text-center tracking-[0.2em]">Entregado a / Origen</label>
                          <input type="text" required className="w-full bg-black border border-gray-800 p-5 rounded-2xl uppercase text-[12px] font-black text-center focus:border-[#D4AF37] outline-none tracking-widest"
                            value={transaction.recipient} onChange={(e) => setTransaction({...transaction, recipient: e.target.value})} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button disabled={isSubmitting} className="w-full bg-white text-black font-black py-6 uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-[#D4AF37] hover:text-white transition-all italic shadow-2xl disabled:opacity-50 active:scale-95">
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