require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Stock = require('./models/Stock');
const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();

        // 1. Limpiar datos existentes para evitar duplicados
        await Product.deleteMany();
        await Stock.deleteMany();
        console.log('🗑️ Base de datos limpia');

        // 2. Definir productos iniciales de Avangard
        const productos = [
            {
                name: "Professional Elite",
                description: "Suplemento de alta densidad energética para caballos en plena temporada de competencia.",
                line: "Professional (Azul)",
                price: 85000,
                image: "/assets/bolsa-azul.png"
            },
            {
                name: "Performance Elite",
                description: "Equilibrio nutricional óptimo para entrenamiento y mantenimiento de condición corporal.",
                line: "Performance (Verde)",
                price: 72000,
                image: "/assets/bolsa-verde.png"
            }
        ];

        // 3. Insertar productos
        const creados = await Product.insertMany(productos);
        console.log('✅ Productos de Avangard creados');

        // 4. Crear registro de stock inicial para cada producto
        const stockInicial = creados.map(p => ({
            product: p._id,
            quantity: 100, // Empezamos con 100 bolsas de cada una
            warehouse: "San Miguel",
            movements: [{
                type: 'Ingreso',
                amount: 100,
                note: 'Carga inicial del sistema',
                user: 'Sistema'
            }]
        }));

        await Stock.insertMany(stockInicial);
        console.log('📦 Stock inicial cargado (100 unidades c/u)');

        console.log('✨ Proceso de Seed finalizado con éxito');
        process.exit();
    } catch (error) {
        console.error(`❌ Error en el seed: ${error.message}`);
        process.exit(1);
    }
};

seedData();