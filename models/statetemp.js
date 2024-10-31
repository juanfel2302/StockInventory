// models/State.js
const connection = require('../config/db');

class State {
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM estados_producto';
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = State;
