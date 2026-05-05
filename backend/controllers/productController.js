const Product = require('../models/Product');
const Stock = require('../models/Stock');

// @desc    Obtener catálogo completo
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
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
        const { name, desc, description, line, price, image, qty, color, tagline } = req.body;

        const product = new Product({ 
            name, 
            tagline,
            desc: desc || description, 
            line, 
            price: Number(price) || 0,
            image,
            color, 
            qty: Number(qty) || 0 
        });

        const createdProduct = await product.save();

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
            product.name = name || product.name;
            product.tagline = tagline || product.tagline;
            
            if (price !== undefined) product.price = Number(price);
            if (qty !== undefined) product.qty = Number(qty);
            
            product.desc = desc || description || product.desc;
            product.color = color || product.color;
            product.line = line || product.line;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error("Error al actualizar:", error.message);
        res.status(400).json({ 
            message: 'Error al actualizar el producto', 
            details: error.message 
        });
    }
};

// @desc    Eliminar producto y su stock asociado
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        // 1. Buscamos y eliminamos el producto del catálogo
        const productDeleted = await Product.findByIdAndDelete(productId);

        if (!productDeleted) {
            return res.status(404).json({ message: 'El producto no existe en el catálogo' });
        }

        // 2. Eliminamos también el registro de Stock vinculado para evitar basura en la DB
        await Stock.findOneAndDelete({ product: productId });

        res.json({ 
            message: 'Producto y registros de stock eliminados correctamente',
            id: productId 
        });

    } catch (error) {
        console.error("Error al eliminar:", error.message);
        res.status(500).json({ 
            message: 'Error interno al intentar eliminar el producto',
            details: error.message 
        });
    }
};