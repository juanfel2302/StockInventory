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

            document.getElementById("addStockModal").style.display = "none";
            location.reload(); // Recargar la página para reflejar los cambios
        } catch (error) {
            console.error("Error al registrar la entrada de stock:", error);
        }
    };
});
