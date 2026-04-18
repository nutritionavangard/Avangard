const Product = require('../models/Product');
const Stock = require('../models/Stock');

// @desc    Obtener catálogo completo
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ line: -1 }); // Ordena por línea (Premium primero)
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el catálogo' });
    }
};

// @desc    Crear nuevo producto (Carga inicial) + Inicializar Stock
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const { name, description, line, price, image, qty } = req.body;

        // 1. Crear el producto
        const product = new Product({ 
            name, 
            description, 
            line, 
            price, 
            image,
            qty: qty || 0 // Si no mandas cantidad, empieza en 0
        });

        const createdProduct = await product.save();

        // 2. Crear automáticamente la entrada en el depósito (Stock)
        const initialStock = new Stock({
            product: createdProduct._id,
            productName: createdProduct.name,
            quantity: createdProduct.qty,
            warehouse: 'San Miguel',
            movements: [{
                type: 'Ingreso',
                amount: createdProduct.qty,
                operator: 'Sistema',
                note: 'Carga inicial de producto'
            }]
        });

        await initialStock.save();

        res.status(201).json({
            message: "Producto y Stock inicializados correctamente",
            product: createdProduct
        });

    } catch (error) {
        res.status(400).json({ message: 'Error en la carga del producto y stock' });
    }
};