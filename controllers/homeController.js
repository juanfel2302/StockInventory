const Product = require('../models/Product');
const Notification = require('../models/Notification');

class HomeController {
  static async getHomeData(req, res) {
    try {
      // Obtener el total de productos en stock
      const totalStockResult = await Product.getTotalStock();
      const totalStock = totalStockResult[0]?.total_stock || 0;

      // Obtener notificaciones pendientes
      const pendingNotificationsResult = await Notification.getPendingNotifications();
      const pendingNotifications = pendingNotificationsResult[0]?.count || 0;

      res.status(200).json({
        totalStock,
        pendingNotifications,
      });
    } catch (error) {
      console.error('Error al obtener los datos dinámicos del Home:', error);
      res.status(500).json({ error: 'Error al obtener los datos del Home.' });
    }
  }
}

module.exports = HomeController;
