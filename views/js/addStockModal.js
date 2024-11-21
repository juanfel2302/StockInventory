document.addEventListener("DOMContentLoaded", function () {
    const addStockModal = document.getElementById("addStockModal");
    const closeAddStockModal = document.getElementById("closeAddStockModal");
    const openAddStockModal = document.getElementById("openAddStockModal");
    const searchProductNameInput = document.getElementById("searchProductName");
    const searchProductBarcodeInput = document.getElementById("searchProductBarcode");
    const productSelect = document.getElementById("stockProductSelect");

    // Abrir modal
    openAddStockModal.onclick = () => {
        addStockModal.style.display = "block";
        loadProductOptions(""); // Cargar todos los productos al abrir el modal
    };

    // Cerrar modal
    closeAddStockModal.onclick = () => {
        addStockModal.style.display = "none";
    };

    // Cerrar modal si se hace clic fuera de él
    window.onclick = (event) => {
        if (event.target == addStockModal) {
            addStockModal.style.display = "none";
        }
    };


    // Función para cargar productos en el selector
    async function loadProductOptions(query = "", searchBy = "nombre") {
        try {
            // Si no hay un término de búsqueda, cargar todos los productos
            const endpoint = query
                ? `/api/products/search?q=${encodeURIComponent(query)}&by=${searchBy}`
                : "/api/products";

            const response = await fetch(endpoint);
            const products = await response.json();
            const productSelect = document.getElementById("stockProductSelect");

            productSelect.innerHTML = ""; // Limpiar opciones existentes

            if (products.length === 0) {
                const option = document.createElement("option");
                option.textContent = "No se encontraron productos";
                option.disabled = true;
                productSelect.appendChild(option);
            } else {
                products.forEach((product) => {
                    const option = document.createElement("option");
                    option.value = product.id_producto;
                    option.textContent = `${product.nombre} (Código: ${product.codigo_barras}, Stock: ${product.stock})`;
                    productSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    }

    // Manejar el evento de búsqueda por nombre
    searchProductNameInput.addEventListener("input", () => {
        const query = searchProductNameInput.value.trim();
        loadProductOptions(query, "nombre");
    });

    // Manejar el evento de búsqueda por código de barras
    searchProductBarcodeInput.addEventListener("input", () => {
        const query = searchProductBarcodeInput.value.trim();
        loadProductOptions(query, "codigo_barras");
    });

    // Manejar envío del formulario
    document.getElementById("addStockForm").onsubmit = async function (event) {
        event.preventDefault();

        const formData = new FormData(document.getElementById("addStockForm"));
        const data = Object.fromEntries(formData.entries());

        // Agregar tipo de movimiento de entrada
        data.id_tipo_movimiento = 1; // 1 para "Ingreso de Stock"
    

        try {
            const response = await fetch("/api/movimientos/entradas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Error al registrar la entrada de stock");
            }

            // Cerrar el modal
            document.getElementById("addStockModal").style.display = "none";
            Toastify({
                text: "Entrada de stock registrada exitosamente.",
                duration: 3000, // Duración en milisegundos
                close: true, // Botón para cerrar
                gravity: "bottom", // Posición: "top" o "bottom"
                position: "right", // Posición: "left", "center", o "right"
                backgroundColor: "#4caf50", // Color del fondo
            }).showToast();

            // Mostrar el toast de éxito
            // Opcional: actualiza la tabla o contenido dinámicamente sin recargar
            updateInventoryTable();
        } catch (error) {
            console.error("Error al registrar la entrada de stock:", error);
        }
    };


    async function updateInventoryTable() {
        try {
            const response = await fetch("/api/products");
            if (!response.ok) {
                throw new Error("Error al obtener los productos del servidor.");
            }

            const products = await response.json();
            const inventoryTable = document.getElementById("inventoryTable");
            inventoryTable.innerHTML = ""; // Limpia la tabla existente

            products.forEach(product => {
                const row = `
                <tr>
                    <td>${product.nombre}</td>
                    <td>${product.precio}</td>
                    <td>${product.categoria}</td>
                    <td>${product.stock}</td>
                    <td>${product.stock_minimo}</td>
                    <td>${product.estado}</td>
                    <td>${product.proveedor}</td>
                    <td>${product.fecha_caducidad}</td>
                    <td>
                        <button 
                            class="edit-button" 
                            data-id="${product.id_producto}" 
                            data-nombre="${product.nombre}" 
                            data-codigo_barras="${product.codigo_barras}" 
                            data-precio="${product.precio}" 
                            data-id_categoria="${product.id_categoria}" 
                            data-stock_minimo="${product.stock_minimo}" 
                            data-id_proveedor="${product.id_proveedor}" 
                            data-fecha_caducidad="${product.fecha_caducidad}">
                             <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
                inventoryTable.insertAdjacentHTML("beforeend", row);
            });
        } catch (error) {
            console.error("Error actualizando la tabla de inventario:", error);
            Toastify({
                text: "Error al actualizar la tabla de inventario.",
                duration: 3000,
                close: true,
                gravity: "Bottom",
                position: "right",
                backgroundColor: "#f44336",
            }).showToast();
        }
        

    }



});

