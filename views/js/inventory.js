document.addEventListener("DOMContentLoaded", async function () {
  // Cargar productos en la tabla al iniciar
  try {
      const response = await fetch("/api/products", { method: "GET" });
      if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
      }
      
      const products = await response.json();
      console.log(products); // Verifica si los productos se están recibiendo correctamente
      renderProducts(products);
  } catch (error) {
      console.error("Error al cargar el inventario:", error);
  }

  await loadSelectOptions(); // Cargar categorías, estados y proveedores en los selectores
});

// Renderizar productos en la tabla
function renderProducts(products) {
  const tableBody = document.getElementById("inventoryTable");
  tableBody.innerHTML = ""; // Limpia la tabla antes de renderizar los productos

  products.forEach(product => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${product.nombre}</td>
          <td>${Number(product.precio).toFixed(2)}</td>
          <td>${product.categoria}</td>
          <td>${product.stock}</td>
          <td>${product.stock_minimo}</td>
          <td>${product.estado}</td>
          <td>${product.proveedor}</td>
          <td>${product.fecha_caducidad ? new Date(product.fecha_caducidad).toLocaleDateString() : 'N/A'}</td>
          <td>
              <button class="edit-button" 
                      data-id="${product.id_producto}" 
                      data-nombre="${product.nombre}" 
                      data-codigo_barras="${product.codigo_barras}" 
                      data-precio="${product.precio}" 
                      data-id_categoria="${product.id_categoria}" 
                      data-stock="${product.stock}" 
                      data-stock_minimo="${product.stock_minimo}" 
                      data-id_estado_producto="${product.id_estado_producto}" 
                      data-id_proveedor="${product.id_proveedor}" 
                      data-fecha_caducidad="${product.fecha_caducidad}">
                  <i class="fas fa-edit"></i>
              </button>
          </td>
      `;
      tableBody.appendChild(row);
  });
}

// Cargar opciones de los selectores (categoría, estado, proveedor) en el modal de agregar producto
async function loadSelectOptions() {
    try {
      // Cargar categorías
      const categoryResponse = await fetch('/api/categories');
      const categories = await categoryResponse.json();
      const categorySelect = document.getElementById('productCategory');
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id_categoria;
        option.textContent = category.nombre_categoria;
        categorySelect.appendChild(option);
      });
  
      // Cargar estados
      const stateResponse = await fetch('/api/states');
      const states = await stateResponse.json();
      const stateSelect = document.getElementById('productState');
      states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.id_estado_producto;
        option.textContent = state.nombre_estado;
        stateSelect.appendChild(option);
      });
  
      // Cargar proveedores activos
      const providerResponse = await fetch('/api/providers/active');
      const providers = await providerResponse.json();
      const providerSelect = document.getElementById('productProvider');
      providers.forEach(provider => {
        const option = document.createElement('option');
        option.value = provider.id_proveedor;
        option.textContent = provider.nombre;
        providerSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar opciones del selector:', error);
    }
  }

document.getElementById('exportPDF').addEventListener('click', async () => {
  // Obtener los datos visibles en la tabla
  const tableRows = Array.from(document.querySelectorAll('#inventoryTable tr'));
  const visibleData = tableRows.map(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length === 0) return null; // Filtrar filas vacías
    return {
        nombre: cells[0]?.innerText || 'N/A',
        precio: cells[1]?.innerText || 'N/A',
        categoria: cells[2]?.innerText || 'N/A',
        stock: cells[3]?.innerText || 'N/A',
        stock_minimo: cells[4]?.innerText || 'N/A',
        estado: cells[5]?.innerText || 'N/A',
        proveedor: cells[6]?.innerText || 'N/A',
        fecha_caducidad: cells[7]?.innerText || 'N/A'
    };
}).filter(Boolean); // Remover filas nulas


  try {
      const response = await fetch('/api/products/pdf', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: visibleData })
      });

      if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte_inventario_${new Date().toISOString().split('T')[0]}.pdf`;
          a.click();
      } else {
          console.error('Error al generar el PDF:', await response.text());
      }
  } catch (error) {
      console.error('Error al exportar a PDF:', error);
  }
});



document.getElementById("exportCSV").addEventListener("click", () => {
  const tableData = getTableData(); // Obtén los datos actuales de la tabla
  const currentDate = `Fecha de creación: ${new Date().toLocaleString()}`;
  const csvContent =
      "data:text/csv;charset=utf-8," +
      `${currentDate}\n` + // Añade la fecha al inicio del CSV
      tableData.map((row) => row.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `inventario_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
});


// Función para obtener los datos de la tabla
function getTableData() {
  const rows = document.querySelectorAll("#inventoryTable tr");
  return Array.from(rows).map((row) =>
    Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent)
  );
}

console.log(visibleData); // Asegúrate de que los datos sean correctos antes de enviarlos
console.log('Proveedores activos:', providers);


