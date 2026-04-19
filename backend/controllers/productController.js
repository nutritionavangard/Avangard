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
        const { name, desc, description, line, price, image, qty, color, tagline } = req.body;

        // 1. Crear el producto
        const product = new Product({ 
            name, 
            tagline,
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

// @desc    Actualizar producto (Precio, Stock, Descripción, etc.)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        const { price, desc, description, name, color, line, qty, tagline } = req.body;
        
        const product = await Product.findById(req.params.id);

        if (product) {
            // Actualizamos solo los campos que vienen en el body, manteniendo lo anterior si no vienen
            product.name = name || product.name;
            product.tagline = tagline || product.tagline;
            product.price = price !== undefined ? price : product.price;
            product.qty = qty !== undefined ? qty : product.qty; // Agregado para sincronizar stock desde logística
            product.desc = desc || description || product.desc;
            product.color = color || product.color;
            product.line = line || product.line;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el producto', details: error.message });
    }
};