const express = require('express');
const productController = require('../controllers/productoControlador');
const { isAuthenticated, isActiveUser } = require('../middleware/authMiddleware'); // Actualizar importaciones

const router = express.Router();

// Proteger todas las rutas de productos
router.get('/', isAuthenticated, isActiveUser, productController.getAllProducts);
router.post('/', isAuthenticated, isActiveUser, productController.createProduct);
router.put('/:id_producto', isAuthenticated, isActiveUser, productController.updateProduct);
router.get('/filter', isAuthenticated, isActiveUser, productController.filterProducts);
router.post('/pdf', isAuthenticated, isActiveUser, productController.generatePDF);
router.get('/search', isAuthenticated, isActiveUser, productController.searchProducts);
router.get('/search-filter', isAuthenticated, isActiveUser, productController.searchProductsForFilter);

module.exports = router;
