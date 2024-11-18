const express = require('express');
const Notificacion = require('../models/Notificacion');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const notifications = await Notificacion.getAll();
        res.json(notifications);
    } catch (error) {
        console.error('Error obteniendo notificaciones:', error);
        res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
});

module.exports = router;
