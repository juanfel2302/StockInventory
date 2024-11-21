// controllers/providerController.js
const Provider = require('../models/Provider');

// Obtener todos los proveedores
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.getAll();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
};

// Obtener un proveedor por ID
exports.getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.getById(id);
    if (provider) {
      res.json(provider);
    } else {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el proveedor' });
  }
};

// Crear un nuevo proveedor
exports.createProvider = async (req, res) => {
  try {
    const providerData = req.body;
    const newProvider = await Provider.create(providerData);
    res.status(201).json(newProvider);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el proveedor' });
  }
};

// Actualizar un proveedor existente
exports.updateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const providerData = req.body;
    const updated = await Provider.update(id, providerData);
    if (updated) {
      res.json({ message: 'Proveedor actualizado correctamente' });
    } else {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el proveedor' });
  }
};

exports.getAllActiveProviders = async (req, res) => {
  try {
    console.log('Fetching active providers...'); // Log para verificar
    const providers = await Provider.getAllActive();
    res.json(providers);
  } catch (error) {
    console.error('Error al obtener proveedores activos:', error);
    res.status(500).json({ error: 'Error al obtener proveedores activos' });
  }
};

