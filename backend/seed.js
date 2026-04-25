const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Stock = require('./models/Stock');

dotenv.config();

const products = [
  {
    name: "Suplemento Test Pro",
    tagline: "ENERGÍA EXPLOSIVA",
    desc: "Descripción de prueba para línea Professional",
    line: "Professional",
    price: 15000,
    qty: 10,
    color: "#2563eb"
  },
  {
    name: "Suplemento Test Premium",
    tagline: "MÁXIMO RENDIMIENTO",
    desc: "Descripción de prueba para línea Premium",
    line: "Premium",
    price: 25000,
    qty: 5,
    color: "#D4AF37"
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Limpiamos por si quedó algo
    await Product.deleteMany();
    await Stock.deleteMany();

    for (let p of products) {
      // 1. Creamos el producto
      const createdProduct = await Product.create(p);
      
      // 2. Creamos su espejo en la tabla de Stock
      await Stock.create({
        product: createdProduct._id,
        productName: createdProduct.name,
        quantity: createdProduct.qty,
        warehouse: 'San Miguel',
        movements: [{
          type: 'Ingreso',
          amount: createdProduct.qty,
          operator: 'Sistema',
          note: 'Carga inicial por Seed'
        }]
      });
    }

    console.log('✅ ¡Datos importados con éxito!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();