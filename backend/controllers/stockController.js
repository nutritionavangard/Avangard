const Stock = require('../models/Stock');
const Product = require('../models/Product');

// @desc    Obtener TODOS los movimientos para el panel lateral de Logística
// @route   GET /api/products/movements (vía productRoutes)
exports.getMovements = async (req, res) => {
    try {
        const stocks = await Stock.find();
        // Extraemos todos los movimientos de todos los productos y los aplanamos en una sola lista
        let allMovements = [];
        stocks.forEach(s => {
            const productMovements = s.movements.map(m => ({
                id: m._id,
                product: s.productName,
                type: m.type.toLowerCase() === 'ingreso' ? 'ingreso' : 'entrega',
                qty: m.amount,
                date: new Date(m.date).toLocaleString('es-AR'),
                recipient: m.recipient || 'Depósito Central'
            }));
            allMovements = [...allMovements, ...productMovements];
        });

        // Ordenamos por fecha (más reciente primero)
        allMovements.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        res.json(allMovements.slice(0, 50)); // Enviamos los últimos 50 logs
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener historial global' });
    }
};

// @desc    Actualizar existencias (Ingreso/Egreso)
// @route   POST /api/stock/update
exports.updateStock = async (req, res) => {
    const { productId, type, amount, note, operator, recipient } = req.body;

    try {
        let stock = await Stock.findOne({ product: productId });
        const productData = await Product.findById(productId);

        if (!productData) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (!stock) {
            stock = new Stock({ 
                product: productId, 
                productName: productData.name,
                quantity: 0, 
                warehouse: 'San Miguel', 
                movements: [] 
            });
        }

        const numericAmount = Number(amount);
        const actionType = type.toLowerCase();

        if (actionType === 'ingreso') {
            stock.quantity += numericAmount;
        } else {
            if (stock.quantity < numericAmount) {
                return res.status(400).json({ message: 'Stock insuficiente' });
            }
            stock.quantity -= numericAmount;
        }

        // Registro en historial
        stock.movements.push({ 
            type: actionType === 'ingreso' ? 'Ingreso' : 'Entrega', 
            amount: numericAmount, 
            note: note || 'Actualización manual', 
            operator: operator || (req.user ? req.user.name : 'Admin'), 
            recipient: recipient || 'Depósito Central',
            date: Date.now()
        });
        
        // Sincronización con el modelo Product
        productData.qty = stock.quantity;
        
        await Promise.all([stock.save(), productData.save()]);

        res.status(200).json({
            message: 'Movimiento registrado',
            currentStock: stock.quantity,
            product: productData.name
        });
        
    } catch (error) {
        res.status(400).json({ message: 'Error en la sincronización' });
    }
};

// @desc    Obtener historial de un producto específico
exports.getMovementsByProduct = async (req, res) => {
    try {
        const stock = await Stock.findOne({ product: req.params.productId });
        if (!stock) return res.status(404).json({ message: 'Sin historial' });
        res.json(stock.movements);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener movimientos' });
    }
};