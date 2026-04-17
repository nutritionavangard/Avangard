import axios from 'axios';

const API = axios.create({
    // Agregamos /api al final
    baseURL: 'https://avangard-nutrition.onrender.com/api', 
});

export default API;