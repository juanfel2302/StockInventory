function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      return next(); // El usuario está autenticado, continuar a la siguiente función
    }
    res.status(401).json({ error: 'Acceso denegado. Debes iniciar sesión.' });
  }
  
  module.exports = isAuthenticated;
  