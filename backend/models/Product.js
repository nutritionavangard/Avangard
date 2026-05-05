const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    tagline: {
        type: String,
        trim: true
    },
    // Quitamos el required para que no de error si va vacío
    desc: { 
        type: String,
        default: "" 
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
    qty: { 
        type: Number, 
        default: 0,
        min: 0 
    },
    color: {
        type: String
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);