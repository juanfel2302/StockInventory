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
        // Realizar fetch para categorías y proveedores activos
        const [categoriesResponse, providersResponse] = await Promise.all([
            fetch("/api/categories"),
            fetch("/api/providers/active") // Usar la ruta de proveedores activos
        ]);

        if (!categoriesResponse.ok || !providersResponse.ok) {
            throw new Error("Error al cargar las opciones para los selectores");
        }

        const categories = await categoriesResponse.json();
        const providers = await providersResponse.json();

        console.log("Categorías cargadas:", categories);
        console.log("Proveedores activos cargados:", providers);

        // Select de categorías
        const categorySelect = document.getElementById("editProductCategory");
        categorySelect.innerHTML = ""; // Limpiar opciones existentes
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id_categoria;
            option.textContent = category.nombre_categoria;
            if (category.id_categoria == productData.id_categoria) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        });

        // Select de proveedores activos
        const providerSelect = document.getElementById("editProductProvider");
        providerSelect.innerHTML = ""; // Limpiar opciones existentes
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
        console.error("Error al cargar opciones del selector:", error);
    }
}
