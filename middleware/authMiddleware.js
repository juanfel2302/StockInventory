function isAuthenticated(req, res, next) {
  console.log('Verificando sesión:', req.session); // Log para depuración
  if (req.session && req.session.userId) {
      return next(); // Continúa con la ruta
  }
  // Si no hay sesión activa, redirige al login
  if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ error: 'Acceso denegado. Debes iniciar sesión.' });
  }
  res.redirect('/');
}

function isActiveUser(req, res, next) {
  if (req.session && req.session.user && req.session.user.estado === 1) {
    return next();
  }
  res.status(403).json({ error: 'Usuario inactivo. Contacta al administrador.' });
}

function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.es_administrador === 1) {
    return next();
  }
  // Envía un error con status 403 y el mensaje correspondiente
  res.redirect('/home');
}

module.exports = { isAuthenticated, isActiveUser, isAdmin };
