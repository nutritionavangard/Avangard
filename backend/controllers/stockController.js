const Stock = require('../models/Stock');
const Product = require('../models/Product');

// @desc    Obtener TODOS los movimientos para el panel lateral de Logística
// @route   GET /api/products/movements (vía productRoutes)
exports.getMovements = async (req, res) => {
    try {
        const stocks = await Stock.find();
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

        // Ordenamos por fecha real (objeto Date) antes de convertir a string
        allMovements.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        res.json(allMovements.slice(0, 50)); 
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener historial global' });
    }
};

// @desc    Actualizar existencias (Ingreso/Egreso)
// @route   POST /api/stock/update
exports.updateStock = async (req, res) => {
    const { productId, type, amount, note, operator, recipient } = req.body;

    try {
        // 1. Buscamos el producto y su registro de stock
        let stock = await Stock.findOne({ product: productId });
        const productData = await Product.findById(productId);

        if (!productData) {
            return res.status(404).json({ message: 'Producto no encontrado en la base de datos' });
        }

        // 2. Si no existe el registro en la colección Stock, lo creamos
        // IMPORTANTE: Sincronizamos la cantidad inicial con lo que diga el Producto
        if (!stock) {
            stock = new Stock({ 
                product: productId, 
                productName: productData.name,
                quantity: productData.qty || 0, // Tomamos lo que ya tenga el producto
                warehouse: 'San Miguel', 
                movements: [] 
            });
        }

        const numericAmount = Math.abs(Number(amount)); // Aseguramos que sea número positivo
        const actionType = type.toLowerCase();

        // 3. Lógica de Stock
        if (actionType === 'ingreso') {
            stock.quantity += numericAmount;
        } else {
            // Verificación de seguridad: compararlo contra el stock actual
            // Usamos el valor más alto entre stock.quantity y productData.qty para evitar bloqueos falsos
            const disponible = Math.max(stock.quantity, productData.qty);
            
            if (disponible < numericAmount) {
                return res.status(400).json({ 
                    message: `Stock insuficiente. Disponible: ${disponible} unidades.` 
                });
            }
            stock.quantity -= numericAmount;
        }

        // 4. Registro en historial
        stock.movements.push({ 
            type: actionType === 'ingreso' ? 'Ingreso' : 'Entrega', 
            amount: numericAmount, 
            note: note || 'Actualización manual', 
            operator: operator || (req.user ? req.user.name : 'Admin'), 
            recipient: recipient || 'Depósito Central',
            date: Date.now()
        });
        
        // 5. Sincronización TOTAL: igualamos ambos modelos
        productData.qty = stock.quantity;
        
        await Promise.all([stock.save(), productData.save()]);

        res.status(200).json({
            message: 'Movimiento registrado correctamente',
            currentStock: stock.quantity,
            product: productData.name
        });
        
    } catch (error) {
        console.error("Error en updateStock:", error);
        res.status(400).json({ message: 'Error en la sincronización de datos' });
    }
};

// @desc    Obtener historial de un producto específico
exports.getMovementsByProduct = async (req, res) => {
    try {
        const stock = await Stock.findOne({ product: req.params.productId });
        if (!stock) return res.status(404).json({ message: 'Sin historial para este producto' });
        res.json(stock.movements);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener movimientos' });
    }
};