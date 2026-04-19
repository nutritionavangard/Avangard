import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Importación de imágenes - Línea Premium
import imgEquitacion from '../assets/Premium BAL Equitacion.png';
import imgPolo from '../assets/Premium BAL POLO.png';
import imgPotrillos from '../assets/Premium BAL Potrillos.png';
import imgPSC from '../assets/Premium BAL PSC.png';
import imgVigor from '../assets/Premium BAL Vigor.png';
import imgYeguas from '../assets/Premium BAL Yeguas.png';

// Importación de imágenes - Línea Professional
import imgMantenimiento from '../assets/Professional BAL Mantenimiento.png';
import imgDeporte from '../assets/Professional BAL Deporte.png';

const productosData = {
  "polo": { 
    name: "BAL. POLO", 
    img: imgPolo, 
    color: "#D4AF37", 
    tagline: "ENERGÍA EXPLOSIVA",
    desc: "Este alimento balanceado está elaborado con materias primas de primera calidad. Provee niveles de energía balanceados a partir de fibra degradable, almidón y lípidos; y cantidades de proteína de muy alto valor biológico para un adecuado funcionamiento de las masas musculares. Proporciona minerales y vitaminas necesarios para un excelente rendimiento deportivo.",
    recomendacion: "Se recomienda utilizar a un nivel del 0,5 al 1% del peso vivo, repartido en dos comidas después del consumo de heno.",
    nutricion: [
      { label: "Proteína", value: "13 %" }, { label: "Energía Digestible", value: "2.900 Kcal" },
      { label: "Humedad", value: "10 %" }, { label: "Calcio", value: "0,70 %" },
      { label: "Fósforo", value: "0,60 %" }, { label: "Sodio", value: "0,30 %" },
      { label: "Magnesio", value: "0,20 %" }, { label: "Hierro", value: "80 mg" },
      { label: "Cobre", value: "12 mg" }, { label: "Zinc", value: "50 mg" },
      { label: "Manganeso", value: "45 mg" }, { label: "Iodo", value: "0,8 mg" },
      { label: "Cobalto", value: "0,2 mg" }, { label: "Selenio", value: "0,2 mg" },
      { label: "Beta caroteno", value: "12,8 mg" }, { label: "Vitamina A", value: "7.200 UI" },
      { label: "Vitamina D3", value: "1.400 UI" }, { label: "Vitamina E", value: "285 UI" },
      { label: "Biotina", value: "3,3 mg" }, { label: "Colina", value: "1.183,0 mg" },
      { label: "Ác. Fólico", value: "1,8 mg" }, { label: "Niacina", value: "81,4 mg" },
      { label: "Ác. Pantoténico", value: "27,1 mg" }, { label: "Riboflavina", value: "7,8 mg" },
      { label: "Tiamina", value: "7,4 mg" }, { label: "Vitamina B6", value: "9,0 mg" },
      { label: "Vitamina B12", value: "322,0 mg" }, { label: "Vitamina C", value: "140,0 mg" }
    ],
    aminoacidos: [
      { label: "Arginina", value: "0,94" }, { label: "Histidina", value: "0,38" },
      { label: "Isoleucina", value: "0,56" }, { label: "Leucina", value: "1,13" },
      { label: "Lisina", value: "0,71" }, { label: "Metionina", value: "0,24" },
      { label: "Cistina", value: "0,31" }, { label: "Fenilalanina", value: "0,71" },
      { label: "Tirosina", value: "0,48" }, { label: "Valina", value: "0,54" }
    ],
    ingredientes: "maíz, avena, cebada, pellet de soja, poroto de soja desactivado, afrechillo de trigo, harina de alfalfa, carbonato de calcio, fosfato mono-bicálcico, cloruro de sodio, óxido de magnesio, microminerales, vitaminas, aminoácidos, antioxidantes, levaduras, secuestrante de micotoxinas y saborizantes."
  },
  "equitacion": { 
    name: "BAL. EQUITACION", 
    img: imgEquitacion, 
    color: "#D4AF37", 
    tagline: "CONCENTRACIÓN Y POTENCIA",
    desc: "Este alimento balanceado está elaborado con materias primas de primera calidad. Provee niveles de energía balanceados a partir de fibra degradable, almidón y lípidos; y cantidades de proteína de muy alto valor biológico para un adecuado funcionamiento de las masas musculares. Proporciona minerales y vitaminas necesarios para un excelente rendimiento deportivo.",
    recomendacion: "Se recomienda utilizar a un nivel del 0,5 al 1% del peso vivo, repartido en dos comidas después del consumo de heno.",
    nutricion: [
      { label: "Proteína", value: "13 %" }, { label: "Energía Digestible", value: "2.900 Kcal" },
      { label: "Humedad", value: "10 %" }, { label: "Calcio", value: "0,70 %" },
      { label: "Fósforo", value: "0,60 %" }, { label: "Sodio", value: "0,30 %" },
      { label: "Magnesio", value: "0,20 %" }, { label: "Hierro", value: "80 mg" },
      { label: "Cobre", value: "12 mg" }, { label: "Zinc", value: "50 mg" },
      { label: "Manganeso", value: "45 mg" }, { label: "Iodo", value: "0,8 mg" },
      { label: "Cobalto", value: "0,2 mg" }, { label: "Selenio", value: "0,2 mg" },
      { label: "Beta caroteno", value: "12,8 mg" }, { label: "Vitamina A", value: "7.200 UI" },
      { label: "Vitamina D3", value: "1.400 UI" }, { label: "Vitamina E", value: "285 UI" },
      { label: "Biotina", value: "3,3 mg" }, { label: "Colina", value: "1.183,0 mg" },
      { label: "Ác. Fólico", value: "1,8 mg" }, { label: "Niacina", value: "81,4 mg" },
      { label: "Ác. Pantoténico", value: "27,1 mg" }, { label: "Riboflavina", value: "7,8 mg" },
      { label: "Tiamina", value: "7,4 mg" }, { label: "Vitamina B6", value: "9,0 mg" },
      { label: "Vitamina B12", value: "322,0 mg" }, { label: "Vitamina C", value: "140,0 mg" }
    ],
    aminoacidos: [
      { label: "Arginina", value: "0,94" }, { label: "Histidina", value: "0,38" },
      { label: "Isoleucina", value: "0,56" }, { label: "Leucina", value: "1,13" },
      { label: "Lisina", value: "0,71" }, { label: "Metionina", value: "0,24" },
      { label: "Cistina", value: "0,31" }, { label: "Fenilalanina", value: "0,71" },
      { label: "Tirosina", value: "0,48" }, { label: "Valina", value: "0,54" }
    ],
    ingredientes: "maíz, avena, cebada, pellet de soja, poroto de soja desactivado, afrechillo de trigo, harina de alfalfa, carbonato de calcio, fosfato mono-bicálcico, cloruro de sodio, óxido de magnesio, microminerales, vitaminas, aminoácidos, antioxidantes, levaduras, secuestrante de micotoxinas y saborizantes."
  },
  "psc": { 
    name: "BAL. PSC", 
    img: imgPSC, 
    color: "#D4AF37", 
    tagline: "MAXIMIZA EL POTENCIAL",
    desc: "Este alimento balanceado está elaborado con materias primas de primera calidad. Provee niveles de energía balanceados a partir de fibra degradable, almidón y lípidos; y cantidades de proteína de muy alto valor biológico, para un adecuado funcionamiento de las masas musculares. Proporciona minerales y vitaminas necesarios para un excelente rendimiento deportivo.",
    recomendacion: "Se recomienda utilizar a un nivel del 0,5% (mantenimiento), del 1 a 1,5% (competición, según nivel de entrenamiento) del peso vivo, repartido en dos o tres comidas después del consumo de heno. No dar más del 0.5% de peso vivo por comida.",
    nutricion: [
      { label: "Proteína", value: "13 %" }, { label: "Energía Digestible", value: "2.900 Kcal" },
      { label: "Humedad", value: "10 %" }, { label: "Calcio", value: "0,70 %" },
      { label: "Fósforo", value: "0,60 %" }, { label: "Sodio", value: "0,40 %" },
      { label: "Magnesio", value: "0,15 %" }, { label: "Hierro", value: "80 mg" },
      { label: "Cobre", value: "12 mg" }, { label: "Zinc", value: "50 mg" },
      { label: "Manganeso", value: "42 mg" }, { label: "Iodo", value: "0,8 mg" },
      { label: "Cobalto", value: "0,2 mg" }, { label: "Selenio", value: "0,2 mg" },
      { label: "Beta caroteno", value: "12,8 mg" }, { label: "Vitamina A", value: "7.200 UI" },
      { label: "Vitamina D3", value: "1.440 UI" }, { label: "Vitamina E", value: "285 UI" },
      { label: "Biotina", value: "3,3 mg" }, { label: "Colina", value: "1.183,0 mg" },
      { label: "Ác. Fólico", value: "1,8 mg" }, { label: "Niacina", value: "81,4 mg" },
      { label: "Ác. Pantoténico", value: "27,1 mg" }, { label: "Riboflavina", value: "7,8 mg" },
      { label: "Tiamina", value: "7,4 mg" }, { label: "Vitamina B6", value: "9,0 mg" },
      { label: "Vitamina B12", value: "322,0 mg" }, { label: "Vitamina C", value: "140,0 mg" }
    ],
    aminoacidos: [
      { label: "Arginina", value: "0,94" }, { label: "Histidina", value: "0,38" },
      { label: "Isoleucina", value: "0,56" }, { label: "Leucina", value: "1,13" },
      { label: "Lisina", value: "0,71" }, { label: "Metionina", value: "0,24" },
      { label: "Cistina", value: "0,31" }, { label: "Fenilalanina", value: "0,71" },
      { label: "Tirosina", value: "0,48" }, { label: "Valina", value: "0,54" }
    ],
    ingredientes: "maíz, avena, cebada, pellet de soja, poroto de soja desactivado, afrechillo de trigo, harina de alfalfa, carbonato de calcio, fosfato mono-bicálcico, cloruro de sodio, óxido de magnesio, microminerales, vitaminas, lisina, levaduras, secuestrante de micotoxinas y saborizantes."
  },
  "yeguas": { 
    name: "BAL. YEGUAS", 
    img: imgYeguas, 
    color: "#D4AF37", 
    tagline: "NUTRICIÓN GESTACIONAL",
    desc: "Este alimento balanceado está elaborado con materias primas de excelente calidad aportando niveles de energía, proteínas, minerales, aminoácidos y vitaminas para cubrir los requerimientos de las yeguas durante la gestación y la lactancia.",
    recomendacion: "Se recomienda utilizar a un nivel del 0,5 al 1% del peso vivo, repartido en dos comidas después de la ración de heno.",
    nutricion: [
      { label: "Proteína", value: "14,50 %" }, { label: "Energía Digestible", value: "2.900 Kcal" },
      { label: "Humedad", value: "10 %" }, { label: "Calcio", value: "0,75 %" },
      { label: "Fósforo", value: "0,65 %" }, { label: "Sodio", value: "0,10 %" },
      { label: "Magnesio", value: "0,15 %" }, { label: "Hierro", value: "100 mg" },
      { label: "Cobre", value: "12 mg" }, { label: "Zinc", value: "50 mg" },
      { label: "Manganeso", value: "40 mg" }, { label: "Iodo", value: "0,8 mg" },
      { label: "Cobalto", value: "0,2 mg" }, { label: "Selenio", value: "0,25 mg" },
      { label: "Beta caroteno", value: "32,4 mg" }, { label: "Vitamina A", value: "3.300 UI" },
      { label: "Vitamina D3", value: "400 UI" }, { label: "Vitamina E", value: "80 UI" },
      { label: "Biotina", value: "3,3 mg" }, { label: "Colina", value: "1.303,0 mg" },
      { label: "Ác. Fólico", value: "1,9 mg" }, { label: "Niacina", value: "84,6 mg" },
      { label: "Ác. Pantoténico", value: "27,5 mg" }, { label: "Riboflavina", value: "7,9 mg" },
      { label: "Tiamina", value: "7,5 mg" }, { label: "Vitamina B6", value: "9,2 mg" },
      { label: "Vitamina B12", value: "322,0 mg" }, { label: "Vitamina C", value: "140,0 mg" }
    ],
    aminoacidos: [
      { label: "Arginina", value: "1,07" }, { label: "Histidina", value: "0,43" },
      { label: "Isoleucina", value: "0,64" }, { label: "Leucina", value: "1,24" },
      { label: "Lisina", value: "0,76" }, { label: "Metionina", value: "0,27" },
      { label: "Cistina", value: "0,33" }, { label: "Fenilalanina", value: "0,79" },
      { label: "Tirosina", value: "0,54" }, { label: "Valina", value: "0,60" }
    ],
    ingredientes: "maíz, avena, cebada, pellet de soja, poroto de soja desactivado, afrechillo de trigo, harina de alfalfa, Macro y Microminerales de alta biodisponibilidad en equinos, vitaminas, levaduras, secuestrante de micotoxinas, antioxidantes y saborizantes."
  },
  "potrillos": { 
    name: "BAL. POTRILLOS", 
    img: imgPotrillos, 
    color: "#D4AF37", 
    tagline: "DESARROLLO ESQUELÉTICO",
    desc: "Este alimento balanceado está elaborado con materias primas de óptima calidad. Provee niveles de energía equilibrados a partir de fibra degradable, almidón y lípidos; y cantidades de proteína de muy alto valor biológico, incluyendo además minerales, vitaminas y aminoácidos, todo lo que asegura el desarrollo esquelético y muscular del potrillo para alta competencia.",
    recomendacion: "Se recomienda utilizar a un nivel del 0,5 al 1% del peso vivo, repartido en dos comidas después del suministro de heno.",
    nutricion: [
      { label: "Proteína", value: "17 %" }, { label: "Energía Digestible", value: "2.800 Kcal" },
      { label: "Humedad", value: "10 %" }, { label: "Calcio", value: "0,72 %" },
      { label: "Fósforo", value: "0,63 %" }, { label: "Sodio", value: "0,10 %" },
      { label: "Magnesio", value: "0,15 %" }, { label: "Hierro", value: "120 mg" },
      { label: "Cobre", value: "12 mg" }, { label: "Zinc", value: "50 mg" },
      { label: "Manganeso", value: "30 mg" }, { label: "Iodo", value: "0,8 mg" },
      { label: "Cobalto", value: "0,2 mg" }, { label: "Selenio", value: "0,3 mg" },
      { label: "Beta caroteno", value: "10,9 mg" }, { label: "Vitamina A", value: "3.500 UI" },
      { label: "Vitamina D3", value: "450 UI" }, { label: "Vitamina E", value: "80 UI" },
      { label: "Biotina", value: "3,3 mg" }, { label: "Colina", value: "1.386,0 mg" },
      { label: "Ác. Fólico", value: "1,9 mg" }, { label: "Niacina", value: "82,7 mg" },
      { label: "Ác. Pantoténico", value: "27,7 mg" }, { label: "Riboflavina", value: "7,9 mg" },
      { label: "Tiamina", value: "7,4 mg" }, { label: "Vitamina B6", value: "9,2 mg" },
      { label: "Vitamina B12", value: "322,0 mg" }, { label: "Vitamina C", value: "140,0 mg" }
    ],
    aminoacidos: [
      { label: "Arginina", value: "1,19" }, { label: "Histidina", value: "0,47" },
      { label: "Isoleucina", value: "0,71" }, { label: "Leucina", value: "1,37" },
      { label: "Lisina", value: "0,95" }, { label: "Metionina", value: "0,28" },
      { label: "Cistina", value: "0,35" }, { label: "Fenilalanina", value: "0,87" },
      { label: "Tirosina", value: "0,60" }, { label: "Valina", value: "0,67" }
    ],
    ingredientes: "maíz, avena, cebada, pellet de soja, poroto de soja desactivado, afrechillo de trigo, harina de alfalfa, carbonato de calcio, fosfato mono-bicálcico, cloruro de sodio, óxido de magnesio, microminerales, aminoácidos, vitaminas, antioxidantes, secuestrante de micotoxinas, levadura y saborizantes."
  },
  "vigor": { 
    name: "BAL. VIGOR", 
    img: imgVigor, 
    color: "#D4AF37", 
    tagline: "SUPLEMENTO ENERGÉTICO",
    desc: "Diseñado para caballos con alta demanda física, este suplemento aporta una densidad calórica superior. Su fórmula exclusiva ayuda a mantener la condición corporal durante temporadas de competencia intensa.",
    recomendacion: "Se recomienda utilizar a un nivel del 0,5 al 1% del peso vivo, repartido en dos comidas diarias.",
    nutricion: [
      { label: "Proteína", value: "12 %" }, { label: "Energía Digestible", value: "3.100 Kcal" },
      { label: "Humedad", value: "10 %" }, { label: "Calcio", value: "0,70 %" },
      { label: "Fósforo", value: "0,60 %" }
    ],
    aminoacidos: [
      { label: "Lisina", value: "0,65" }, { label: "Metionina", value: "0,22" }
    ],
    ingredientes: "Maíz, aceites vegetales, afrechillo de arroz, pellet de soja, vitaminas y minerales."
  },
  "mantenimiento": { 
    name: "BAL. MANTENIMIENTO", 
    img: imgMantenimiento, 
    color: "#2563eb", 
    tagline: "EQUILIBRIO DIARIO",
    desc: "Este producto pertenece a la línea Professional. Alimento balanceado elaborado con materias primas de excelente calidad. Provee niveles de energía, proteínas, minerales y vitaminas para cubrir los requerimientos de mantenimiento del caballo adulto.",
    recomendacion: "Se recomienda utilizar a un nivel del 0,5 al 1% del peso vivo, repartido en dos comidas después del suministro de heno.",
    nutricion: [
      { label: "Proteína", value: "11 %" }, { label: "Energía Digestible", value: "2.600 Kcal" },
      { label: "Humedad", value: "10 %" }, { label: "Calcio", value: "0,70 %" },
      { label: "Fósforo", value: "0,60 %" }, { label: "Sodio", value: "0,15 %" },
      { label: "Magnesio", value: "0,20 %" }, { label: "Hierro", value: "60 mg" },
      { label: "Cobre", value: "12 mg" }, { label: "Zinc", value: "50 mg" },
      { label: "Manganeso", value: "50 mg" }, { label: "Iodo", value: "0,8 mg" },
      { label: "Cobalto", value: "0,2 mg" }, { label: "Selenio", value: "0,2 mg" },
      { label: "Beta caroteno", value: "5,3 mg" }, { label: "Vitamina A", value: "3.500 UI" },
      { label: "Vitamina D3", value: "350 UI" }, { label: "Vitamina E", value: "45 UI" },
      { label: "Biotina", value: "3,3 mg" }, { label: "Colina", value: "1.060,0 mg" },
      { label: "Ác. Fólico", value: "1,7 mg" }, { label: "Niacina", value: "81,0 mg" },
      { label: "Ác. Pantoténico", value: "26,6 mg" }, { label: "Riboflavina", value: "7,8 mg" },
      { label: "Tiamina", value: "7,4 mg" }, { label: "Vitamina B6", value: "8,8 mg" },
      { label: "Vitamina B12", value: "322,0 mg" }, { label: "Vitamina C", value: "140,0 mg" }
    ],
    aminoacidos: [
      { label: "Arginina", value: "0,76" }, { label: "Histidina", value: "0,31" },
      { label: "Isoleucina", value: "0,46" }, { label: "Leucina", value: "0,93" },
      { label: "Lisina", value: "0,51" }, { label: "Metionina", value: "0,20" },
      { label: "Cistina", value: "0,27" }, { label: "Fenilalanina", value: "0,59" },
      { label: "Tirosina", value: "0,40" }, { label: "Valina", value: "0,45" }
    ],
    ingredientes: "maíz, avena, cebada, pellet de soja, afrechillo de trigo, harina de alfalfa, carbonato de calcio, fosfato mono-bicálcico, cloruro de sodio, óxido de magnesio, microminerales, vitaminas, antioxidantes, levaduras, secuestrante de micotoxinas y saborizantes."
  },
  "deporte": { 
    name: "BAL. DEPORTE", 
    img: imgDeporte, 
    color: "#2563eb", 
    tagline: "RENDIMIENTO CONSTANTE",
    desc: "Este producto pertenece a la línea Professional. Alimento balanceado elaborado con materias primas de excelente calidad. Provee niveles de energía, proteínas, minerales y vitaminas necesarios para cubrir los requerimientos de caballos en entrenamiento y competencia.",
    recomendacion: "Se recomienda utilizar a un nivel del 0,5 al 1,2% del peso vivo, repartido en dos o tres comidas diarias, siempre después del suministro de heno.",
    nutricion: [
      { label: "Proteína", value: "12 %" }, { label: "Energía Digestible", value: "2.800 Kcal" },
      { label: "Humedad", value: "10 %" }, { label: "Calcio", value: "0,70 %" },
      { label: "Fósforo", value: "0,60 %" }, { label: "Sodio", value: "0,25 %" },
      { label: "Magnesio", value: "0,15 %" }, { label: "Hierro", value: "80 mg" },
      { label: "Cobre", value: "12 mg" }, { label: "Zinc", value: "50 mg" },
      { label: "Manganeso", value: "40 mg" }, { label: "Iodo", value: "0,8 mg" },
      { label: "Cobalto", value: "0,2 mg" }, { label: "Selenio", value: "0,2 mg" },
      { label: "Beta caroteno", value: "12,1 mg" }, { label: "Vitamina A", value: "6.800 UI" },
      { label: "Vitamina D3", value: "1.360 UI" }, { label: "Vitamina E", value: "270 UI" },
      { label: "Biotina", value: "3,3 mg" }, { label: "Colina", value: "1.154,0 mg" },
      { label: "Ác. Fólico", value: "1,8 mg" }, { label: "Niacina", value: "81,3 mg" },
      { label: "Ác. Pantoténico", value: "27,0 mg" }, { label: "Riboflavina", value: "7,8 mg" },
      { label: "Tiamina", value: "7,4 mg" }, { label: "Vitamina B6", value: "9,0 mg" },
      { label: "Vitamina B12", value: "322,0 mg" }, { label: "Vitamina C", value: "140,0 mg" }
    ],
    aminoacidos: [
      { label: "Arginina", value: "0,86" }, { label: "Histidina", value: "0,35" },
      { label: "Isoleucina", value: "0,52" }, { label: "Leucina", value: "1,05" },
      { label: "Lisina", value: "0,64" }, { label: "Metionina", value: "0,22" },
      { label: "Cistina", value: "0,30" }, { label: "Fenilalanina", value: "0,66" },
      { label: "Tirosina", value: "0,45" }, { label: "Valina", value: "0,51" }
    ],
    ingredientes: "maíz, avena, cebada, pellet de soja, afrechillo de trigo, harina de alfalfa, carbonato de calcio, fosfato mono-bicálcico, cloruro de sodio, óxido de magnesio, microminerales, vitaminas, antioxidantes, levaduras, secuestrante de micotoxinas y saborizantes."
  },
};

