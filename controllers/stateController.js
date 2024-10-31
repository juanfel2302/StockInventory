// controllers/stateController.js
const State = require('../models/statetemp'); // Asegúrate de que el nombre coincida

exports.getAllStates = async (req, res) => {
  try {
    const states = await State.getAll();
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estados' });
  }
};
