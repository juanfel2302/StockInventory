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

    closeEditModal.onclick = () => editProductModal.style.display = "none";

    editProductForm.onsubmit = async function (event) {
        event.preventDefault();

        const formData = new FormData(editProductForm);
        const data = Object.fromEntries(formData.entries());

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
