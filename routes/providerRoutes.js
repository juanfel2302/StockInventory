// routes/providerRoutes.js
const express = require('express');
const providerController = require('../controllers/providerController');
const isAuthenticated = require('../middleware/authMiddleware'); // Asegúrate de que esta ruta es correcta

const router = express.Router();

// Ruta para obtener todos los proveedores
router.get('/', isAuthenticated, providerController.getAllProviders);

// Ruta para obtener un proveedor por ID
router.get('/:id', providerController.getProviderById);

// Ruta para crear un nuevo proveedor
router.post('/', providerController.createProvider);

// Ruta para actualizar un proveedor por ID
router.put('/:id', providerController.updateProvider);

// Ruta para eliminar un proveedor por ID
router.delete('/:id', providerController.deleteProvider);

module.exports = router;
