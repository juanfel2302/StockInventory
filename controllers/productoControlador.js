// controllers/productController.js
const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    console.log("Datos recibidos en el backend:", productData); // Verifica los datos en el backend
    const result = await Product.create(productData);
    res.status(201).json({ message: 'Producto agregado exitosamente', productId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
};

exports.filterProducts = async (req, res) => {
  try {
      const { category, provider, status } = req.query;
      const filters = {
          category: category !== "" ? category : null,
          provider: provider !== "" ? provider : null,
          status: status !== "" ? status : null
      };
      const products = await Product.filter(filters);
      res.json(products);
  } catch (error) {
      res.status(500).json({ error: 'Error al filtrar productos' });
  }
};
