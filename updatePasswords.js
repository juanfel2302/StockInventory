const bcrypt = require('bcryptjs');
const connection = require('./config/db'); // Asegúrate de que la ruta a tu archivo de conexión sea correcta

async function updatePasswords() {
  try {
    // Genera el hash para cada contraseña
    const hashedAdminPassword = bcrypt.hashSync('adminpassword', 10); // Cambia 'adminpassword' por la contraseña real
    const hashedEmpleadoPassword = bcrypt.hashSync('empleado1password', 10); // Cambia 'empleado1password' por la contraseña real

    // Actualiza la contraseña del usuario admin
    connection.query(
      `UPDATE usuarios SET contrasena = ? WHERE nombre_usuario = 'admin'`,
      [hashedAdminPassword],
      (err, results) => {
        if (err) {
          console.error('Error al actualizar la contraseña para admin:', err);
        } else {
          console.log("Contraseña de 'admin' actualizada con éxito");
        }
      }
    );

    // Actualiza la contraseña del usuario empleado1
    connection.query(
      `UPDATE usuarios SET contrasena = ? WHERE nombre_usuario = 'empleado1'`,
      [hashedEmpleadoPassword],
      (err, results) => {
        if (err) {
          console.error('Error al actualizar la contraseña para empleado1:', err);
        } else {
          console.log("Contraseña de 'empleado1' actualizada con éxito");
        }
        connection.end(); // Cierra la conexión después de ejecutar ambos queries
      }
    );
  } catch (error) {
    console.error("Error al encriptar contraseñas:", error);
  }
}

// Llama a la función para actualizar las contraseñas
updatePasswords();
