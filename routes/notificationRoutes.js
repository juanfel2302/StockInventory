const express = require('express');
const Notificacion = require('../models/Notificacion');
const router = express.Router();

// Obtener todas las notificaciones
router.get('/', async (req, res) => {
    try {
        const notifications = await Notificacion.getAll();
        res.json(notifications);
    } catch (error) {
        console.error('Error obteniendo notificaciones:', error);
        res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
});

// Marcar una notificación como leída
router.put('/:id/marcar-leida', async (req, res) => {
    const { id } = req.params;
    try {
        await Notificacion.marcarComoLeida(id);
        res.status(200).json({ message: 'Notificación marcada como leída' });
    } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
        res.status(500).json({ error: 'Error al marcar notificación como leída' });
    }
});

// Marcar todas las notificaciones como leídas
router.put('/marcar-todas-leidas', async (req, res) => {
    try {
        await Notificacion.marcarTodasComoLeidas();
        res.status(200).json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        console.error('Error al marcar todas las notificaciones como leídas:', error);
        res.status(500).json({ error: 'Error al marcar todas las notificaciones como leídas' });
    }
});

module.exports = router;
