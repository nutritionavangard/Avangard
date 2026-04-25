import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PackagePlus, PackageMinus, History, X, ClipboardList, 
  Edit3, AlertCircle, PlusCircle, RefreshCw 
} from 'lucide-react';
import axios from 'axios';

const Logistica = () => {
  // Hardcode de la URL para evitar conflictos de variables de entorno
  const API_URL = 'https://avangard-mdpp.onrender.com';

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
    qty: '', recipient: '', newPrice: '', 
    name: CATALOGO_PRODUCTOS[0], line: 'Professional' 
  });
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrorStatus(null);
      // Aumentamos el timeout porque Render Free es lento para arrancar
      const response = await axios.get(`${API_URL}/api/products`, { timeout: 40000 });
      setStock(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorStatus("Sincronizando con la terminal... El servidor está tardando en responder.");
      // Reintento automático más suave
      setTimeout(fetchProducts, 8000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    localStorage.setItem('logistica_logs', JSON.stringify(logs));
  }, [logs]);

  const handleAction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let token = null;
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        token = JSON.parse(userInfo).token;
      }
    } catch (e) { console.error("Error sesión"); }

    const config = {
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
      timeout: 45000 // Tiempo extra para operaciones de escritura
    };

    try {
      let response;
      if (modalType === 'nuevo') {
        response = await axios.post(`${API_URL}/api/products`, {
          name: transaction.name, qty: parseInt(transaction.qty),
          line: transaction.line, price: parseFloat(transaction.newPrice),
          color: '#D4AF37'
        }, config);
      } else if (modalType === 'precio') {
        response = await axios.put(`${API_URL}/api/stock/price/${selectedProduct._id}`, 
          { price: parseFloat(transaction.newPrice) }, config);
      } else {
        response = await axios.post(`${API_URL}/api/stock/update`, { 
          productId: selectedProduct._id,
          type: modalType === 'ingreso' ? 'Ingreso' : 'Egreso',
          amount: parseInt(transaction.qty),
          recipient: transaction.recipient || 'Depósito Central'
        }, config);
      }

      // Si llegamos aquí, la operación fue exitosa
      const newLog = {
        id: Date.now(),
        date: new Date().toLocaleString('es-AR'),
        product: modalType === 'nuevo' ? transaction.name : selectedProduct.name,
        type: modalType === 'nuevo' ? 'ingreso' : modalType,
        qty: parseInt(transaction.qty),
        recipient: transaction.recipient || 'Depósito Central',
      };
      
      if (modalType !== 'precio') setLogs(prev => [newLog, ...prev]);

      await fetchProducts();
      setIsModalOpen(false);
      setTransaction({ qty: '', recipient: '', newPrice: '', name: CATALOGO_PRODUCTOS[0], line: 'Professional' });

    } catch (error) {
      // SOLO cerramos sesión si el error es explícitamente 401. 
      // Si el error es de conexión (Network Error / Timeout), avisamos pero NO echamos al usuario.
      if (error.response?.status === 401) {
        alert("La sesión expiró realmente. Por favor reingresá.");
        window.location.href = '/login';
      } else {
        alert("Error de red: El servidor de Render cerró la conexión. Intentá confirmar nuevamente en unos segundos.");
      }
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
    <div className="bg-[#050505] min-h-screen p-4 md:p-8 text-white pt-28 font-sans relative overflow-x-hidden">
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
              setTransaction({ ...transaction, qty: '', newPrice: '' });
              setIsModalOpen(true); 
            }}
            className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all flex items-center gap-3 italic shadow-xl"
          >
            <PlusCircle size={18}/> Alta de Ingreso
          </button>
        </header>

        {errorStatus && (
          <div className="bg-amber-950/20 border border-amber-900 text-amber-500 p-4 rounded-xl mb-8 flex items-center gap-3 animate-pulse">
            <RefreshCw size={18} className="animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest">{errorStatus}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">
              <ClipboardList size={14} /> Ítems en Depósito ({stock.length})
            </h2>
            
            {stock.map((item) => (
              <motion.div layoutId={`item-${item._id}`} key={item._id} 
                className="bg-[#0d0d0d] border border-gray-900 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center hover:border-gray-700 transition-all shadow-2xl"
              >
                <div className="flex flex-col gap-1 w-full md:w-auto mb-4 md:mb-0 text-center md:text-left">
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">{item.name}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
                    <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                      Línea {item.line} | <span className="text-green-500 font-mono">${item.price?.toLocaleString()}</span>
                    </p>
                    <button onClick={() => { setSelectedProduct(item); setModalType('precio'); setTransaction({...transaction, newPrice: item.price}); setIsModalOpen(true); }}
                      className="p-1.5 bg-gray-900 text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-black transition-all">
                      <Edit3 size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto">
                  <div className="text-right">
                    <span className={`block text-5xl font-mono font-black ${item.qty <= 5 ? 'text-red-600 animate-pulse' : 'text-white'}`}>{item.qty}</span>
                    <span className="text-[9px] uppercase text-gray-600 font-black">Stock</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedProduct(item); setModalType('ingreso'); setIsModalOpen(true); }} className="p-4 bg-green-950/20 text-green-500 hover:bg-green-600 hover:text-white transition-all rounded-xl border border-green-900/20"><PackagePlus size={22} /></button>
                    <button onClick={() => { setSelectedProduct(item); setModalType('entrega'); setIsModalOpen(true); }} className="p-4 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white transition-all rounded-xl border border-red-900/20"><PackageMinus size={22} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#080808] rounded-3xl border border-gray-900 p-6 h-[600px] flex flex-col sticky top-24">
            <h2 className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-8">
              <span className="flex items-center gap-2"><History size={14} /> Historial</span>
              {logs.length > 0 && <button onClick={() => setLogs([])} className="text-[8px] text-gray-700 hover:text-red-500 font-black">LIMPIAR</button>}
            </h2>
            <div className="space-y-6 overflow-y-auto pr-2 flex-1 custom-scrollbar">
              {logs.length === 0 && <p className="text-center text-gray-800 text-[10px] mt-20 font-black uppercase">Sin registros</p>}
              {logs.map((log) => (
                <div key={log.id} className="border-l border-gray-800 pl-4 py-1 relative">
                  <div className={`absolute -left-[2px] top-2 w-1 h-1 rounded-full ${log.type === 'ingreso' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-[8px] text-gray-600 font-mono">{log.date}</p>
                  <p className="text-[10px] font-black uppercase italic">{log.product}</p>
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0f0f0f] border border-gray-800 p-8 rounded-3xl w-full max-w-md relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={20}/></button>
              
              <h2 className={`text-2xl font-black uppercase mb-8 italic ${modalType === 'nuevo' || modalType === 'precio' ? 'text-[#D4AF37]' : modalType === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                {modalType === 'nuevo' ? 'Alta de Ingreso' : modalType === 'precio' ? 'Ajuste de Precio' : `Registro de ${modalType}`}
              </h2>

              <form onSubmit={handleAction} className="space-y-6">
                {modalType === 'nuevo' ? (
                  <div className="space-y-5">
                    <div>
                      <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block">Producto del Catálogo</label>
                      <select className="w-full bg-black border border-gray-800 p-4 rounded-xl text-white font-bold uppercase text-sm"
                        value={transaction.name} onChange={(e) => setTransaction({...transaction, name: e.target.value})}>
                        {CATALOGO_PRODUCTOS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block">Línea</label>
                        <select className="w-full bg-black border border-gray-800 p-4 rounded-xl text-xs font-bold uppercase"
                          value={transaction.line} onChange={(e) => setTransaction({...transaction, line: e.target.value})}>
                          <option value="Professional">Professional</option>
                          <option value="Premium">Premium</option>
                          <option value="Standard">Standard</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block">Precio ARS</label>
                        <input type="number" required className="w-full bg-black border border-gray-800 p-4 rounded-xl font-mono text-green-500"
                          value={transaction.newPrice} onChange={(e) => setTransaction({...transaction, newPrice: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black text-gray-600 mb-2 block">Stock que Ingresa</label>
                      <input type="number" required className="w-full bg-black border border-gray-800 p-4 rounded-xl font-mono text-2xl text-center"
                        value={transaction.qty} onChange={(e) => setTransaction({...transaction, qty: e.target.value})} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-black/50 p-4 rounded-xl border border-gray-900 text-center">
                      <p className="text-[10px] text-gray-600 uppercase font-black">Producto Seleccionado</p>
                      <p className="text-xl font-black text-[#D4AF37] italic uppercase">{selectedProduct?.name}</p>
                    </div>
                    {modalType === 'precio' ? (
                      <input type="number" step="0.01" className="w-full bg-black border border-gray-800 p-6 rounded-xl font-mono text-4xl text-center text-[#D4AF37]"
                        value={transaction.newPrice} onChange={(e) => setTransaction({...transaction, newPrice: e.target.value})} autoFocus />
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Cant." required className="w-full bg-black border border-gray-800 p-4 rounded-xl font-mono text-2xl text-center"
                          value={transaction.qty} onChange={(e) => setTransaction({...transaction, qty: e.target.value})} autoFocus />
                        <input type="text" placeholder="Origen/Dest." required className="w-full bg-black border border-gray-800 p-4 rounded-xl uppercase text-[10px] font-black"
                          value={transaction.recipient} onChange={(e) => setTransaction({...transaction, recipient: e.target.value})} />
                      </div>
                    )}
                  </div>
                )}

                <button disabled={isSubmitting} className="w-full bg-white text-black font-black py-5 uppercase tracking-widest rounded-2xl hover:bg-[#D4AF37] hover:text-white transition-all italic shadow-xl">
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