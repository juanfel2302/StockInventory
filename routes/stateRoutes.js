// routes/stateRoutes.js
const express = require('express');
const stateController = require('../controllers/stateController');
const router = express.Router();

router.get('/', stateController.getAllStates);

module.exports = router;
