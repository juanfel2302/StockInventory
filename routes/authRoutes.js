const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.post("/login", async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  // Log inicial para depuración
  console.log("Login request received with:", req.body);

  try {
    const user = await User.findByUsername(nombre_usuario);

    // Log para verificar si el usuario existe
    if (!user) {
      console.log("Usuario no encontrado:", nombre_usuario);
      return res.status(200).json({
        success: false,
        error: "Credenciales incorrectas",
      });
    }

    // Log para verificar si la contraseña es válida
    if (!bcrypt.compareSync(contrasena, user.contrasena)) {
      console.log("Contraseña incorrecta para el usuario:", nombre_usuario);
      return res.status(200).json({
        success: false,
        error: "Credenciales incorrectas",
      });
    }

    // Log para verificar el estado del usuario
    if (!user.estado) {
      console.log("Usuario inactivo:", nombre_usuario);
      return res.status(200).json({
        success: false,
        error: "Usuario inactivo. Contacta al administrador.",
      });
    }

    // Log para indicar que el usuario ha pasado las validaciones
    console.log("Usuario autenticado:", user);

    // Guardar datos de sesión
    req.session.userId = user.id_usuario;
    req.session.user = {
      id: user.id_usuario,
      es_administrador: user.es_administrador,
      estado: user.estado,
    };

    req.session.save((err) => {
      if (err) {
        console.error("Error al guardar la sesión:", err);
        return res.status(200).json({
          success: false,
          error: "Error al guardar la sesión. Intenta de nuevo.",
        });
      }

      console.log("Sesión guardada exitosamente para el usuario:", user.id_usuario);

      res.status(200).json({
        success: true,
        redirectTo: "/home",
      });
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({
      success: false,
      error: "Error al conectar con el servidor. Intenta de nuevo.",
    });
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
