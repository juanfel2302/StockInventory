const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  try {
      const user = await User.findByUsername(nombre_usuario); // Busca el usuario en la base de datos
      if (!user || !bcrypt.compareSync(contrasena, user.contrasena)) {
          return res.status(401).json({ error: 'Credenciales incorrectas' });
      }

      // Crear la sesión
      req.session.userId = user.id_usuario;
      req.session.save(err => {
          if (err) {
              console.error('Error al guardar la sesión:', err);
              return res.status(500).json({ error: 'Error al guardar la sesión' });
          }

          // Redirige a la página de inventario
          res.redirect('/home');
      });
  } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).json({ error: 'Error en el servidor' });
  }
});



router.post('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.error('Error al destruir la sesión:', err);
          return res.status(500).json({ error: 'Error al cerrar sesión' });
      }

      // Eliminar la cookie de la sesión del navegador
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  });
});

router.get('/check-session', (req, res) => {
  if (req.session && req.session.userId) {
      res.status(200).json({ loggedIn: true });
  } else {
      res.status(401).json({ loggedIn: false });
  }
});

module.exports = router;
