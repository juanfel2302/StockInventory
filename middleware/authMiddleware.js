function isAuthenticated(req, res, next) {
  console.log('Verificando sesión:', req.session); // LOG
  if (req.session && req.session.userId) {
      return next();
  }
  res.status(401).json({ error: 'Acceso denegado. Debes iniciar sesión.' });
}

  module.exports = isAuthenticated;
  