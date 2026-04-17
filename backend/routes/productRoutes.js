const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// Público: Ver el catálogo
router.get('/', getProducts);

// Protegido: Solo vos podés cargar productos nuevos
router.post('/', protect, createProduct);

module.exports = router;