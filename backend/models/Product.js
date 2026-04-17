const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    line: { type: String, enum: ['Professional', 'Performance'], required: true },
    price: { type: Number, required: true },
    image: { type: String }, // URL de la imagen (puedes usar las de las bolsas que generamos)
    category: { type: String, default: 'Equine' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);