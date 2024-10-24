const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin', // Reemplaza con tu contraseña
  database: 'TiendaDB' // Reemplaza con el nombre de tu base de datos
});

// Verificar la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error al conectarse a la base de datos:', err.stack);
    return;
  }
  console.log('Conexión a la base de datos establecida con éxito.');
});

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando correctamente');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
