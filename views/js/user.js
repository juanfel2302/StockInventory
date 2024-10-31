document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch("/api/users", { method: "GET" });
        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const users = await response.json();
        const tableBody = document.getElementById("userTable").querySelector("tbody");

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id_usuario}</td>
                <td>${user.nombre_usuario}</td>
                <td>${user.contrasena}</td>
                <td>${user.es_administrador === "true" ? 'Sí' : 'No'}</td>
                <td>${user.estado === "true" ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button class="edit-button" data-id="${user.id_usuario}" data-nombre="${user.nombre_usuario}" data-contrasena="${user.contrasena}" data-administrador="${user.es_administrador}" data-estado="${user.estado}">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        alert("No se pudieron cargar los usuarios. Intente de nuevo más tarde."); // Mensaje al usuario
    }

    // Funciones para abrir y cerrar modales
    function openModal(modal) {
        modal.style.display = "block";
    }

    function closeModal(modal) {
        modal.style.display = "none";
    }

    // Lógica para abrir y cerrar el modal de agregar usuario
    const addUserButton = document.getElementById("addUserButton");
    const addUserModal = document.getElementById("addUserModal");
    const closeAddModal = document.getElementById("closeAddModal");

    addUserButton.onclick = () => openModal(addUserModal);
    closeAddModal.onclick = () => closeModal(addUserModal);
    
    window.onclick = (event) => {
        if (event.target === addUserModal) closeModal(addUserModal);
    };

    // Lógica para abrir el modal de editar usuario
    const editUserModal = document.getElementById("editUserModal");
    const closeEditModal = document.getElementById("closeEditModal");

    document.getElementById("userTable").addEventListener("click", function(event) {
        if (event.target.closest(".edit-button")) {
            const button = event.target.closest(".edit-button");
            document.getElementById("editUserId").value = button.dataset.id;
            document.getElementById("editUserName").value = button.dataset.nombre;
            document.getElementById("editUserPassword").value = button.dataset.contrasena;
            document.getElementById("editUserAdmin").value = button.dataset.administrador;
            document.getElementById("editUserStatus").value = button.dataset.estado;

            openModal(editUserModal); // Mostrar modal de edición
        }
    });

    closeEditModal.onclick = () => closeModal(editUserModal);
    window.onclick = (event) => {
        if (event.target === editUserModal) closeModal(editUserModal);
    };

    // Lógica para agregar usuario
    const addUserForm = document.getElementById("addUserForm");
    addUserForm.onsubmit = async function(event) {
        event.preventDefault();
        const formData = new FormData(addUserForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Error al agregar el usuario");

            closeModal(addUserModal); // Cerrar modal de agregar
            location.reload(); // Recargar para actualizar la lista de usuarios
        } catch (error) {
            console.error("Error al agregar usuario:", error);
            alert("No se pudo agregar el usuario. Intente de nuevo."); // Mensaje al usuario
        }
    };

    // Lógica para editar usuario
    const editUserForm = document.getElementById("editUserForm");
    editUserForm.onsubmit = async function(event) {
        event.preventDefault();
        const formData = new FormData(editUserForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`/api/users/${data.id_usuario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Error al actualizar el usuario");

            closeModal(editUserModal); // Cerrar modal de edición
            location.reload(); // Recargar para actualizar la lista de usuarios
        } catch (error) {
            console.error("Error al editar usuario:", error);
            alert("No se pudo actualizar el usuario. Intente de nuevo."); // Mensaje al usuario
        }
    };
});
