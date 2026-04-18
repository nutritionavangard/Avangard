import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, MapPin } from 'lucide-react';

const Contacto = () => {
  // Estado para capturar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    producto: 'BAL. POLO', // Opción por defecto
    mensaje: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleWhatsAppSend = (e) => {
    e.preventDefault();
    
    // Configuración del mensaje de WhatsApp
    const nroTelefono = "5491140411539";
    const texto = `Hola Avangard! Mi nombre es ${formData.nombre}.%0A%0A*Pedido:* ${formData.producto}%0A*Mensaje:* ${formData.mensaje}`;
    
    // Abrir WhatsApp en una pestaña nueva
    window.open(`https://wa.me/${nroTelefono}?text=${texto}`, '_blank');
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-8 text-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        
        {/* INFO DE CONTACTO */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-[#D4AF37] font-bold uppercase tracking-widest mb-4 text-sm">Contáctanos</h2>
          <h1 className="text-6xl font-black mb-8 tracking-tighter uppercase">
            Haz tu <br /> <span className="text-blue-600">Pedido</span>
          </h1>
          
          <div className="space-y-6 text-gray-400">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-900 rounded-full text-[#D4AF37]"><Phone size={24} /></div>
              <p className="font-mono text-lg">+54 9 11 4041-1539</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-900 rounded-full text-blue-600"><MapPin size={24} /></div>
              <p>San Miguel, Buenos Aires, Argentina</p>
            </div>
          </div>
        </motion.div>

        {/* FORMULARIO */}
        <motion.form 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleWhatsAppSend}
          className="bg-[#0f0f0f] p-10 rounded-2xl border border-gray-900 space-y-6"
        >
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Nombre Completo</label>
            <input 
              type="text" 
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Juan Pérez"
              className="w-full bg-black border border-gray-800 p-4 rounded focus:border-[#D4AF37] outline-none transition-all text-white" 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Producto Interesado</label>
            <select 
              name="producto"
              value={formData.producto}
              onChange={handleInputChange}
              className="w-full bg-black border border-gray-800 p-4 rounded focus:border-[#D4AF37] outline-none transition-all text-gray-400"
            >
              {/* Línea Premium */}
              <option value="BAL. POLO">BAL. POLO (Premium)</option>
              <option value="BAL. PSC">BAL. PSC (Premium)</option>
              <option value="BAL. YEGUAS">BAL. YEGUAS (Premium)</option>
              <option value="BAL. POTRILLOS">BAL. POTRILLOS (Premium)</option>
              {/* Línea Professional */}
              <option value="BAL. MANTENIMIENTO">BAL. MANTENIMIENTO (Professional)</option>
              <option value="BAL. DEPORTE">BAL. DEPORTE (Professional)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Mensaje o Cantidad</label>
            <textarea 
              name="mensaje"
              value={formData.mensaje}
              onChange={handleInputChange}
              placeholder="Escribe aquí los detalles de tu consulta o pedido..."
              className="w-full bg-black border border-gray-800 p-4 rounded h-32 focus:border-[#D4AF37] outline-none transition-all text-white"
            ></textarea>
          </div>
          <button 
            type="submit"
            className="w-full bg-white text-black font-black py-4 uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all flex justify-center items-center gap-2"
          >
            Enviar Pedido <Send size={18} />
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Contacto;