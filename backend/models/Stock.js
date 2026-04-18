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
        default: 0,
        min: 0 // Evita que el stock total sea negativo
    },
    warehouse: { 
        type: String, 
        default: 'San Miguel' 
    },
    // Array de movimientos para el historial (Log)
    movements: [{
        type: { 
            type: String, 
            // Agregamos 'Entrega' para que coincida con el controlador de Logística
            enum: ['Ingreso', 'Egreso', 'Entrega'], 
            required: true 
        },
        amount: { 
            type: Number, 
            required: true,
            min: 1 
        },
        date: { 
            type: Date, 
            default: Date.now 
        },
        operator: { 
            type: String,
            default: 'Admin'
        }, 
        recipient: { 
            type: String,
            default: 'Depósito Central'
        }, 
        note: { 
            type: String 
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);