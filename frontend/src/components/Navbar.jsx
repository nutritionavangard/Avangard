import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Mail, Shield, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/', icon: <Home size={18} /> },
    { name: 'Catálogo', path: '/catalogo', icon: <Package size={18} /> },
    { name: 'Contacto', path: '/contacto', icon: <Mail size={18} /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
          AVANGARD <span className="text-[#D4AF37]">EQUINE</span>
        </Link>

        {/* LINKS */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] transition-colors ${
                location.pathname === link.path ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.icon} {link.name}
            </Link>
          ))}
          
          {/* BOTÓN LOGÍSTICA (Acceso Panel) */}
          <Link 
            to="/login" 
            className="ml-4 p-2 bg-gray-900 rounded-full text-gray-400 hover:text-[#D4AF37] hover:bg-gray-800 transition-all"
            title="Acceso Administración"
          >
            <Shield size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;