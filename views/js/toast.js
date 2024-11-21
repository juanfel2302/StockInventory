document.addEventListener("DOMContentLoaded", function () {
    const testToastButton = document.getElementById("testToastButton");

    function showToast(message, type = "success") {
        const toastContainer = document.getElementById("toastContainer");

        if (!toastContainer) {
            console.error("No se encontró el contenedor de toasts en el DOM.");
            return;
        }

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Eliminar el toast después de 3 segundos
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    testToastButton.addEventListener("click", () => {
        showToast("Este es un mensaje de prueba de toast!", "success");
    });
});
