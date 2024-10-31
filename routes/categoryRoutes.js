// routes/categoryRoutes.js
const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

router.get('/', categoryController.getAllCategories);

module.exports = router;  // Asegúrate de exportar el router correctamente
