const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar Token con validación de secreto
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        console.error("CRÍTICO: No se encuentra JWT_SECRET en las variables de entorno");
        return null;
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Registrar usuario
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Por favor complete todos los campos' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });

        const user = await User.create({ name, email, password });
        
        const token = generateToken(user._id);
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            
            // Si el token falló por falta de secreto, avisamos al log
            if (!token) {
                return res.status(500).json({ message: "Error de configuración del servidor (JWT)" });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token,
            });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Perfil
exports.getProfile = async (req, res) => {
    if (!req.user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(req.user);
};