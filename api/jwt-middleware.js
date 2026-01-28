// Middleware pour sécuriser les routes avec JWT (cookie httpOnly)
const jwt = require('jsonwebtoken');
const config = require('./config');

function authenticateJWT(req, res, next) {
  const token = req.cookies && req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }
  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

module.exports = authenticateJWT;
