const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Asegúrate de que esta ruta sea correcta
const isAuthenticated = require('../middleware/authMiddleware'); 

// Rutas para los usuarios
router.post('/', isAuthenticated, userController.createUser); // Crear un nuevo usuario
router.get('/', isAuthenticated, userController.getAllUsers); // Obtener todos los usuarios
router.get('/:id', userController.getUserById); // Obtener un usuario por ID
router.put('/:id', userController.updateUser); // Actualizar un usuario
router.delete('/:id', userController.deleteUser); // Eliminar un usuario

module.exports = router;
