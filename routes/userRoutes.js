const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/authMiddleware'); // Asegúrate de que este middleware esté implementado

// Rutas para los usuarios
router.post('/', userController.createUser); // Crear un nuevo usuario
router.get('/', isAuthenticated, userController.getAllUsers); // Obtener todos los usuarios
router.get('/:id', isAuthenticated, userController.getUserById); // Obtener un usuario por ID
router.put('/:id', isAuthenticated, userController.updateUser); // Actualizar un usuario
router.delete('/:id', isAuthenticated, userController.deleteUser); // Eliminar un usuario

module.exports = router;
