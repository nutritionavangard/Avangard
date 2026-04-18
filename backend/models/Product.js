const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true // Limpia espacios en blanco accidentales
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
        min: 0 // Evita precios negativos por error
    },
    image: { 
        type: String 
    }, 
    category: { 
        type: String, 
        default: 'Equine' 
    },
    // Stock actual disponible
    qty: { 
        type: Number, 
        default: 0,
        min: 0 
    },
    // Campo opcional para el color de la UI (dorado o azul)
    color: {
        type: String
    }
}, { 
    timestamps: true // Esto nos sirve para ordenar por "más nuevos" si queres
});

module.exports = mongoose.model('Product', productSchema);