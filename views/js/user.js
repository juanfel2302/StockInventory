document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/api/users", { method: "GET" });
        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const users = await response.json();
        const tableBody = document.getElementById("userTable"); // Asegúrate de que este ID coincida con el tbody

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id_usuario}</td>
                <td>${user.nombre_usuario}</td>
                <td>••••••</td> <!-- Mostrar texto fijo en lugar del hash -->
                <td>${user.es_administrador === "true" || user.es_administrador ? 'Sí' : 'No'}</td>
                <td>${user.estado === "true" || user.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button class="edit-button" 
                            data-id="${user.id_usuario}" 
                            data-nombre="${user.nombre_usuario}" 
                            data-contrasena="${user.contrasena}" 
                            data-administrador="${user.es_administrador}" 
                            data-estado="${user.estado}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-button" data-id="${user.id_usuario}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        alert("No se pudieron cargar los usuarios. Intente de nuevo más tarde.");
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

    if (addUserButton && addUserModal && closeAddModal) {
        addUserButton.onclick = () => openModal(addUserModal);
        closeAddModal.onclick = () => closeModal(addUserModal);
    }

    // Lógica para abrir el modal de editar usuario
    const editUserModal = document.getElementById("editUserModal");
    const closeEditModal = document.getElementById("closeEditModal");

    document.getElementById("userTable")?.addEventListener("click", function (event) {
        const button = event.target.closest(".edit-button");
        if (button && editUserModal) {
            document.getElementById("editUserId").value = button.dataset.id;
            document.getElementById("editUserName").value = button.dataset.nombre;
            document.getElementById("editUserPassword").value = button.dataset.contrasena;
            document.getElementById("editUserAdmin").value = button.dataset.administrador;
            document.getElementById("editUserStatus").value = button.dataset.estado;

            openModal(editUserModal);
        }
    });

    if (closeEditModal) closeEditModal.onclick = () => closeModal(editUserModal);

    // Evento global para cerrar modales al hacer clic fuera de ellos
    window.onclick = (event) => {
        if (event.target === addUserModal) closeModal(addUserModal);
        if (event.target === editUserModal) closeModal(editUserModal);
    };

    // Lógica para agregar usuario
    const addUserForm = document.getElementById("addUserForm");
    addUserForm.onsubmit = async function (event) {
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

            closeModal(addUserModal);
            location.reload();
        } catch (error) {
            console.error("Error al agregar usuario:", error);
            alert("No se pudo agregar el usuario. Intente de nuevo.");
        }
    };

    // Lógica para editar usuario
    const editUserForm = document.getElementById("editUserForm");
    editUserForm.onsubmit = async function (event) {
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

            closeModal(editUserModal);
            location.reload();
        } catch (error) {
            console.error("Error al editar usuario:", error);
            alert("No se pudo actualizar el usuario. Intente de nuevo.");
        }
    };

    document.getElementById("userTable").addEventListener("click", async function (event) {
        const button = event.target.closest(".delete-button");
        if (button) {
            const userId = button.dataset.id;
            if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
                try {
                    const response = await fetch(`/api/users/${userId}`, { method: "DELETE" });
                    if (!response.ok) throw new Error("Error al eliminar el usuario");
                    alert("Usuario eliminado exitosamente.");
                    location.reload(); // Recargar la página para actualizar la tabla
                } catch (error) {
                    console.error("Error al eliminar usuario:", error);
                    alert("No se pudo eliminar el usuario. Intente de nuevo.");
                }
            }
        }
    });
});
