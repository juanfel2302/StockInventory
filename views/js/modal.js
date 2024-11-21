document.addEventListener("DOMContentLoaded", function () {
  const registerExitModal = document.getElementById("registerExitModal");
  const exitTableBody = document.getElementById("exitTableBody");
  const addRowButton = document.getElementById("addRowButton");

  let productStocks = {}; // Almacenar stock globalmente

  // Abrir el modal de Salidas
  document.getElementById("openExitModal").onclick = () => {
      registerExitModal.style.display = "block";
      addExitRow(); // Agregar una fila inicial
  };

  // Cerrar el modal de Salidas
  document.getElementById("closeExitModal").onclick = () => {
      registerExitModal.style.display = "none";
      exitTableBody.innerHTML = ""; // Limpiar filas al cerrar el modal
  };

  // Función para cargar productos en un selector específico
  async function loadProductOptions(selectElement, query = "", searchBy = "nombre") {
      try {
          const endpoint = query
              ? `/api/products/search?q=${encodeURIComponent(query)}&by=${searchBy}`
              : "/api/products";

          const response = await fetch(endpoint);
          const products = await response.json();

          productStocks = {}; // Reiniciar datos de stock
          selectElement.innerHTML = ""; // Limpiar opciones previas

          if (products.length === 0) {
              const option = document.createElement("option");
              option.textContent = "No se encontraron productos";
              option.disabled = true;
              selectElement.appendChild(option);
          } else {
              products.forEach((product) => {
                  productStocks[product.id_producto] = product.stock;
                  const option = document.createElement("option");
                  option.value = product.id_producto;
                  option.textContent = `${product.nombre} (Código: ${product.codigo_barras || "N/A"}, Stock: ${product.stock})`;
                  selectElement.appendChild(option);
              });
          }
      } catch (error) {
          console.error("Error cargando productos:", error);
          showToast("Error al cargar productos.", "error");

      }
      
  }

  // Agregar una nueva fila al modal
  function addExitRow() {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>
              <select class="productSelect" required></select>
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

      const quantityInput = row.querySelector(".exitQuantity");
      const productSelect = row.querySelector(".productSelect");

      // Validar cantidad al cambiar el valor
      quantityInput.addEventListener("input", function () {
          const selectedProductId = productSelect.value;
          const availableStock = productStocks[selectedProductId] || 0;

          if (this.value > availableStock) {
              this.setCustomValidity(`No puedes retirar más de ${availableStock} unidades.`);
          } else {
              this.setCustomValidity(""); // Restablecer el estado de validación
          }
      });

      // Actualizar el stock máximo al cambiar el producto seleccionado
      productSelect.addEventListener("change", function () {
          const selectedProductId = this.value;
          const availableStock = productStocks[selectedProductId] || 0;

          // Si ya hay una cantidad introducida, validar de nuevo
          if (quantityInput.value > availableStock) {
              quantityInput.setCustomValidity(`No puedes retirar más de ${availableStock} unidades.`);
          } else {
              quantityInput.setCustomValidity(""); // Restablecer si es válido
          }
      });

      row.querySelector(".removeRowButton").onclick = () => row.remove();
      exitTableBody.appendChild(row);

      // Cargar opciones en el nuevo selector
      loadProductOptions(productSelect); // Cargar todos los productos inicialmente
  }

  // Filtrar productos por Nombre para la última fila
  document.getElementById("searchProductExit").addEventListener("input", function () {
      const query = this.value.trim();
      const lastRowSelect = exitTableBody.querySelector("tr:last-child .productSelect"); // Último selector
      if (lastRowSelect) {
          loadProductOptions(lastRowSelect, query, "nombre");
      }
  });

  // Filtrar productos por Código de Barras para la última fila
  document.getElementById("searchProductExitBarcode").addEventListener("input", function () {
      const query = this.value.trim();
      const lastRowSelect = exitTableBody.querySelector("tr:last-child .productSelect"); // Último selector
      if (lastRowSelect) {
          loadProductOptions(lastRowSelect, query, "codigo_barras");
      }
  });

  // Enviar formulario de Salidas
  document.getElementById("registerExitForm").onsubmit = async function (event) {
      event.preventDefault();

      let hasError = false;
      const exitData = Array.from(exitTableBody.querySelectorAll("tr")).map((row) => {
          const id_producto = row.querySelector(".productSelect").value;
          const cantidad = parseInt(row.querySelector(".exitQuantity").value, 10);
          const motivo = row.querySelector(".exitReason").value;

          return { id_producto, cantidad, motivo };
      });

      if (hasError) return; // Detener si hay errores

      try {
          const response = await fetch("/api/movimientos/salidas", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(exitData),
          });

          if (response.ok) {
              registerExitModal.style.display = "none";
              showToast("Salida registrada exitosamente!", "success");

              location.reload(); // Refrescar para reflejar cambios
          } else {
              console.error("Error registrando salidas");
              
          }
      } catch (error) {
          console.error("Error en la solicitud:", error);
          showToast("Error al registrar la salida.", "error");

      }
  };
});
