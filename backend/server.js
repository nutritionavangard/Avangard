require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcryptjs'); // Necesario para la contraseña
const connectDB = require('./config/db');

// Importamos el modelo de Usuario para el script de creación
const User = require('./models/User'); 

const app = express();

// 1. Conectar a la BD y crear Admin
connectDB().then(() => {
    // Script para forzar la creación del usuario administrador
    const createYourAdmin = async () => {
        try {
            const email = "nutritionavangard@gmail.com";
            const password = "Avangardnutrition2000!";
            
            // Buscamos si ya existe
            const userExists = await User.findOne({ email });
            
            if (!userExists) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                
                await User.create({
                    name: "Admin Avangard",
                    email: email,
                    password: hashedPassword,
                    isAdmin: true,
                    role: "admin" // Por si tu modelo usa 'role' en vez de 'isAdmin'
                });
                console.log("✅ USUARIO ADMIN CREADO: " + email);
            } else {
                // Si existe pero la carpeta estaba vacía, quizás es otra base de datos.
                // Forzamos la actualización de la contraseña por si acaso.
                const salt = await bcrypt.genSalt(10);
                userExists.password = await bcrypt.hash(password, salt);
                await userExists.save();
                console.log("ℹ️ Usuario actualizado con la nueva contraseña.");
            }
        } catch (error) {
            console.error("❌ Error en el script de usuario:", error.message);
        }
    };
    createYourAdmin();
});

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
            checkPath: path.join(__dirname, 'dist')
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

// --- 5. CONFIGURACIÓN PARA RENDER ---
const frontendPath = path.join(__dirname, 'dist'); 

if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    console.warn("⚠️ ADVERTENCIA: La carpeta 'dist' no fue encontrada.");
    app.get('/', (req, res) => {
        res.send('Servidor Avangard Activo. API lista.');
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