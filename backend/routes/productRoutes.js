const express = require('express');
const router = express.Router();
const { getStockStatus, updateStock } = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/stock
// @desc    Obtener el estado actual de todos los productos en depósito
// @access  Privado (Solo Admin)
router.get('/', protect, getStockStatus);

// @route   POST /api/stock/update
// @desc    Registrar un Ingreso o Egreso (Entrega) de mercadería
// @access  Privado (Solo Admin)
router.post('/update', protect, updateStock);

module.exports = router;