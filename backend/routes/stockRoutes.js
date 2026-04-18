const express = require('express');
const router = express.Router();
const { 
    getStockStatus, 
    updateStock, 
    getMovementsByProduct 
} = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/stock
// @desc    Obtener el estado actual de todos los productos en depósito
// @access  Privado (Solo Admin)
router.get('/', protect, getStockStatus);

// @route   POST /api/stock/update
// @desc    Registrar un Ingreso, Egreso o Entrega de mercadería
// @access  Privado (Solo Admin)
router.post('/update', protect, updateStock);

// @route   GET /api/stock/movements/:productId
// @desc    Obtener el historial de movimientos (Log) de un producto específico
// @access  Privado (Solo Admin)
router.get('/movements/:productId', protect, getMovementsByProduct);

module.exports = router;