const Stock = require('../models/Stock');

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

// @desc    Actualizar existencias (Ingreso/Egreso)
// @route   POST /api/stock/update
exports.updateStock = async (req, res) => {
    const { productId, type, amount, note, user } = req.body;

    try {
        let stock = await Stock.findOne({ product: productId });

        if (!stock) {
            stock = new Stock({ product: productId, quantity: 0, movements: [] });
        }

        // Lógica de cálculo
        if (type === 'Ingreso') {
            stock.quantity += Number(amount);
        } else if (type === 'Egreso') {
            if (stock.quantity < amount) {
                return res.status(400).json({ message: 'Stock insuficiente' });
            }
            stock.quantity -= Number(amount);
        }

        // Historial de auditoría
        stock.movements.push({ type, amount, note, user });
        
        await stock.save();
        res.status(200).json(stock);
    } catch (error) {
        res.status(400).json({ message: 'Error en la actualización' });
    }
};