const connection = require('../db');

class User {
  constructor(id_usuario, nombre_usuario, contrasena, es_administrador, estado) {
    this.id_usuario = id_usuario;
    this.nombre_usuario = nombre_usuario;
    this.contrasena = contrasena;
    this.es_administrador = es_administrador;
    this.estado = estado;
  }

}

module.exports = User;
