require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const mongoose = require('mongoose');
const fs = require('fs'); // Añadido para verificar carpetas
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

// --- RUTA DE DIAGNÓSTICO ---
app.get('/api/test-db', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState;
        const statusMap = {
            0: "Desconectado",
            1: "Conectado",
            2: "Conectando",
            3: "Desconectando"
        };

        const collections = await mongoose.connection.db.listCollections().toArray();
        
        res.json({
            status: statusMap[dbStatus],
            databaseName: mongoose.connection.name,
            collections: collections.map(c => c.name),
            env: process.env.NODE_ENV,
            msg: "Si ves colecciones aquí, la conexión es exitosa.",
            checkPath: path.join(__dirname, 'dist') // Para ver dónde busca el servidor
        });
    } catch (err) {
        res.status(500).json({
            status: "Error de diagnóstico",
            error: err.message
        });
    }
});

// --- 4. RUTAS DE LA API ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));

// --- 5. CONFIGURACIÓN PARA RENDER (CON VERIFICACIÓN DE CARPETA) ---
const frontendPath = path.join(__dirname, 'dist'); 

if (fs.existsSync(frontendPath)) {
    // Si la carpeta existe, servimos el frontend normalmente
    app.use(express.static(frontendPath));
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    // Si la carpeta NO existe (lo que causaba el error ENOENT), evitamos el crash
    console.warn("⚠️ ADVERTENCIA: La carpeta 'dist' no fue encontrada en: " + frontendPath);
    app.get('/', (req, res) => {
        res.send('Servidor Avangard Activo. La API funciona, pero el Frontend no fue compilado correctamente en esta ruta.');
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