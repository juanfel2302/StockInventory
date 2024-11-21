document.addEventListener("DOMContentLoaded", function () {
    const addProductButton = document.getElementById("addProductButton");
    const addProductModal = document.getElementById("addProductModal");
    const closeModal = document.getElementById("closeModal");
    const addProductForm = document.getElementById("addProductForm");

    addProductButton.onclick = () => addProductModal.style.display = "block";

    closeModal.onclick = () => addProductModal.style.display = "none";

    window.onclick = (event) => {
        if (event.target == addProductModal) {
            addProductModal.style.display = "none";
        }
    };

    
    addProductForm.onsubmit = async function (event) {
        event.preventDefault();

        const formData = new FormData(addProductForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Error al agregar el producto");

            addProductModal.style.display = "none";
            showToast("Producto agregado exitosamente!", "success");
            location.reload();
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            showToast("Error al agregar el producto.", "error");
        }
    };
  
});

