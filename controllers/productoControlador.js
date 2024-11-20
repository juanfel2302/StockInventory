// controllers/productoControlador.js
const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    // Actualizar estados antes de devolver los productos
    await Product.updateAllStates();

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

exports.updateProduct = async (req, res) => {
  try {
      const { id_producto } = req.params;
      const { nombre, codigo_barras, id_categoria, precio, stock, stock_minimo, id_proveedor, fecha_caducidad } = req.body;

      if (!id_producto || !nombre || !id_categoria || !precio || !stock || !stock_minimo || !id_proveedor) {
          return res.status(400).json({ error: 'Todos los campos obligatorios deben completarse.' });
      }

      const result = await Product.update(id_producto, req.body);
      res.json({ message: "Producto actualizado exitosamente", result });
  } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(500).json({ error: "Error al actualizar producto" });
  }
};
