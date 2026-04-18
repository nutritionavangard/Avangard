const Stock = require('../models/Stock');
const Product = require('../models/Product');

// @desc    Ver estado actual del depósito
// @route   GET /api/stock
exports.getStockStatus = async (req, res) => {
    try {
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
        // Buscamos el stock y el producto para obtener el nombre
        let stock = await Stock.findOne({ product: productId });
        const productData = await Product.findById(productId);

        if (!productData) {
            return res.status(404).json({ message: 'Producto no encontrado en la base de datos' });
        }

        if (!stock) {
            stock = new Stock({ 
                product: productId, 
                productName: productData.name, // Guardamos el nombre del producto
                quantity: 0, 
                movements: [] 
            });
        }

        // Lógica de cálculo (Ingreso o Egreso)
        const numericAmount = Number(amount);
        if (type === 'Ingreso') {
            stock.quantity += numericAmount;
        } else if (type === 'Egreso') {
            if (stock.quantity < numericAmount) {
                return res.status(400).json({ message: 'Stock insuficiente para realizar la entrega' });
            }
            stock.quantity -= numericAmount;
        }

        // Historial de auditoría detallado
        stock.movements.push({ 
            type, 
            amount: numericAmount, 
            note, 
            operator,   // Quién registra (Admin)
            recipient,  // Quién recibe o entrega la mercadería
            date: Date.now()
        });
        
        await stock.save();
        res.status(200).json({
            message: 'Movimiento registrado con éxito',
            currentStock: stock.quantity,
            lastMovement: stock.movements[stock.movements.length - 1]
        });
    } catch (error) {
        res.status(400).json({ message: 'Error en la actualización de stock' });
    }
};