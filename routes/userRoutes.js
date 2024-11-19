const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin, isActiveUser } = require('../middleware/authMiddleware'); // Asegúrate de que esta ruta sea correcta

// Rutas protegidas para los usuarios
router.post('/', isAuthenticated, isActiveUser, isAdmin, userController.createUser);
router.get('/', isAuthenticated, isActiveUser, isAdmin, userController.getAllUsers);
router.get('/:id', isAuthenticated, isActiveUser, userController.getUserById); // Obtener usuario por ID (sin requerir admin)
router.put('/:id', isAuthenticated, isActiveUser, isAdmin, userController.updateUser);
router.delete('/:id', isAuthenticated, isActiveUser, isAdmin, userController.deleteUser);

module.exports = router;
