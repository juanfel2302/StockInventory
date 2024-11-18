// cron/checkExpirations.js
const Product = require('../models/Product');
const Notificacion = require('../models/Notificacion');

async function checkExpiringProducts() {
    console.log('Verificando productos próximos a expirar...');

    try {
        const expiringProducts = await Product.getExpiringProducts(10); // Productos que expiran en 10 días

        for (const product of expiringProducts) {
            const mensaje = `El producto "${product.nombre}" está próximo a expirar el ${product.fecha_caducidad}.`;

            // Verificar si ya existe una notificación para este producto y fecha
            const existingNotification = await Notificacion.existsForProductAndType(product.id_producto, 6); // 6 es el tipo "Próximo a Expirar"
            
            if (!existingNotification) {
                // Crear la notificación solo si no existe una similar
                await Notificacion.createForExpiringProduct(product.id_producto, mensaje);
                console.log(`Notificación creada para el producto: ${product.nombre}`);
            } else {
                console.log(`Notificación ya existe para el producto: ${product.nombre}`);
            }
        }
    } catch (error) {
        console.error('Error verificando productos próximos a expirar:', error);
    }
}


setInterval(() => {
    checkExpiringProducts();
}, 3600000); // 3600000 ms = 1 hora

// Ejecutar inmediatamente al iniciar el servidor
checkExpiringProducts();
