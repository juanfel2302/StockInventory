const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Asegúrate de que el modelo User esté bien definido

const login = async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  try {
    const user = await User.findByUsername(nombre_usuario); // Necesitarías un método findByUsername en el modelo User

    if (!user || !bcrypt.compareSync(contrasena, user.contrasena)) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Si la contraseña es correcta, inicia sesión
    req.session.userId = user.id_usuario;
    req.session.isAdmin = user.es_administrador;
    res.json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { login };
