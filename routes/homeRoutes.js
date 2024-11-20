const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/homeController');

// Ruta para obtener los datos dinámicos del Home
router.get('/api/home', HomeController.getHomeData);

module.exports = router;
