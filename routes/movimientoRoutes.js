// routes/movimientoRoutes.js
const express = require('express');
const movimientoController = require('../controllers/movimientoController');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware'); // Middleware de autenticación

// Ruta para registrar salidas
router.post('/salidas', isAuthenticated, movimientoController.registrarSalidas);

// Ruta para registrar entradas
router.post('/entradas', isAuthenticated, movimientoController.registrarEntradas);

module.exports = router;
