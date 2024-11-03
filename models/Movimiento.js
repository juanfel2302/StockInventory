// models/Movimiento.js
const connection = require('../config/db');

class Movimiento {
    static create(data) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO movimientos_stock (id_producto, id_tipo_movimiento, cantidad, motivo, id_usuario, fecha_movimiento)
                VALUES (?, ?, ?, ?, ?, NOW())
            `;
            const { id_producto, id_tipo_movimiento, cantidad, motivo, id_usuario } = data;
            connection.query(query, [id_producto, id_tipo_movimiento, cantidad, motivo, id_usuario], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = Movimiento;
