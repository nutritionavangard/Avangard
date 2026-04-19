require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db');

const app = express();

// 1. Conectar a la BD
connectDB();

// 2. Middlewares Globales
// Configuración de CORS optimizada para desarrollo local y producción
app.use(cors());

// Aumentamos el límite de tamaño de JSON por si cargamos imágenes en Base64 o descripciones largas
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 3. Servir imágenes estáticas
// Esto permite que las fotos en /uploads sean accesibles desde el frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Rutas (Respetando el orden y nombres de archivos acordados)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));

// 5. Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada en el servidor de Avangard" });
});

// 6. Manejo de errores global (Para que el servidor no se caiga ante un error inesperado)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno en el servidor de Avangard' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Avangard Server funcionando en el puerto ${PORT}`);
    console.log(`📂 Imágenes servidas en: http://localhost:${PORT}/uploads`);
});