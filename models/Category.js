// models/Category.js
const connection = require('../config/db');

class Category {
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM categorias';
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
  static create(data) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO categorias (nombre_categoria) VALUES (?)";
      connection.query(query, [data.nombre_categoria], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM categorias WHERE id_categoria = ?";
      connection.query(query, [id], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}



module.exports = Category;
