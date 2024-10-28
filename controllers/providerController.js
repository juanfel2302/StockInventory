// controllers/providerController.js
const Provider = require('../models/Provider');

exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.getAll();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
};
