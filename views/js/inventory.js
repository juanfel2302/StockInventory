document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch("/api/products", { method: "GET" });
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }
        
        const products = await response.json();
        console.log(products); // Verifica si los productos se están recibiendo correctamente

        const tableBody = document.getElementById("inventoryTable");
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
    } catch (error) {
        console.error("Error al cargar el inventario:", error);
    }

    await loadSelectOptions(); // Cargar categorías, estados y proveedores en los selectores

    // Lógica para abrir y cerrar el modal
    const addProductButton = document.getElementById("addProductButton");
    const modal = document.getElementById("addProductModal");
    const closeModal = document.getElementById("closeModal");

    addProductButton.onclick = function() {
        modal.style.display = "block";
    };

    closeModal.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    const addProductForm = document.getElementById("addProductForm");
    addProductForm.onsubmit = async function(event) {
        event.preventDefault();
        
        const formData = new FormData(addProductForm);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error("Error al agregar el producto");
            }

            modal.style.display = "none";
            location.reload();
        } catch (error) {
            console.error("Error al guardar el producto:", error);
        }
    };
});

async function loadSelectOptions() {
    // Cargar categorías
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
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }

    // Cargar estados
    try {
        const stateResponse = await fetch('/api/states');
        const states = await stateResponse.json();
        const stateSelect = document.getElementById('productState');
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state.id_estado_producto;
            option.textContent = state.nombre_estado;
            stateSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar estados:", error);
    }

    // Cargar proveedores
    try {
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
        console.error("Error al cargar proveedores:", error);
    }
}
