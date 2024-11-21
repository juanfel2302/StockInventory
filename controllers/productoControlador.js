// controllers/productoControlador.js
const Product = require('../models/Product');
const PDFDocument = require('pdfkit');
const { Table } = require('pdfkit-table');

exports.getAllProducts = async (req, res) => {
  try {
      await Product.updateAllStates();

      const products = await Product.getAll();

      // Formatear las fechas y otros campos antes de enviarlos al cliente
      const formattedProducts = products.map(product => ({
          ...product,
          fecha_caducidad: product.fecha_caducidad
              ? new Date(product.fecha_caducidad).toLocaleDateString() // Formatear fecha
              : "Sin fecha",
              precio: parseFloat(product.precio).toFixed(2), // Enviar solo el valor numérico como string
            }));

      res.json(formattedProducts);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    console.log("Datos recibidos en el backend:", productData); // Verifica los datos en el backend
    const result = await Product.create(productData);
    res.status(201).json({ message: 'Producto agregado exitosamente', productId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
};

exports.filterProducts = async (req, res) => {
  try {
      const { category, provider, status } = req.query;
      const filters = {
          category: category !== "" ? category : null,
          provider: provider !== "" ? provider : null,
          status: status !== "" ? status : null
      };
      const products = await Product.filter(filters);
      res.json(products);
  } catch (error) {
      res.status(500).json({ error: 'Error al filtrar productos' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
      console.log("Datos recibidos en el backend (antes de procesar):", req.body);

      const { id_producto } = req.params;
      const { nombre, codigo_barras, id_categoria, precio, stock_minimo, id_proveedor, fecha_caducidad } = req.body;

      // Validación: Excluir stock
      if (!id_producto || !nombre || !id_categoria || !precio || !stock_minimo || !id_proveedor) {
          console.error("Campos obligatorios faltantes.");
          return res.status(400).json({ error: "Todos los campos obligatorios deben completarse, excepto stock." });
      }

      const sanitizedData = {
          nombre,
          codigo_barras,
          id_categoria: parseInt(id_categoria, 10),
          precio: parseFloat(precio),
          stock_minimo: parseInt(stock_minimo, 10),
          id_proveedor: parseInt(id_proveedor, 10),
          fecha_caducidad,
      };

      console.log("Datos procesados para actualización:", sanitizedData);

      const result = await Product.update(id_producto, sanitizedData);
      res.json({ message: "Producto actualizado exitosamente", result });
  } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(500).json({ error: "Error al actualizar producto" });
  }
};

exports.searchProducts = async (req, res) => {
  try {
      const query = req.query.q || '';
      const searchBy = req.query.by || 'nombre'; // Default: buscar por nombre

      if (!query) {
          return res.status(400).json({ error: 'Debe proporcionar un término de búsqueda.' });
      }

      const products = await Product.search(query, searchBy);
      res.json(products);
  } catch (error) {
      console.error('Error al buscar productos:', error);
      res.status(500).json({ error: 'Error al buscar productos.' });
  }
};

exports.searchProductsForFilter = async (req, res) => {
  try {
      const query = req.query.q || ''; // Captura la consulta de búsqueda

      if (!query) {
          return res.status(400).json({ error: 'Debe proporcionar un término de búsqueda.' });
      }

      const products = await Product.searchForFilter(query);
      res.json(products); // Devuelve los productos que coincidan con el texto
  } catch (error) {
      console.error('Error al buscar productos para filtro:', error);
      res.status(500).json({ error: 'Error al buscar productos para el filtro.' });
  }
};



exports.generatePDF = async (req, res) => {
  try {
      const { data } = req.body;

      if (!data || !Array.isArray(data) || data.length === 0) {
          return res.status(400).json({ error: 'No hay datos para generar el PDF' });
      }

      const doc = new PDFDocument({ margin: 30 });
      const filename = `reporte_inventario_${new Date().toISOString().split('T')[0]}.pdf`;

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/pdf');

      doc.pipe(res);

      // Título
      doc.fontSize(18).text('Reporte de Inventario', { align: 'center' });
      doc.fontSize(12).text(`Fecha de generación: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);

      // Cabecera de la tabla
      const tableHeader = ['Nombre', 'Precio', 'Categoría', 'Stock', 'Stock Mínimo', 'Estado', 'Proveedor', 'Fecha de Caducidad'];
      const columnWidths = [100, 50, 100, 50, 80, 80, 100, 100];
      const startY = doc.y + 10;

      doc.fontSize(10).text('', 50, startY); // Margen inicial

      // Dibujar la cabecera
      tableHeader.forEach((header, i) => {
          doc.text(header, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), startY, {
              width: columnWidths[i],
              align: 'center',
              underline: true,
          });
      });

      // Dibujar los datos
      let currentY = startY + 20;

      data.forEach((product) => {
          const row = [
              product.nombre,
              `$${Number(product.precio).toFixed(2)}`,
              product.categoria,
              product.stock,
              product.stock_minimo,
              product.estado,
              product.proveedor,
              product.fecha_caducidad,
          ];

          row.forEach((cell, i) => {
              doc.text(cell, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), currentY, {
                  width: columnWidths[i],
                  align: 'center',
              });
          });

          currentY += 20;

          // Salto de página si es necesario
          if (currentY > doc.page.height - 50) {
              doc.addPage();
              currentY = 50;
          }
      });

      // Finalizar el documento
      doc.end();
  } catch (error) {
      console.error('Error al generar el PDF:', error);
      res.status(500).json({ error: 'Error al generar el PDF' });
  }
};

