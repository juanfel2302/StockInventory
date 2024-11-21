// models/Product.js
const connection = require('../config/db');

class Product {
    static getAll() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    p.id_producto,       
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
            const { nombre, codigo_barras, id_categoria, precio, fecha_caducidad, stock, stock_minimo, id_estado_producto, id_proveedor } = data; // Ajusta los nombres
            connection.query(query, [nombre, codigo_barras, id_categoria, precio, fecha_caducidad, stock, stock_minimo, id_estado_producto, id_proveedor], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    //filtrado
    static filter({ category, provider, status }) {
        return new Promise((resolve, reject) => {
            let query = `
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
                JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
                WHERE 1=1
            `;
            const queryParams = [];

            if (category) {
                query += ' AND p.id_categoria = ?';
                queryParams.push(category);
            }
            if (provider) {
                query += ' AND p.id_proveedor = ?';
                queryParams.push(provider);
            }
            if (status) {
                query += ' AND p.id_estado_producto = ?';
                queryParams.push(status);
            }

            connection.query(query, queryParams, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
    static getById(id_producto) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM productos WHERE id_producto = ?";
            connection.query(query, [id_producto], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]); // Return the first (and only) result
            });
        });
    }

    static updateStockAndState(id_producto, cantidad) {
        return new Promise(async (resolve, reject) => {
            try {
                // Primero, obtenemos el producto actual
                const product = await this.getById(id_producto);

                if (!product) {
                    return reject(new Error(`Producto con ID ${id_producto} no encontrado.`));
                }

                const nuevoStock = Number(product.stock) + Number(cantidad); // `cantidad` puede ser negativa para salidas
                let nuevoEstado;

                // Determinar el nuevo estado
                if (nuevoStock === 0) {
                    nuevoEstado = 4; // 'Sin Stock'
                } else if (nuevoStock < product.stock_minimo) {
                    nuevoEstado = 3; // 'Stock Bajo'
                } else {
                    nuevoEstado = 2; // 'En Stock'
                }

                // Actualizar el producto
                const query = `
                    UPDATE productos 
                    SET stock = ?, id_estado_producto = ? 
                    WHERE id_producto = ?
                `;
                connection.query(query, [nuevoStock, nuevoEstado, id_producto], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    static updateAllStates() {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE productos
                SET id_estado_producto = CASE
                    WHEN stock = 0 THEN 4 -- 'Sin Stock'
                    WHEN stock < stock_minimo THEN 3 -- 'Stock Bajo'
                    ELSE 2 -- 'En Stock'
                END
            `;
            connection.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
    static update(id_producto, data) {
        return new Promise((resolve, reject) => {
            const { nombre, codigo_barras, id_categoria, precio, stock_minimo, id_proveedor, fecha_caducidad } = data;

            const query = `
                UPDATE productos 
                SET 
                    nombre = ?, 
                    codigo_barras = ?, 
                    id_categoria = ?, 
                    precio = ?, 
                    stock_minimo = ?, 
                    id_proveedor = ?, 
                    fecha_caducidad = ?
                WHERE id_producto = ?
            `;

            console.log("Ejecutando query para actualización:", query);

            connection.query(
                query,
                [nombre, codigo_barras, id_categoria, precio, stock_minimo, id_proveedor, fecha_caducidad || null, id_producto],
                (err, results) => {
                    if (err) {
                        console.error("Error al actualizar producto:", err);
                        reject(err);
                    }
                    resolve(results);
                }
            );
        });
    }


    static getExpiringProducts(days) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM productos
                WHERE DATEDIFF(fecha_caducidad, CURDATE()) <= ? AND DATEDIFF(fecha_caducidad, CURDATE()) >= 0
            `;
            connection.query(query, [days], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
    static getTotalStock() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT SUM(stock) AS total_stock FROM productos';
            connection.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
    static search(query, searchBy = "nombre") {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    p.id_producto, 
                    p.nombre, 
                    p.codigo_barras, 
                    p.precio, 
                    c.nombre_categoria AS categoria, 
                    p.stock 
                FROM productos p
                JOIN categorias c ON p.id_categoria = c.id_categoria
                WHERE ${searchBy === "codigo_barras" ? "p.codigo_barras" : "p.nombre"} LIKE ?
            `;
            const searchQuery = `%${query}%`;
            connection.query(sql, [searchQuery], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
    static searchForFilter(query) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    p.id_producto, 
                    p.nombre, 
                    p.codigo_barras, 
                    p.precio, 
                    c.nombre_categoria AS categoria, 
                    e.nombre_estado AS estado, 
                    pr.nombre AS proveedor, 
                    p.stock, 
                    p.stock_minimo, 
                    p.fecha_caducidad
                FROM productos p
                LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
                LEFT JOIN estados_producto e ON p.id_estado_producto = e.id_estado_producto
                LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
                WHERE p.nombre LIKE ?
            `;
    
            const searchQuery = `%${query}%`;
            connection.query(sql, [searchQuery], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
    
    
}




module.exports = Product;
