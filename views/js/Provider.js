document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Fetch para obtener la lista de proveedores
        const response = await fetch("/api/providers", { method: "GET" });
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const providers = await response.json();
        console.log(providers); // Verifica si los proveedores se están recibiendo correctamente

        const tableBody = document.getElementById("providerTable");
        providers.forEach(provider => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${provider.id_proveedor}</td>
                <td>${provider.nombre}</td>
                <td>${provider.telefono}</td>
                <td>${provider.email}</td>
                <td>${provider.estado === 1 ? 'Activo' : 'Inactivo'}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar proveedores:", error);
    }

    // Lógica para abrir y cerrar el modal de agregar proveedor
    const addProviderButton = document.getElementById("addProviderButton");
    const modal = document.getElementById("addProviderModal");
    const closeModal = document.getElementById("closeModal");

    addProviderButton.onclick = function() {
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

    const addProviderForm = document.getElementById("addProviderForm");
    addProviderForm.onsubmit = async function(event) {
        event.preventDefault();
        
        const formData = new FormData(addProviderForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/api/providers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Error al agregar el proveedor");
            }

            modal.style.display = "none";
            location.reload(); // Recargar para actualizar la lista de proveedores
        } catch (error) {
            console.error("Error al guardar el proveedor:", error);
        }
    };
});
