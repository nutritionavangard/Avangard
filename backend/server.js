require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db');

const app = express();

// 1. Conectar a la BD
connectDB();

// 2. Middlewares Globales
// Simplificamos el CORS para evitar bloqueos por dominios mal escritos
app.use(cors({
    origin: '*', // Permite peticiones desde cualquier lugar (Ideal para pruebas en iPad)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Aumentamos el límite de tamaño para fotos de productos
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Avangard Server funcionando en puerto ${PORT}`);
});