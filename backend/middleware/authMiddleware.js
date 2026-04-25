const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Verificación del Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Buscamos al usuario
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
            }

            return next(); // Importante el RETURN para cortar la ejecución aquí
        } catch (error) {
            console.error("Error en validación de token:", error.message);
            return res.status(401).json({ message: 'No autorizado, token fallido o expirado' });
        }
    }

    // Si llegamos aquí es porque no entró al primer IF o no había token
    if (!token) {
        return res.status(401).json({ message: 'No autorizado, no hay token en la petición' });
    }
};

module.exports = { protect };