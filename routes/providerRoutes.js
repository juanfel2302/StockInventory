// routes/providerRoutes.js
const express = require('express');
const providerController = require('../controllers/providerController');
const router = express.Router();

router.get('/', providerController.getAllProviders);

module.exports = router;
