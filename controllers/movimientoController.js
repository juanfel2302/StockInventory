const Movimiento = require('../models/Movimiento');
const Notificacion = require('../models/Notificacion');
const Product = require('../models/Product');

exports.registrarEntradas = async (req, res) => {
    const { id_producto, cantidad, motivo } = req.body;
    const id_usuario = req.session.userId;

    try {
        // Validar producto
        const product = await Product.getById(id_producto);
        if (!product) {
            return res.status(400).json({ error: "Producto no encontrado" });
        }

        // Registrar el movimiento
        await Movimiento.create({
            id_producto,
            id_tipo_movimiento: 1, // 1 representa "Ingreso de Stock"
            cantidad,
            motivo,
            id_usuario
        });

        // Registrar notificación de entrada
        await Notificacion.create({
            id_producto,
            id_tipo_notificacion: 4, // ID para "Notificación de Entrada"
            mensaje: `Se registró una entrada de ${cantidad} unidades para el producto ${product.nombre}`,
        });

        // Actualizar el stock del producto
        await Product.updateStockAndState(id_producto, cantidad);

        res.status(200).json({ message: "Entrada registrada exitosamente" });
    } catch (error) {
        console.error("Error al registrar entrada:", error);
        res.status(500).json({ error: "Error al registrar entrada" });
    }
};

exports.registrarSalidas = async (req, res) => {
    const exitData = req.body; // Array de { id_producto, cantidad, motivo }
    const id_usuario = req.session.userId;

    try {
        for (const exit of exitData) {
            const { id_producto, cantidad, motivo } = exit;

            // Obtener el producto actual y validar el stock
            const product = await Product.getById(id_producto);
            if (!product) {
                return res.status(400).json({ error: "Producto no encontrado" });
            }

            if (cantidad > product.stock) {
                return res.status(400).json({
                    error: `La cantidad solicitada (${cantidad}) excede el stock disponible (${product.stock}) para el producto ${product.nombre}.`
                });
            }

            // Registrar el movimiento
            await Movimiento.create({
                id_producto,
                id_tipo_movimiento: 2, // 2 representa "Salida de Stock"
                cantidad,
                motivo,
                id_usuario
            });

            // Registrar notificación de salida
            await Notificacion.create({
                id_producto,
                id_tipo_notificacion: 5, // ID para "Notificación de Salida"
                mensaje: `Se registró una salida de ${cantidad} unidades para el producto ${product.nombre}. Motivo: ${motivo}`,
            });

            // Actualizar el stock y estado del producto
            await Product.updateStockAndState(id_producto, -cantidad);
        }

        res.status(200).json({ message: "Salidas registradas exitosamente" });
    } catch (error) {
        console.error("Error al registrar salidas:", error);
        res.status(500).json({ error: "Error al registrar salidas" });
    }
};
