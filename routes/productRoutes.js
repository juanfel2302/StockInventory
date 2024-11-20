    const express = require('express');
    const productController = require('../controllers/productoControlador');
    const isAuthenticated = require('../middleware/authMiddleware'); // Asegúrate de que esta ruta es correcta
    const router = express.Router();

<<<<<<< HEAD
    // Protege la ruta de productos con el middleware `isAuthenticated`
    router.get('/', isAuthenticated, productController.getAllProducts);
    router.post('/', isAuthenticated, productController.createProduct);

    router.get('/filter', isAuthenticated, productController.filterProducts);
=======
// Protege la ruta de productos con el middleware `isAuthenticated`
router.get('/', isAuthenticated, productController.getAllProducts);
router.post('/', isAuthenticated, productController.createProduct);
router.put('/:id_producto', isAuthenticated, productController.updateProduct);
router.get('/filter', isAuthenticated, productController.filterProducts);
>>>>>>> LastBranch

    module.exports = router;
