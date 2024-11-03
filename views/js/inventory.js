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
  