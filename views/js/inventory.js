document.addEventListener("DOMContentLoaded", async function() {
  // Cargar productos en la tabla al iniciar
  try {
      const response = await fetch("/api/products", { method: "GET" });
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      
      const products = await response.json();
      renderProducts(products);
  } catch (error) {
      console.error("Error al cargar el inventario:", error);
  }

  await loadSelectOptions(); // Cargar categorías, estados y proveedores en los selectores

  const addProductButton = document.getElementById("addProductButton");
  const addProductModal = document.getElementById("addProductModal");
  const closeModal = document.getElementById("closeModal");

  addProductButton.onclick = function() { addProductModal.style.display = "block"; };
  closeModal.onclick = function() { addProductModal.style.display = "none"; };
  window.onclick = function(event) {
      if (event.target == addProductModal) addProductModal.style.display = "none";
  };

  const addProductForm = document.getElementById("addProductForm");
  addProductForm.onsubmit = async function(event) {
      event.preventDefault();
      
      const formData = new FormData(addProductForm);
      const data = Object.fromEntries(formData.entries());

      try {
          const response = await fetch("/api/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
          });

          if (response.ok) {
              addProductModal.style.display = "none";
              addNotification(`Producto "${data.nombre}" agregado exitosamente.`);
              location.reload(); 
          } else {
              throw new Error("Error al agregar el producto");
          }
      } catch (error) {
          console.error("Error al guardar el producto:", error);
      }
  };

  document.getElementById("filterButton").addEventListener("click", function () {
      document.getElementById("filterModal").style.display = "block";
      loadFilterOptions();
  });

  document.getElementById("closeFilterModal").addEventListener("click", function () {
      document.getElementById("filterModal").style.display = "none";
  });

  window.addEventListener("click", function (event) {
      const filterModal = document.getElementById("filterModal");
      if (event.target == filterModal) filterModal.style.display = "none";
  });

  document.getElementById("filterForm").addEventListener("submit", async function (event) {
      event.preventDefault();

      const category = document.getElementById("categoryFilter").value || null;
      const provider = document.getElementById("providerFilter").value || null;
      const status = document.getElementById("statusFilter").value || null;
  
      try {
          const response = await fetch(`/api/products/filter?category=${category || ''}&provider=${provider || ''}&status=${status || ''}`);
          const products = await response.json();
          renderProducts(products);
          document.getElementById("filterModal").style.display = "none";
      } catch (error) {
          console.error("Error al filtrar productos:", error);
      }
  });
});

function renderProducts(products) {
  const tableBody = document.getElementById("inventoryTable");
  tableBody.innerHTML = ""; 

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

document.addEventListener("DOMContentLoaded", function() {
  const registerExitModal = document.getElementById("registerExitModal");
  const exitTableBody = document.getElementById("exitTableBody");
  const addRowButton = document.getElementById("addRowButton");

  document.getElementById("openExitModal").onclick = () => {
    registerExitModal.style.display = "block";
    addExitRow();
  };

  document.getElementById("closeExitModal").onclick = () => {
    registerExitModal.style.display = "none";
    exitTableBody.innerHTML = ""; 
  };

  addRowButton.onclick = addExitRow;

  function addExitRow() {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <select class="productSelect" required>
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
    
    row.querySelector(".removeRowButton").onclick = () => row.remove();

    loadProductOptions(row.querySelector(".productSelect"));

    exitTableBody.appendChild(row);
  }

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
        addNotification("Salida de producto registrada exitosamente.");
        location.reload();
      } else {
        console.error("Error registrando salidas");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
});

// Función para agregar notificación
function addNotification(message) {
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  notifications.push({ message, timestamp: new Date().toLocaleString() });
  localStorage.setItem("notifications", JSON.stringify(notifications));
}
