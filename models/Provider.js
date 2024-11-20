// models/Provider.js
const connection = require('../config/db');

class Provider {
  // Obtener todos los proveedores
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM proveedores';
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // Obtener un proveedor por ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM proveedores WHERE id_proveedor = ?';
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

  // Crear un nuevo proveedor
  static create(providerData) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO proveedores (nombre, telefono, email, estado) VALUES (?, ?, ?, ?)';
      const { nombre, telefono, email, estado } = providerData;
      connection.query(query, [nombre, telefono, email, estado], (err, results) => {
        if (err) return reject(err);
        resolve({ id: results.insertId, ...providerData });
      });
    });
  }

  // Actualizar un proveedor existente
  static update(id, providerData) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE proveedores SET nombre = ?, telefono = ?, email = ?, estado = ? WHERE id_proveedor = ?';
      const { nombre, telefono, email, estado } = providerData;
      connection.query(query, [nombre, telefono, email, estado, id], (err, results) => {
        if (err) return reject(err);
        resolve(results.affectedRows > 0);
      });
    });
  }

  // Eliminar un proveedor
  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM proveedores WHERE id_proveedor = ?';
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results.affectedRows > 0);
      });
    });
  }
  static getAllActive() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM proveedores WHERE estado = 1';
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}



module.exports = Provider;
