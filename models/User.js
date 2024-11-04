const connection = require('../config/db');


//Constructor de la clase user
class User {
  constructor(id_usuario, nombre_usuario, contrasena, es_administrador, estado) {
    this.id_usuario = id_usuario;
    this.nombre_usuario = nombre_usuario;
    this.contrasena = contrasena;
    this.es_administrador = es_administrador;
    this.estado = estado;
  }

  
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM usuarios';
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }



  // Método para encontrar un usuario por ID
  static findById(id_usuario) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';

      connection.query(query, [id_usuario], (err, result) => {
        if (err) {
          reject(err);
        } else if (result.length > 0) {
          const user = new User(
            result[0].id_usuario,
            result[0].nombre_usuario,
            result[0].contrasena,
            result[0].es_administrador,
            result[0].estado
          );
          resolve(user);
        } else {
          resolve(null); // Si no se encuentra el usuario
        }
      });
    });
  }

  static create(nombre_usuario, contrasena, es_administrador, estado) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO usuarios (nombre_usuario, contrasena, es_administrador, estado) VALUES (?, ?, ?, ?)';
      
      connection.query(query, [nombre_usuario, contrasena, es_administrador, estado], (err, result) => {
        if (err) {
          reject(err); //Si hay un error se rechaza
        } else {
          resolve(result.insertId); // Si es exitoso, se regresa el Id del usuario
        }
      });
    });
  }
  static findByUsername(nombre_usuario) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM usuarios WHERE nombre_usuario = ?';

      connection.query(query, [nombre_usuario], (err, result) => {
        if (err) {
          reject(err);
        } else if (result.length > 0) {
          const user = new User(
            result[0].id_usuario,
            result[0].nombre_usuario,
            result[0].contrasena,
            result[0].es_administrador,
            result[0].estado
          );
          resolve(user);
        } else {
          resolve(null); // Usuario no encontrado
        }
      });
    });
  }


  static deleteUserById(id_usuario){
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM usuarios WHERE id_usuario = ?';

      connection.query(query, [id_usuario], (err, result) => {
        if(err){
          reject(err);
        }else if(result.affectedRows > 0){
          resolve(`Usuario con ID ${id_usuario} eliminado exitosamente.`);
        }else {
          resolve(`No se encontró un usuario con ID ${id_usuario}.`);
        }
      })
    })
  }

  static update(id_usuario, nombre_usuario, contrasena, es_administrador, estado) {
    return new Promise((resolve, reject) => {
      let query = 'UPDATE usuarios SET nombre_usuario = ?, es_administrador = ?, estado = ?';
      const params = [nombre_usuario, es_administrador, estado];
      
      if (contrasena) {
        query += ', contrasena = ?';
        params.push(contrasena);
      }
      
      query += ' WHERE id_usuario = ?';
      params.push(id_usuario);
      
      connection.query(query, params, (err, result) => {
        if (err) {
          reject(err);
        } else if (result.affectedRows > 0) {
          resolve(`Usuario con ID ${id_usuario} actualizado exitosamente.`);
        } else {
          resolve(`No se encontró un usuario con ID ${id_usuario}.`);
        }
      });
    });
  } 
}


module.exports = User;