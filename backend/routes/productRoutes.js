const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// ==========================================
// RUTAS PARA EL CATÁLOGO Y LOGÍSTICA
// ==========================================

// @route   GET /api/products
// @desc    Obtener catálogo completo (Se usa en el Panel de Logística para ver stock)
// @access  Público (o Privado si prefieres agregar 'protect')
router.get('/', productController.getProducts);

// @route   POST /api/products
// @desc    Carga inicial de un producto y su stock
// @access  Privado (Solo Admin)
router.post('/', protect, productController.createProduct);

// @route   PUT /api/products/:id
// @desc    ACTUALIZAR PRODUCTO (Esta es la ruta que usará tu panel de Logística)
//          Sirve tanto para ajustar PRECIO como para subir/bajar STOCK (qty)
// @access  Privado (Solo Admin)
router.put('/:id', protect, productController.updateProduct);

// ==========================================
// HISTORIAL DE MOVIMIENTOS (Logs)
// ==========================================

// Si mantienes el historial de movimientos en un controlador aparte, 
// puedes importar esas funciones y agregarlas aquí también:
const { getMovementsByProduct } = require('../controllers/stockController');

// @route   GET /api/products/movements/:productId
// @desc    Ver el log de movimientos de un producto desde la DB
router.get('/movements/:productId', protect, getMovementsByProduct);

module.exports = router;