const connection = require('../config/db');

class Notificacion {
    static create(data) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO notificaciones (id_producto, id_tipo_notificacion, mensaje, fecha_creacion)
                VALUES (?, ?, ?, NOW())
            `;
            const { id_producto, id_tipo_notificacion, mensaje } = data;
            connection.query(query, [id_producto, id_tipo_notificacion, mensaje], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT n.id_notificacion, n.mensaje, 
                       DATE_FORMAT(n.fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion,
                       tn.nombre_tipo_notificacion, 
                       p.nombre AS producto
                FROM notificaciones n
                JOIN tipos_notificacion tn ON n.id_tipo_notificacion = tn.id_tipo_notificacion
                JOIN productos p ON n.id_producto = p.id_producto
                ORDER BY n.fecha_creacion DESC
            `;
            connection.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static createForExpiringProduct(id_producto, mensaje) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO notificaciones (id_producto, id_tipo_notificacion, mensaje, fecha_creacion)
                VALUES (?, ?, ?, NOW())
            `;
            const id_tipo_notificacion = 6; // Supongamos que el tipo 6 es "Próximo a Expirar"
            connection.query(query, [id_producto, id_tipo_notificacion, mensaje], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static existsForProductAndType(id_producto, id_tipo_notificacion) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT COUNT(*) AS count
                FROM notificaciones
                WHERE id_producto = ? AND id_tipo_notificacion = ? AND DATE(fecha_creacion) = CURDATE()
            `;
            connection.query(query, [id_producto, id_tipo_notificacion], (err, results) => {
                if (err) reject(err);
                resolve(results[0].count > 0); // Retorna true si ya existe una notificación
            });
        });
    }
}

module.exports = Notificacion;
