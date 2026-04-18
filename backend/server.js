require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Necesario para las rutas de archivos
const connectDB = require('./config/db');

const app = express();

// 1. Conectar a la BD
connectDB();

// 2. Middlewares Globales
app.use(cors());
app.use(express.json());

// 3. Servir imágenes estáticas (Vital para ver las fotos de los productos)
// Esto permite que /uploads/imagen.jpg sea accesible desde el navegador
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Rutas (usando los nombres exactos de tu carpeta routes)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));

// 5. Manejo de rutas inexistentes (Opcional pero recomendado)
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada en el servidor de Avangard" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Avangard Server funcionando en el puerto ${PORT}`));