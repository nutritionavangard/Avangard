require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const mongoose = require('mongoose'); // Importante para el diagnóstico
const connectDB = require('./config/db');

const app = express();

// 1. Conectar a la BD
connectDB();

// 2. Middlewares Globales
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 3. Servir imágenes estáticas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- RUTA DE DIAGNÓSTICO (Para verificar la base de datos) ---
app.get('/api/test-db', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState;
        const statusMap = {
            0: "Desconectado",
            1: "Conectado",
            2: "Conectando",
            3: "Desconectando"
        };

        // Intentamos listar las colecciones reales en Atlas
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        res.json({
            status: statusMap[dbStatus],
            databaseName: mongoose.connection.name,
            collections: collections.map(c => c.name),
            env: process.env.NODE_ENV,
            msg: "Si ves colecciones aquí, la conexión es exitosa."
        });
    } catch (err) {
        res.status(500).json({
            status: "Error de diagnóstico",
            error: err.message,
            stack: err.stack
        });
    }
});

// --- 4. RUTAS DE LA API ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));

// --- 5. CONFIGURACIÓN PARA RENDER (Frontend + Backend unificados) ---
if (process.env.NODE_ENV === 'production' || true) {
    const frontendPath = path.join(__dirname, 'dist'); 
    app.use(express.static(frontendPath));

    // Regex para no pisar las rutas de la API
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

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