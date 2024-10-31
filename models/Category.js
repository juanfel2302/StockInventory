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
}

module.exports = Category;
