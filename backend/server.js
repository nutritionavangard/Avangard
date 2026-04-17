require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Conectar a la BD
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas (usando los nombres exactos de tu carpeta routes)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Avangard Server en puerto ${PORT}`));