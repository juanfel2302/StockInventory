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
      const categoryResponse = await fetch('/api/categories');
      const categories = await categoryResponse.json();
      const categorySelect = document.getElementById('productCategory');
      categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id_categoria;
          option.textContent = category.nombre_categoria;
          categorySelect.appendChild(option);
      });

      const stateResponse = await fetch('/api/states');
      const states = await stateResponse.json();
      const stateSelect = document.getElementById('productState');
      states.forEach(state => {
          const option = document.createElement('option');
          option.value = state.id_estado_producto;
          option.textContent = state.nombre_estado;
          stateSelect.appendChild(option);
      });

      const providerResponse = await fetch('/api/providers');
      const providers = await providerResponse.json();
      const providerSelect = document.getElementById('productProvider');
      providers.forEach(provider => {
          const option = document.createElement('option');
          option.value = provider.id_proveedor;
          option.textContent = provider.nombre;
          providerSelect.appendChild(option);
      });
  } catch (error) {
      console.error("Error al cargar opciones del selector:", error);
  }
}
