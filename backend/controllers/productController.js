const Product = require('../models/Product');
const Stock = require('../models/Stock');

// @desc    Obtener catálogo completo
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        // Ordena por línea (Premium primero) para mantener la jerarquía del catálogo
        const products = await Product.find().sort({ line: -1 }); 
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el catálogo' });
    }
};

// @desc    Crear nuevo producto (Carga inicial) + Inicializar Stock
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const { name, desc, line, price, image, qty, color } = req.body;

        // 1. Crear el producto
        // Se usa 'desc' para mantener consistencia con el componente ProductCard
        const product = new Product({ 
            name, 
            desc, 
            line, 
            price, 
            image,
            color, // Almacenamos el color para la UI (ej: #D4AF37)
            qty: qty || 0 
        });

        const createdProduct = await product.save();

        // 2. Crear automáticamente la entrada en el depósito (Stock)
        // Se vincula al depósito de San Miguel
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
        console.error("Error en createProduct:", error);
        res.status(400).json({ 
            message: 'Error en la carga del producto y stock',
            details: error.message 
        });
    }
};