const DetalleProducto = () => {
  const { id } = useParams();
  const [precioDinamico, setPrecioDinamico] = useState("Cargando...");
  const prod = productosData[id] || productosData["polo"];

  useEffect(() => {
    const fetchPrecio = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        
        // Buscamos el producto en la lista de la API por nombre parcial
        const productoEncontrado = data.find(p => 
          p.name.toLowerCase().includes(id.toLowerCase())
        );

        if (productoEncontrado && productoEncontrado.price) {
          setPrecioDinamico(`$${productoEncontrado.price.toLocaleString()}`);
        } else {
          setPrecioDinamico("Consultar");
        }
      } catch (error) {
        console.error("Error cargando precio:", error);
        setPrecioDinamico("Consultar");
      }
    };

    fetchPrecio();
  }, [id]);

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-8 text-white">
      <div className="max-w-6xl mx-auto">
        <Link to="/catalogo" className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-12 inline-block hover:text-white transition-colors">
          ← Volver al Catálogo
        </Link>
        
        <div className="grid md:grid-cols-2 gap-16 items-start mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative flex justify-center">
            <div className="absolute inset-0 blur-[120px] opacity-30" style={{ backgroundColor: prod.color }}></div>
            <img src={prod.img} alt={prod.name} className="relative z-10 w-full max-w-md h-auto drop-shadow-2xl" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ color: prod.color }} className="font-bold tracking-[0.4em] uppercase text-xs mb-3">{prod.tagline}</h2>
            <h1 className="text-7xl font-black uppercase mb-6 tracking-tighter leading-[0.9]">
              {prod.name.split('. ')[0]}<br/>
              <span style={{ color: prod.color }}>{prod.name.split('. ')[1] || ""}</span>
            </h1>
            <p className="text-gray-400 text-xl leading-relaxed mb-6 font-light">{prod.desc}</p>
            <div className="bg-gray-900/30 border-l-2 p-4 mb-8" style={{ borderColor: prod.color }}>
              <p style={{ color: prod.color }} className="text-sm italic">{prod.recomendacion}</p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-900 pt-8">
              <span className="text-5xl font-light italic">{precioDinamico}</span>
              <button 
                className="bg-white text-black px-10 py-5 font-black uppercase text-xs tracking-widest transition-all duration-500 hover:text-white"
                onMouseEnter={(e) => e.target.style.backgroundColor = prod.color}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                Consultar Stock
              </button>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 border-t border-gray-900 pt-16">
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px]" style={{ backgroundColor: prod.color }}></span> Aportes Nutricionales
            </h3>
            <div className="space-y-3">
              {prod.nutricion?.map((item, i) => (
                <div key={i} className="flex justify-between border-b border-gray-900 pb-2 text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="text-gray-200 font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px]" style={{ backgroundColor: prod.color }}></span> Aminoácidos (%)
            </h3>
            <div className="space-y-3">
              {prod.aminoacidos?.map((item, i) => (
                <div key={i} className="flex justify-between border-b border-gray-900 pb-2 text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="text-gray-200 font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px]" style={{ backgroundColor: prod.color }}></span> Composición
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 uppercase tracking-wider">{prod.ingredientes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;