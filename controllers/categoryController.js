// controllers/categoryController.js
const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};
