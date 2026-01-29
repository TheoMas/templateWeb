// Middleware pour sécuriser les routes avec JWT (Authorization header)
const jwt = require('jsonwebtoken');
const config = require('./config');

function authenticateJWT(req, res, next) {
  // Lire le token depuis l'en-tête Authorization uniquement
  let token = null;
  const authHeader = req.headers['authorization'];
  console.log('[JWT] Authorization header:', authHeader ? (authHeader.length>20?authHeader.substring(0,20)+'...':authHeader) : 'none');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  // Si pas trouvé dans Authorization, tenter depuis req.cookies (cookie-parser) puis header fallback
  if (!token) {
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
      console.log('[JWT] token read from req.cookies');
    } else if (req.headers && req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').map(c => c.trim());
      for (const c of cookies) {
        if (c.startsWith('accessToken=')) {
          token = decodeURIComponent(c.substring('accessToken='.length));
          console.log('[JWT] token read from cookie header fallback');
          break;
        }
      }
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }
  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('[JWT] verify error:', err && err.message ? err.message : err);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

module.exports = authenticateJWT;
