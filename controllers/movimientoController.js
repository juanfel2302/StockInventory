// controllers/movimientoController.js
const Movimiento = require('../models/Movimiento');
const Product = require('../models/Product');

exports.registrarSalidas = async (req, res) => {
  const exitData = req.body; // Array of { id_producto, cantidad, motivo }
  const id_usuario = req.session.userId;

  try {
    for (const exit of exitData) {
      const { id_producto, cantidad, motivo } = exit;

      // Get current stock for validation
      const product = await Product.getById(id_producto);
      if (!product) {
        return res.status(400).json({ error: "Producto no encontrado" });
      }

      if (cantidad > product.stock) {
        return res.status(400).json({
          error: `La cantidad solicitada (${cantidad}) excede el stock disponible (${product.stock}) para el producto ${product.nombre}.`
        });
      }

      // Record the exit in movimientos_stock
      await Movimiento.create({
        id_producto,
        id_tipo_movimiento: 2, // Assuming '2' is for "Salida de Stock"
        cantidad,
        motivo,
        id_usuario
      });

      // Update stock in productos table (reduce stock)
      await Product.updateStock(id_producto, -cantidad);
    }

    res.status(200).json({ message: "Salidas registradas exitosamente" });
  } catch (error) {
    console.error("Error al registrar salidas:", error);
    res.status(500).json({ error: "Error al registrar salidas" });
  }
};
