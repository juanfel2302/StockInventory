const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;
  try {
    const user = await User.findByUsername(nombre_usuario);
    if (!user || !bcrypt.compareSync(contrasena, user.contrasena)) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    req.session.userId = user.id_usuario;
    res.redirect('/home'); // Redirige al usuario a la página de inicio después de iniciar sesión
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/logout', (req, res) => {
  console.log("Logout route reached");
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Sesión cerrada exitosamente' });
  });
});

module.exports = router;
