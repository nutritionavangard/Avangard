const express = require('express');
const router = express.Router();
const { getStockStatus, updateStock } = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');

// Protegido: Ver y actualizar el stock del depósito
router.get('/', protect, getStockStatus);
router.post('/update', protect, updateStock);

module.exports = router;