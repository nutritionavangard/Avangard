const Stock = require('../models/Stock');
const Product = require('../models/Product');

// @desc    Obtener TODOS los movimientos para el panel lateral de Logística
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

        // Ordenamos por fecha más reciente
        allMovements.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        res.json(allMovements.slice(0, 50)); 
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener historial global' });
    }
};

// @desc    Actualizar existencias (Ingreso/Egreso) - VERSIÓN REFORZADA
exports.updateStock = async (req, res) => {
    const { productId, type, amount, recipient, note, operator } = req.body;

    try {
        // 1. Buscamos el producto (Nuestra fuente de verdad absoluta)
        const productData = await Product.findById(productId);
        if (!productData) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // 2. Buscamos o creamos el registro en la colección de Stock
        let stock = await Stock.findOne({ product: productId });
        if (!stock) {
            stock = new Stock({ 
                product: productId, 
                productName: productData.name,
                quantity: productData.qty || 0,
                warehouse: 'San Miguel', 
                movements: [] 
            });
        }

        const numericAmount = Math.abs(Number(amount));
        const actionType = type.toLowerCase();

        // LOG DE DIAGNÓSTICO: Revisa esto en la consola de Render si falla
        console.log(`[LOGISTICA] Producto: ${productData.name} | Disponible: ${productData.qty} | Pedido: ${numericAmount} | Tipo: ${actionType}`);

        // 3. Lógica de cálculo basada en la cantidad real del producto
        let nuevoSaldo = Number(productData.qty) || 0;

        if (actionType === 'ingreso') {
            nuevoSaldo += numericAmount;
        } else {
            // Verificamos contra el saldo real
            if (nuevoSaldo < numericAmount) {
                return res.status(400).json({ 
                    message: `Stock insuficiente. El sistema detecta ${nuevoSaldo} unidades.` 
                });
            }
            nuevoSaldo -= numericAmount;
        }

        // 4. Sincronización Mandataria
        productData.qty = nuevoSaldo;
        stock.quantity = nuevoSaldo;

        // 5. Registro en historial
        stock.movements.push({ 
            type: actionType === 'ingreso' ? 'Ingreso' : 'Entrega', 
            amount: numericAmount, 
            note: note || 'Actualización de sistema', 
            operator: operator || 'Admin Avangard', 
            recipient: recipient || 'Depósito Central',
            date: Date.now()
        });
        
        // Guardamos ambos documentos
        await Promise.all([stock.save(), productData.save()]);

        res.status(200).json({
            message: 'Movimiento registrado correctamente',
            currentStock: nuevoSaldo,
            product: productData.name
        });
        
    } catch (error) {
        console.error("🔴 ERROR CRÍTICO EN ACTUALIZACIÓN DE STOCK:", error);
        res.status(500).json({ message: 'Error interno en el servidor: ' + error.message });
    }
};

// @desc    Obtener historial de un producto específico
exports.getMovementsByProduct = async (req, res) => {
    try {
        const stock = await Stock.findOne({ product: req.params.productId });
        if (!stock) return res.status(404).json({ message: 'Sin historial disponible' });
        res.json(stock.movements);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener movimientos' });
    }
};