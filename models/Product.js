// models/Product.js
const connection = require('../config/db');

class Product {
    static getAll() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    p.nombre, 
                    p.codigo_barras,
                    p.precio, 
                    p.fecha_caducidad,
                    p.stock, 
                    p.stock_minimo,
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

    static create(data) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO productos (nombre, codigo_barras, id_categoria, precio, fecha_caducidad, stock, stock_minimo, id_estado_producto, id_proveedor)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const { nombre, codigo_barras, categoria, precio, fecha_caducidad, stock, stock_minimo, estado, proveedor } = data;
            connection.query(query, [nombre, codigo_barras, categoria, precio, fecha_caducidad, stock, stock_minimo, estado, proveedor], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = Product;

