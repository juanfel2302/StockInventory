document.addEventListener("DOMContentLoaded", function () {
    const addStockModal = document.getElementById("addStockModal");
    const closeAddStockModal = document.getElementById("closeAddStockModal");
    const openAddStockModal = document.getElementById("openAddStockModal");

    // Abrir modal
    openAddStockModal.onclick = () => {
        addStockModal.style.display = "block";
        loadProductOptions(); // Cargar productos en el selector
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

    // Cargar productos en el selector
    async function loadProductOptions() {
        try {
            const response = await fetch("/api/products");
            const products = await response.json();
            const productSelect = document.getElementById("stockProductSelect");
            productSelect.innerHTML = ""; // Limpiar opciones existentes
            products.forEach((product) => {
                const option = document.createElement("option");
                option.value = product.id_producto;
                option.textContent = product.nombre;
                productSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    }

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
