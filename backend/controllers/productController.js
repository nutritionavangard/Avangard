const Product = require('../models/Product');
const Stock = require('../models/Stock');

// @desc    Obtener catálogo completo
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        // Mantenemos el orden por línea para la jerarquía del catálogo
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
        // Desestructuramos ambos campos (desc y description) para evitar fallos de carga
        const { name, desc, description, line, price, image, qty, color } = req.body;

        // 1. Crear el producto
        // Usamos (desc || description) para que funcione sin importar cómo envíes el dato
        const product = new Product({ 
            name, 
            desc: desc || description, 
            line, 
            price, 
            image,
            color, 
            qty: qty || 0 
        });

        const createdProduct = await product.save();

        // 2. Crear automáticamente la entrada en el depósito (Stock)
        // Vinculado al depósito de San Miguel
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