document.addEventListener("DOMContentLoaded", function () {
    const editProductModal = document.getElementById("editProductModal");
    const closeEditModal = document.getElementById("closeEditModal");
    const editProductForm = document.getElementById("editProductForm");

    document.getElementById("inventoryTable").addEventListener("click", async function (event) {
        if (event.target.closest(".edit-button")) {
            const button = event.target.closest(".edit-button");

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

            document.getElementById("editProductId").value = productData.id_producto;
            document.getElementById("editProductName").value = productData.nombre;
            document.getElementById("editProductBarcode").value = productData.codigo_barras;
            document.getElementById("editProductPrice").value = productData.precio;
            document.getElementById("editProductMinStock").value = productData.stock_minimo;
            document.getElementById("editProductExpiry").value = productData.fecha_caducidad
                ? new Date(productData.fecha_caducidad).toISOString().split("T")[0]
                : "";

            await loadEditSelectOptions(productData);

            editProductModal.style.display = "block";
        }
    });

    closeEditModal.onclick = () => (editProductModal.style.display = "none");

    editProductForm.onsubmit = async function (event) {
        event.preventDefault();

        const formData = new FormData(editProductForm);
        const data = {
            ...Object.fromEntries(formData.entries()),
            id_categoria: parseInt(document.getElementById("editProductCategory").value, 10),
            id_proveedor: parseInt(document.getElementById("editProductProvider").value, 10),
        };

        // Elimina explícitamente el campo stock si está presente
        delete data.stock;

        console.log("Datos enviados al servidor (sin stock):", data);

        try {
            const response = await fetch(`/api/products/${data.id_producto}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Error al actualizar el producto");

            editProductModal.style.display = "none";
            location.reload();
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    };
});

// Función para cargar las opciones en los select (categorías, proveedores, etc.)
async function loadEditSelectOptions(productData) {
    try {
        const [categoriesResponse, providersResponse] = await Promise.all([
            fetch("/api/categories"),
            fetch("/api/providers"),
        ]);

        if (!categoriesResponse.ok || !providersResponse.ok) {
            throw new Error("Error al cargar las opciones para los select");
        }

        const categories = await categoriesResponse.json();
        console.log("Categorías cargadas:", categories); // <-- Log para verificar
        const providers = await providersResponse.json();
        console.log("Proveedores cargados:", providers); // <-- Log para verificar

        const categorySelect = document.getElementById("editProductCategory");
        const providerSelect = document.getElementById("editProductProvider");

        // Limpiar los selects antes de llenarlos
        categorySelect.innerHTML = "";
        providerSelect.innerHTML = "";

        // Llenar el select de categorías
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id_categoria;
            option.textContent = category.nombre_categoria; // Asegúrate que coincide con el modelo
            if (category.id_categoria == productData.id_categoria) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        });

        // Llenar el select de proveedores
        providers.forEach((provider) => {
            const option = document.createElement("option");
            option.value = provider.id_proveedor;
            option.textContent = provider.nombre;
            if (provider.id_proveedor == productData.id_proveedor) {
                option.selected = true;
            }
            providerSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar las opciones:", error);
    }
}
