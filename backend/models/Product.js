const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    // Eslogan corto (ej: "ENERGÍA EXPLOSIVA") usado en DetalleProducto.jsx
    tagline: {
        type: String,
        trim: true
    },
    // Usamos 'desc' para que coincida exactamente con la prop que espera tu ProductCard.jsx
    desc: { 
        type: String, 
        required: true 
    },
    line: { 
        type: String, 
        enum: ['Professional', 'Premium'], 
        required: true 
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 
    },
    image: { 
        type: String 
    }, 
    category: { 
        type: String, 
        default: 'Equine' 
    },
    // Stock actual disponible (Sincronizado con el modelo Stock)
    qty: { 
        type: Number, 
        default: 0,
        min: 0 
    },
    // Campo para el color de la UI (ej: #D4AF37 para Premium o #2563eb para Professional)
    color: {
        type: String
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);