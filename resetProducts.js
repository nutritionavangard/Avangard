import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js'; // Ajusta la ruta según tu estructura

dotenv.config();

const resetData = async () => {
  try {
    // Conectar a MongoDB usando tu variable de entorno
    await mongoose.connect(process.env.MONGO_URI);
    console.log("--- Conectado a MongoDB para reseteo ---");

    // 1. Limpiar la colección actual
    await Product.deleteMany({});
    console.log("¡Colección de productos vaciada!");

    // 2. Datos iniciales limpios (puedes agregar los que necesites)
    const initialProducts = [
      {
        name: "Proteína Premium",
        line: "Premium",
        price: 45000,
        qty: 10,
        color: "#D4AF37",
        warehouse: "San Miguel"
      },
      {
        name: "Creatina Pro",
        line: "Professional",
        price: 32000,
        qty: 5,
        color: "#C0C0C0",
        warehouse: "San Miguel"
      }
    ];

    // 3. Insertar datos
    await Product.insertMany(initialProducts);
    console.log("¡Base de datos reseteada con éxito!");

    process.exit();
  } catch (error) {
    console.error("Error reseteando la base de datos:", error);
    process.exit(1);
  }
};

resetData();