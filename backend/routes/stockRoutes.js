const express = require('express');
const router = express.Router();
const { 
    updateStock, 
    getMovementsByProduct,
    getMovements // Agregada esta que es la que exporta tu controller
} = require('../controllers/stockController');

// Importamos el controlador de productos para poder actualizar el precio
const { updateProduct } = require('../controllers/productController'); 
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/stock/movements
// @desc    Obtener el historial global de movimientos (para el panel lateral)
// @access  Privado
router.get('/movements', protect, getMovements);

// @route   POST /api/stock/update
// @desc    Registrar un Ingreso o Egreso (Entrega) de mercadería
// @access  Privado
router.post('/update', protect, updateStock);

// @route   GET /api/stock/movements/:productId
// @desc    Obtener el historial de movimientos de un producto específico
// @access  Privado
router.get('/movements/:productId', protect, getMovementsByProduct);

// --- NUEVA RUTA PARA EL PRECIO ---
// @route   PUT /api/stock/price/:id
// @desc    Actualizar el precio de un producto desde el panel de logística
router.put('/price/:id', protect, updateProduct);

module.exports = router;