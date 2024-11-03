document.addEventListener("DOMContentLoaded", function () {
    const registerExitModal = document.getElementById("registerExitModal");
    const exitTableBody = document.getElementById("exitTableBody");
    const addRowButton = document.getElementById("addRowButton");

    document.getElementById("openExitModal").onclick = () => {
        registerExitModal.style.display = "block";
        addExitRow(); // Initial row
    };

    document.getElementById("closeExitModal").onclick = () => {
        registerExitModal.style.display = "none";
        exitTableBody.innerHTML = ""; // Clear rows on close
    };

    addRowButton.onclick = addExitRow;

    function addExitRow() {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>
          <select class="productSelect" required>
            <!-- Product options will be loaded here -->
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

    // Store product stock data globally
    let productStocks = {};

    async function loadProductOptions(selectElement) {
        try {
            const response = await fetch("/api/products");
            const products = await response.json();

            products.forEach(product => {
                // Store each product's stock data
                console.log("Product object:", product);
                productStocks[product.id_producto] = product.stock;

                // Populate dropdown options
                const option = document.createElement("option");
                option.value = product.id_producto;
                option.textContent = product.nombre;
                selectElement.appendChild(option);
            });
            console.log("Product Stocks:", productStocks);
        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    }

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
      
        // Selecciona el producto y establece el valor máximo del stock disponible
        const productSelect = row.querySelector(".productSelect");
        const quantityInput = row.querySelector(".exitQuantity");
        productSelect.onchange = function() {
            const selectedProductId = productSelect.value;
            const maxQuantity = productStocks[selectedProductId] || 0;
            const quantityInput = row.querySelector(".exitQuantity");
            quantityInput.max = maxQuantity;
            quantityInput.value = ""; // Limpia el campo cuando cambia el producto seleccionado
        };
        
      
        // Carga las opciones de productos en el selector
        loadProductOptions(productSelect);
      
        // Configuración del botón para eliminar la fila
        row.querySelector(".removeRowButton").onclick = () => row.remove();
      
        exitTableBody.appendChild(row);
    }
    
      
    document.getElementById("registerExitForm").onsubmit = async function(event) {
        event.preventDefault();
      
        const exitData = Array.from(exitTableBody.querySelectorAll("tr")).map(row => {
          const id_producto = row.querySelector(".productSelect").value;
          const cantidad = parseInt(row.querySelector(".exitQuantity").value, 10);
          const motivo = row.querySelector(".exitReason").value;
          const availableStock = productStocks[id_producto] || 0;
      
          // Check if quantity exceeds available stock
          if (cantidad > availableStock) {
            alert(`La cantidad solicitada (${cantidad}) excede el stock disponible (${availableStock}) para el producto.`);
            throw new Error("Cantidad excede el stock disponible");
          }
      
          return { id_producto, cantidad, motivo };
        });
      
        // Proceed with API call if validation passes
        try {
          const response = await fetch("/api/movimientos/salidas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exitData),
          });
      
          if (response.ok) {
            registerExitModal.style.display = "none";
            location.reload(); // Reload to reflect changes in inventory
          } else {
            console.error("Error registrando salidas");
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      };      
});
