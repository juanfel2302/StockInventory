// routes/categoryRoutes.js
const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.createCategory);
router.delete("/:id", categoryController.deleteCategory);
module.exports = router;  // Asegúrate de exportar el router correctamente

