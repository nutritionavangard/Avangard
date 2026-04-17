const express = require('express');
const router = express.Router();
const { login, register, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Ruta para registrar usuarios (opcional, podés comentarla si solo querés crear manual)
router.post('/register', register);

// Ruta para el login
router.post('/login', login);

// Ruta para ver el perfil (ejemplo de ruta protegida)
router.get('/profile', protect, getProfile);

module.exports = router;