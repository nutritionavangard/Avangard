require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db');

const app = express();

// 1. Conectar a la BD
connectDB();

// 2. Middlewares Globales
// Configuración de CORS blindada
const allowedOrigins = [
  'https://avangard-nutrition.onrender.com', // Tu sitio estático
  'http://localhost:5173',                   // Vite local
  'http://localhost:3000'                    // Alternativo local
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como apps móviles o curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'El protocolo CORS de Avangard no permite acceso desde este origen.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Aumentamos el límite de tamaño de JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 3. Servir imágenes estáticas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));

// 5. Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada en el servidor de Avangard" });
});

// 6. Manejo de errores global
app.use((err, req, res, next) => {
    console.error("🔴 SERVER ERROR:", err.stack);
    res.status(500).json({ 
        message: 'Error interno en el servidor de Avangard',
        error: process.env.NODE_ENV === 'development' ? err.message : {} 
    });
});

// IMPORTANTE: En Render, process.env.PORT es dinámico, no siempre es 5000 o 10000.
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Avangard Server funcionando en puerto ${PORT}`);
});