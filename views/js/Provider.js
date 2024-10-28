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
                <td>
                    <button class="edit-button" data-id="${provider.id_proveedor}" data-nombre="${provider.nombre}" data-telefono="${provider.telefono}" data-email="${provider.email}" data-estado="${provider.estado}">
                        <i class="fas fa-edit"></i> <!-- Ícono de editar -->
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar proveedores:", error);
    }

    // Lógica para abrir y cerrar el modal de agregar proveedor
    const addProviderButton = document.getElementById("addProviderButton");
    const addModal = document.getElementById("addProviderModal");
    const closeAddModal = document.getElementById("closeAddModal");

    addProviderButton.onclick = function() {
        addModal.style.display = "block";
    };

    closeAddModal.onclick = function() {
        addModal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == addModal) {
            addModal.style.display = "none";
        }
    };

    // Lógica para abrir el modal de editar proveedor
    const editModal = document.getElementById("editProviderModal");
    const closeEditModal = document.getElementById("closeEditModal");

    // Escuchar los clics en los botones de editar
    document.getElementById("providerTable").addEventListener("click", function(event) {
        if (event.target.closest(".edit-button")) {
            const button = event.target.closest(".edit-button");
            const id = button.dataset.id;
            const nombre = button.dataset.nombre;
            const telefono = button.dataset.telefono;
            const email = button.dataset.email;
            const estado = button.dataset.estado;

            // Rellenar el formulario de edición
            document.getElementById("editProviderId").value = id;
            document.getElementById("editProviderName").value = nombre;
            document.getElementById("editProviderPhone").value = telefono;
            document.getElementById("editProviderEmail").value = email;
            document.getElementById("editProviderStatus").value = estado;

            editModal.style.display = "block"; // Mostrar modal de edición
        }
    });

    closeEditModal.onclick = function() {
        editModal.style.display = "none"; // Cerrar modal de edición
    };

    window.onclick = function(event) {
        if (event.target == editModal) {
            editModal.style.display = "none"; // Cerrar modal de edición al hacer clic fuera
        }
    };

    // Lógica para agregar proveedor
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

            addModal.style.display = "none"; // Cerrar modal de agregar
            location.reload(); // Recargar para actualizar la lista de proveedores
        } catch (error) {
            console.error("Error al agregar proveedor:", error);
        }
    };

    // Lógica para editar proveedor
    const editProviderForm = document.getElementById("editProviderForm");
    editProviderForm.onsubmit = async function(event) {
        event.preventDefault();

        const formData = new FormData(editProviderForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`/api/providers/${data.id_proveedor}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el proveedor");
            }

            editModal.style.display = "none"; // Cerrar modal de edición
            location.reload(); // Recargar para actualizar la lista de proveedores
        } catch (error) {
            console.error("Error al editar proveedor:", error);
        }
    };
});
