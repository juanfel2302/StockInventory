// models/Provider.js
const connection = require('../config/db');

class Provider {
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM proveedores';
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = Provider;
