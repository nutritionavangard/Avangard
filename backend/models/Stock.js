const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 0 },
    warehouse: { type: String, default: 'Principal' },
    movements: [{
        type: { type: String, enum: ['Ingreso', 'Egreso'], required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        user: { type: String }, // Nombre del operador que realizó el movimiento
        note: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);