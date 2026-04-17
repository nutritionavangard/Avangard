const Product = require('../models/Product');

// @desc    Obtener catálogo completo
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el catálogo' });
    }
};

// @desc    Crear nuevo producto (Carga inicial)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const { name, description, line, price, image } = req.body;
        const product = new Product({ name, description, line, price, image });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error en la carga del producto' });
    }
};