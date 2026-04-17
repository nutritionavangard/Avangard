import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/logistica');
    } catch (error) {
      alert("Error en las credenciales. Acceso denegado.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#0f0f0f] p-10 rounded-2xl border border-gray-900 shadow-2xl relative overflow-hidden"
      >
        {/* Decoración de fondo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37]/10 blur-[80px] rounded-full"></div>

        <div className="relative z-10">
          <div className="w-12 h-12 bg-[#D4AF37]/20 flex items-center justify-center rounded-lg text-[#D4AF37] mb-6">
            <Lock size={24} />
          </div>
          
          <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-tighter">Acceso <span className="text-[#D4AF37]">Admin</span></h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Panel de Logística Avangard</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-600 mb-2 ml-1">Email Corporativo</label>
              <input 
                type="email" 
                required
                className="w-full p-4 rounded-lg text-white"
                placeholder="admin@avangard.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-600 mb-2 ml-1">Contraseña</label>
              <input 
                type="password" 
                required
                className="w-full p-4 rounded-lg text-white"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button className="w-full bg-white text-black font-black py-4 rounded-lg uppercase tracking-widest hover:bg-[#D4AF37] transition-all mt-6">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;