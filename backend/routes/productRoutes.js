const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { getMovements } = require('../controllers/stockController'); // Traemos la función de logs
const { protect } = require('../middleware/authMiddleware');

// ==========================================
// RUTAS PARA EL CATÁLOGO Y LOGÍSTICA
// ==========================================

// Obtener catálogo completo
router.get('/', productController.getProducts);

// Carga inicial de un producto y su stock
router.post('/', protect, productController.createProduct);

// ACTUALIZAR PRODUCTO (Precio y Stock)
// Esta ruta dispara la lógica de sincronización con el modelo Stock que pusimos en el controller
router.put('/:id', protect, productController.updateProduct);

// ==========================================
// HISTORIAL DE MOVIMIENTOS (Logs)
// ==========================================

// @route   GET /api/products/movements
// @desc    Obtener todos los movimientos recientes para el panel lateral de Logística
router.get('/movements', protect, getMovements);

module.exports = router;