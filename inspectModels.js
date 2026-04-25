const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 1. Carga de variables de entorno (Asegurate que la ruta sea correcta)
dotenv.config(); 

const inspect = async () => {
    try {
        console.log('--- Iniciando Inspección de Base de Datos en la Nube ---');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB Atlas');

        // Inspeccionar colección de Productos
        const rawProducts = await mongoose.connection.db.collection('products').findOne({});
        console.log('\n--- ESTRUCTURA ACTUAL DE "PRODUCTS" EN LA NUBE ---');
        console.log(rawProducts ? JSON.stringify(rawProducts, null, 2) : '❌ Colección vacía');

        // Inspeccionar colección de Stock
        const rawStock = await mongoose.connection.db.collection('stocks').findOne({});
        console.log('\n--- ESTRUCTURA ACTUAL DE "STOCKS" EN LA NUBE ---');
        console.log(rawStock ? JSON.stringify(rawStock, null, 2) : '❌ Colección vacía');

        console.log('\n--- FIN DE LA INSPECCIÓN ---');
        process.exit();
    } catch (error) {
        console.error('❌ Error conectando a la nube:', error);
        process.exit(1);
    }
};

inspect();