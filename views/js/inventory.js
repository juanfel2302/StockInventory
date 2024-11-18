
document.addEventListener("DOMContentLoaded", async function() {
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

    // Configuración del modal de "Agregar Producto"
    const addProductButton = document.getElementById("addProductButton");
    const addProductModal = document.getElementById("addProductModal");
    const closeModal = document.getElementById("closeModal");

    addProductButton.onclick = function() {
        addProductModal.style.display = "block";
    };

    closeModal.onclick = function() {
        addProductModal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == addProductModal) {
            addProductModal.style.display = "none";
        }
    };

    const addProductForm = document.getElementById("addProductForm");
    addProductForm.onsubmit = async function(event) {
        event.preventDefault();
        
        const formData = new FormData(addProductForm);
        const data = Object.fromEntries(formData.entries());
        console.log(data); // Verifica que los datos tengan los valores correctos

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error("Error al agregar el producto");
            }

            addProductModal.style.display = "none";
            location.reload(); // Recargar la página para ver el nuevo producto en la tabla
        } catch (error) {
            console.error("Error al guardar el producto:", error);
        }
    };

    // Configuración del modal de "Filtrar"
    document.getElementById("filterButton").addEventListener("click", function () {
        document.getElementById("filterModal").style.display = "block";
        loadFilterOptions(); // Cargar opciones de filtro cuando se abre el modal
    });

    document.getElementById("closeFilterModal").addEventListener("click", function () {
        document.getElementById("filterModal").style.display = "none";
    });

    window.addEventListener("click", function (event) {
        const filterModal = document.getElementById("filterModal");
        if (event.target == filterModal) {
            filterModal.style.display = "none";
        }
    });

    // Filtrar productos
    document.getElementById("filterForm").addEventListener("submit", async function (event) {
        event.preventDefault();
    
        // Obtener los valores seleccionados en los filtros
        const category = document.getElementById("categoryFilter").value || null;
        const provider = document.getElementById("providerFilter").value || null;
        const status = document.getElementById("statusFilter").value || null;
    
        try {
            // Enviar solicitud al backend con los filtros, omitiendo los campos vacíos
            const response = await fetch(`/api/products/filter?category=${category || ''}&provider=${provider || ''}&status=${status || ''}`);
            const products = await response.json();
            renderProducts(products); // Actualiza la tabla con los productos filtrados
            document.getElementById("filterModal").style.display = "none"; // Cierra el modal después de aplicar los filtros
        } catch (error) {
            console.error("Error al filtrar productos:", error);
        }
    });
}); // <- Aquí se cierra la función DOMContentLoaded

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
document.getElementById("inventoryTable").addEventListener("click", async function(event) {
  if (event.target.closest(".edit-button")) {
      const button = event.target.closest(".edit-button");

      // Extraer datos del botón
      const productData = {
          id_producto: button.dataset.id,
          nombre: button.dataset.nombre,
          codigo_barras: button.dataset.codigo_barras,
          precio: button.dataset.precio,
          id_categoria: button.dataset.id_categoria,
          stock_minimo: button.dataset.stock_minimo,
          id_proveedor: button.dataset.id_proveedor,
          fecha_caducidad: button.dataset.fecha_caducidad,
      };

      // Rellenar campos del formulario (sin incluir stock)
      document.getElementById("editProductId").value = productData.id_producto;
      document.getElementById("editProductName").value = productData.nombre;
      document.getElementById("editProductBarcode").value = productData.codigo_barras;
      document.getElementById("editProductPrice").value = productData.precio;
      document.getElementById("editProductMinStock").value = productData.stock_minimo;
      document.getElementById("editProductExpiry").value = productData.fecha_caducidad
          ? new Date(productData.fecha_caducidad).toISOString().split("T")[0]
          : "";

      await loadEditSelectOptions(productData);

      document.getElementById("editProductModal").style.display = "block";
  }
});



async function loadEditSelectOptions(productData) {
  try {
      // Cargar categorías
      const categoryResponse = await fetch('/api/categories');
      const categories = await categoryResponse.json();
      const categorySelect = document.getElementById('editProductCategory');
      categorySelect.innerHTML = ""; // Limpiar el selector antes de agregar opciones
      categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id_categoria;
          option.textContent = category.nombre_categoria;
          if (category.id_categoria == productData.id_categoria) {
              option.selected = true; // Selecciona la categoría correspondiente
          }
          categorySelect.appendChild(option);
      });

      // Cargar proveedores
      const providerResponse = await fetch('/api/providers');
      const providers = await providerResponse.json();
      const providerSelect = document.getElementById('editProductProvider');
      providerSelect.innerHTML = ""; // Limpiar el selector antes de agregar opciones
      providers.forEach(provider => {
          const option = document.createElement('option');
          option.value = provider.id_proveedor;
          option.textContent = provider.nombre;
          if (provider.id_proveedor == productData.id_proveedor) {
              option.selected = true; // Selecciona el proveedor correspondiente
          }
          providerSelect.appendChild(option);
      });

  } catch (error) {
      console.error("Error al cargar opciones de edición:", error);
  }
}


