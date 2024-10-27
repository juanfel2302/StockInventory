// models/Product.js
const connection = require('../config/db');

class Product {
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.nombre, 
          p.precio, 
          p.stock, 
          c.nombre_categoria AS categoria, 
          e.nombre_estado AS estado, 
          pr.nombre AS proveedor
        FROM productos p
        JOIN categorias c ON p.id_categoria = c.id_categoria
        JOIN estados_producto e ON p.id_estado_producto = e.id_estado_producto
        JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor;
      `;
      
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = Product;
