const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { getMovements } = require('../controllers/stockController'); 
const { protect } = require('../middleware/authMiddleware');

// ==========================================
// RUTAS PARA EL CATÁLOGO Y LOGÍSTICA
// ==========================================

/**
 * @route   GET /api/products
 * @desc    Obtener catálogo completo
 * @access  Public/Private (según tu config)
 */
router.get('/', productController.getProducts);

/**
 * @route   POST /api/products
 * @desc    Carga inicial de un producto y su stock inicial
 * @access  Private
 */
router.post('/', protect, productController.createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    ACTUALIZAR PRODUCTO (Precio y Stock)
 *          Dispara la lógica de sincronización con el modelo Stock
 * @access  Private
 */
router.put('/:id', protect, productController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    ELIMINAR PRODUCTO PERMANENTEMENTE
 *          Limpia el ítem del catálogo
 * @access  Private
 */
router.delete('/:id', protect, productController.deleteProduct);

// ==========================================
// HISTORIAL DE MOVIMIENTOS (Logs)
// ==========================================

/**
 * @route   GET /api/products/movements
 * @desc    Obtener todos los movimientos recientes para el panel lateral de Logística
 * @access  Private
 */
router.get('/movements', protect, getMovements);

module.exports = router;