document.getElementById("closeEditModal").onclick = function() {
  document.getElementById("editProductModal").style.display = "none";
};

document.getElementById("editProductForm").onsubmit = async function(event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById("editProductForm"));
  const data = Object.fromEntries(formData.entries());

  // Enviar datos al backend
  try {
      const response = await fetch(`/api/products/${data.id_producto}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
      });

      if (!response.ok) {
          throw new Error("Error al actualizar el producto");
      }

      document.getElementById("editProductModal").style.display = "none"; // Cerrar modal
      location.reload(); // Recargar para ver los cambios
  } catch (error) {
      console.error("Error al actualizar el producto:", error);
  }
};


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

// Cargar opciones de los filtros (categoría, proveedor, estado) en el modal de filtro
async function loadFilterOptions() {
    try {
        const categorySelect = document.getElementById('categoryFilter');
        categorySelect.innerHTML = '<option value="">Todas</option>'; // Limpiar opciones anteriores
        const providerSelect = document.getElementById('providerFilter');
        providerSelect.innerHTML = '<option value="">Todos</option>';
        const statusSelect = document.getElementById('statusFilter');
        statusSelect.innerHTML = '<option value="">Todos</option>';

        const categoriesResponse = await fetch('/api/categories');
        const categories = await categoriesResponse.json();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id_categoria;
            option.textContent = category.nombre_categoria;
            categorySelect.appendChild(option);
        });

        const providersResponse = await fetch('/api/providers');
        const providers = await providersResponse.json();
        providers.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider.id_proveedor;
            option.textContent = provider.nombre;
            providerSelect.appendChild(option);
        });

        const statusesResponse = await fetch('/api/states');
        const statuses = await statusesResponse.json();
        statuses.forEach(status => {
            const option = document.createElement('option');
            option.value = status.id_estado_producto;
            option.textContent = status.nombre_estado;
            statusSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar opciones de filtro:", error);
    }

    
}

document.addEventListener("DOMContentLoaded", function() {
    const registerExitModal = document.getElementById("registerExitModal");
    const exitTableBody = document.getElementById("exitTableBody");
    const addRowButton = document.getElementById("addRowButton");
  
    // Abrir el modal de salida
    document.getElementById("openExitModal").onclick = () => {
      registerExitModal.style.display = "block";
      addExitRow(); // Agregar una fila inicial
    };
  
    // Cerrar el modal de salida
    document.getElementById("closeExitModal").onclick = () => {
      registerExitModal.style.display = "none";
      exitTableBody.innerHTML = ""; // Limpiar las filas al cerrar
    };
  
    // Agregar una nueva fila al formulario
    addRowButton.onclick = addExitRow;
  
    // Función para agregar una fila de salida
    function addExitRow() {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>
          <select class="productSelect" required>
            <!-- Opciones de productos se cargarán dinámicamente -->
          </select>
        </td>
        <td>
          <input type="text" class="exitReason" required>
        </td>
        <td>
          <input type="number" class="exitQuantity" min="1" required>
        </td>
        <td>
          <button type="button" class="removeRowButton">-</button>
        </td>
      `;
      
      // Botón para eliminar la fila
      row.querySelector(".removeRowButton").onclick = () => row.remove();
  
      // Cargar productos en el selector de productos
      loadProductOptions(row.querySelector(".productSelect"));
  
      exitTableBody.appendChild(row);
    }
  
    // Cargar opciones de productos en el selector de cada fila
    async function loadProductOptions(selectElement) {
      try {
        const response = await fetch("/api/products");
        const products = await response.json();
        products.forEach(product => {
          const option = document.createElement("option");
          option.value = product.id_producto;
          option.textContent = product.nombre;
          selectElement.appendChild(option);
        });
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    }

    
  
    // Enviar el formulario de salida
    document.getElementById("registerExitForm").onsubmit = async function(event) {
      event.preventDefault();
      
      const exitData = Array.from(exitTableBody.querySelectorAll("tr")).map(row => ({
        id_producto: row.querySelector(".productSelect").value,
        motivo: row.querySelector(".exitReason").value,
        cantidad: row.querySelector(".exitQuantity").value,
      }));
  
      try {
        const response = await fetch("/api/movimientos/salidas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(exitData),
        });
  
        if (response.ok) {
          registerExitModal.style.display = "none";
          location.reload(); // Recargar para ver los cambios en el inventario
        } else {
          console.error("Error registrando salidas");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
  });
  