// routes/movimientoRoutes.js
const express = require('express');
const movimientoController = require('../controllers/movimientoController');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware'); // Asegúrate de que esta ruta es correcta

router.post('/salidas', isAuthenticated, movimientoController.registrarSalidas);

module.exports = router;
