const express = require('express');
const movimientoController = require('../controllers/movimientoController');
const { isAuthenticated, isActiveUser } = require('../middleware/authMiddleware'); // Middleware de autenticación y validación de usuarios activos

const router = express.Router();

// Ruta para registrar salidas
router.post('/salidas', isAuthenticated, isActiveUser, movimientoController.registrarSalidas);

// Ruta para registrar entradas
router.post('/entradas', isAuthenticated, isActiveUser, movimientoController.registrarEntradas);

module.exports = router;
