// controllers/userController.js
const User = require('../models/User'); // Asegúrate de que esta ruta sea correcta
const bcrypt = require('bcrypt'); // Asegúrate de instalar bcrypt

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    const { nombre_usuario, contrasena, es_administrador, estado } = req.body;
    try {
        // Cifrar la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const userId = await User.create(nombre_usuario, hashedPassword, es_administrador, estado);
        
        res.status(201).json({ id: userId, message: 'Usuario creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el usuario: ' + err.message });
    }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers(); // Asegúrate de que este método esté definido en el modelo
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los usuarios: ' + err.message });
    }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id); // Cambiado a findById
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el usuario: ' + err.message });
    }
};

// Actualizar un usuario - debes agregar el método 'update' en el modelo
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, contrasena, es_administrador, estado } = req.body;

    try {
        const updatedData = {
            nombre_usuario,
            ...(contrasena && { contrasena: await bcrypt.hash(contrasena, 10) }),
            es_administrador,
            estado
        };

        // Aquí debes agregar un método 'update' en tu modelo
        const updatedUser = await User.update(id, updatedData); 
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el usuario: ' + err.message });
    }
};

// Eliminar un usuario - debes agregar el método 'delete' en el modelo
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await User.deleteUserById(id); // Cambiado a deleteUserById
        if (!result) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el usuario: ' + err.message });
    }
};
