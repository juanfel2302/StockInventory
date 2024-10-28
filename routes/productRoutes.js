const express = require('express');
const productController = require('../controllers/productoControlador');
const isAuthenticated = require('../middleware/authMiddleware'); // Asegúrate de que esta ruta es correcta
const router = express.Router();

// Protege la ruta de productos con el middleware `isAuthenticated`
router.get('/', isAuthenticated, productController.getAllProducts);
router.post('/', isAuthenticated, productController.createProduct);


module.exports = router;
