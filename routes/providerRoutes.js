const express = require('express');
const providerController = require('../controllers/providerController');
const { isAuthenticated, isActiveUser } = require('../middleware/authMiddleware'); // Importar middlewares necesarios

const router = express.Router();

// Rutas protegidas para los proveedores
router.get('/', isAuthenticated, isActiveUser, providerController.getAllProviders); // Obtener todos los proveedores
router.get('/:id', isAuthenticated, isActiveUser, providerController.getProviderById); // Obtener un proveedor por ID
router.post('/', isAuthenticated, isActiveUser, providerController.createProvider); // Crear un nuevo proveedor (requiere admin)
router.put('/:id', isAuthenticated, isActiveUser, providerController.updateProvider); // Actualizar un proveedor por ID (requiere admin)
router.delete('/:id', isAuthenticated, isActiveUser, providerController.deleteProvider); // Eliminar un proveedor por ID (requiere admin)

module.exports = router;
