const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    // Referencia al producto para cálculos técnicos
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    // Nombre del producto (redundancia útil para mostrar el Log sin hacer populate)
    productName: { 
        type: String, 
        required: true 
    },
    // Cantidad total actual en este registro
    quantity: { 
        type: Number, 
        default: 0 
    },
    warehouse: { 
        type: String, 
        default: 'San Miguel' 
    },
    // Array de movimientos para el historial (Log)
    movements: [{
        type: { 
            type: String, 
            enum: ['Ingreso', 'Egreso'], 
            required: true 
        },
        amount: { 
            type: Number, 
            required: true 
        },
        date: { 
            type: Date, 
            default: Date.now 
        },
        operator: { 
            type: String 
        }, // El Admin que lo registra (vos)
        recipient: { 
            type: String 
        }, // A quién se le entrega o quién trae la mercadería
        note: { 
            type: String 
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);