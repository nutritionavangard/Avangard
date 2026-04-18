const Stock = require('../models/Stock');
const Product = require('../models/Product');

// @desc    Ver estado actual del depósito (Con datos del producto vinculados)
// @route   GET /api/stock
exports.getStockStatus = async (req, res) => {
    try {
        // Traemos el stock y populamos la info del producto (precio, línea, etc.)
        const stock = await Stock.find().populate('product');
        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: 'Error al consultar stock' });
    }
};

// @desc    Actualizar existencias (Ingreso/Egreso) con registro de destinatario
// @route   POST /api/stock/update
exports.updateStock = async (req, res) => {
    const { productId, type, amount, note, operator, recipient } = req.body;

    try {
        // 1. Buscamos el stock y el producto de forma simultánea
        let stock = await Stock.findOne({ product: productId });
        const productData = await Product.findById(productId);

        if (!productData) {
            return res.status(404).json({ message: 'Producto no encontrado en la base de datos' });
        }

        // Si por alguna razón el producto existe pero no tiene registro de stock, lo creamos
        if (!stock) {
            stock = new Stock({ 
                product: productId, 
                productName: productData.name,
                quantity: 0, 
                warehouse: 'San Miguel', 
                movements: [] 
            });
        }

        // 2. Lógica de cálculo (Ingreso o Egreso)
        const numericAmount = Number(amount);
        const actionType = type.toLowerCase();

        if (actionType === 'ingreso') {
            stock.quantity += numericAmount;
        } else if (actionType === 'entrega' || actionType === 'egreso') {
            if (stock.quantity < numericAmount) {
                return res.status(400).json({ message: 'Stock insuficiente para realizar la entrega' });
            }
            stock.quantity -= numericAmount;
        }

        // 3. Registro en historial de movimientos
        stock.movements.push({ 
            type, 
            amount: numericAmount, 
            note, 
            operator: operator || 'Admin', 
            recipient: recipient || 'Depósito Central',
            date: Date.now()
        });
        
        // 4. GUARDADO SINCRONIZADO: Actualizamos el 'qty' en el modelo Product
        // Esto es vital para que el Catálogo vea el cambio instantáneamente
        productData.qty = stock.quantity;
        
        await Promise.all([
            stock.save(),
            productData.save()
        ]);

        res.status(200).json({
            message: 'Movimiento registrado y catálogo actualizado',
            currentStock: stock.quantity,
            product: productData.name
        });
        
    } catch (error) {
        console.error("Error en updateStock:", error);
        res.status(400).json({ message: 'Error en la actualización de stock y sincronización' });
    }
};

// @desc    Obtener solo el historial de movimientos de un producto específico
// @route   GET /api/stock/movements/:productId
exports.getMovementsByProduct = async (req, res) => {
    try {
        const stock = await Stock.findOne({ product: req.params.productId });
        if (!stock) {
            return res.status(404).json({ message: 'Historial no encontrado' });
        }
        res.json(stock.movements);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener movimientos' });
    }
};