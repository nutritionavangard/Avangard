const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Stock = require('./models/Stock');

dotenv.config();

const products = [
  {
    name: "BAL. POLO",
    tagline: "ENERGÍA EXPLOSIVA",
    desc: "Provee niveles de energía balanceados a partir de fibra degradable, almidón y lípidos.",
    line: "Premium",
    price: 0,
    qty: 0,
    color: "#D4AF37"
  },
  {
    name: "BAL. EQUITACION",
    tagline: "EQUILIBRIO, CONCENTRACIÓN Y POTENCIA",
    desc: "Diseñado para caballos de salto y adiestramiento. Liberación controlada de energía.",
    line: "Premium",
    price: 0,
    qty: 0,
    color: "#D4AF37"
  },
  {
    name: "BAL. PSC",
    tagline: "MAXIMIZA EL POTENCIAL",
    desc: "Proteína de muy alto valor biológico para un adecuado funcionamiento muscular.",
    line: "Premium",
    price: 0,
    qty: 0,
    color: "#D4AF37"
  },
  {
    name: "BAL. YEGUAS",
    tagline: "NUTRICIÓN GESTACIONAL",
    desc: "Cubre los requerimientos de las yeguas durante la gestación y la lactancia.",
    line: "Premium",
    price: 0,
    qty: 0,
    color: "#D4AF37"
  },
  {
    name: "BAL. POTRILLOS",
    tagline: "DESARROLLO ESQUELÉTICO",
    desc: "Asegura el desarrollo esquelético y muscular del potrillo para alta competencia.",
    line: "Premium",
    price: 0,
    qty: 0,
    color: "#D4AF37"
  },
  {
    name: "BAL. MANTENIMIENTO",
    tagline: "EQUILIBRIO DIARIO",
    desc: "Cubre los requerimientos de mantenimiento del caballo adulto.",
    line: "Professional",
    price: 0,
    qty: 0,
    color: "#2563eb"
  },
  {
    name: "BAL. DEPORTE",
    tagline: "RENDIMIENTO CONSTANTE",
    desc: "Para caballos en entrenamiento y competencia constante.",
    line: "Professional",
    price: 0,
    qty: 0,
    color: "#2563eb"
  }
];

const importData = async () => {
  try {
    // Usamos el URI de tu .env
    await mongoose.connect(process.env.MONGO_URI);
    
    // Limpieza de colecciones para evitar duplicados
    await Product.deleteMany();
    await Stock.deleteMany();

    for (let p of products) {
      // 1. Creamos el producto en la base de datos
      const createdProduct = await Product.create(p);
      
      // 2. Creamos su registro de Stock vinculado
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

    console.log('✅ ¡Catálogo BAL e Inventario inicial cargados con éxito!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error al importar datos: ${error.message}`);
    process.exit(1);
  }
};

importData();