document.addEventListener("DOMContentLoaded", function () {
    const registerExitModal = document.getElementById("registerExitModal");
    const exitTableBody = document.getElementById("exitTableBody");
    const addRowButton = document.getElementById("addRowButton");
    const registerExitForm = document.getElementById("registerExitForm");

    document.getElementById("openExitModal").onclick = () => {
        registerExitModal.style.display = "block";
        addExitRow();
    };

    document.getElementById("closeExitModal").onclick = () => {
        registerExitModal.style.display = "none";
        exitTableBody.innerHTML = "";
    };

    addRowButton.onclick = addExitRow;

    function addExitRow() {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><select class="productSelect" required></select></td>
            <td><input type="text" class="exitReason" required></td>
            <td><input type="number" class="exitQuantity" min="1" required></td>
            <td><button type="button" class="removeRowButton">-</button></td>
        `;
        row.querySelector(".removeRowButton").onclick = () => row.remove();
        loadProductOptions(row.querySelector(".productSelect"));
        exitTableBody.appendChild(row);
    }

    async function loadProductOptions(selectElement) {
        try {
            const response = await fetch("/api/products");
            const products = await response.json();
            products.forEach(product => {
                const option = document.createElement("option");
                option.value = product.id_producto;
                option.textContent = product.nombre;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    }

    registerExitForm.onsubmit = async function (event) {
        event.preventDefault();

        const exitData = Array.from(exitTableBody.querySelectorAll("tr")).map(row => ({
            id_producto: row.querySelector(".productSelect").value,
            motivo: row.querySelector(".exitReason").value,
            cantidad: row.querySelector(".exitQuantity").value,
        }));

        try {
            const response = await fetch("/api/movimientos/salidas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(exitData),
            });

            if (!response.ok) throw new Error("Error registrando salidas");

            registerExitModal.style.display = "none";
            location.reload();
        } catch (error) {
            console.error("Error al registrar salidas:", error);
        }
    };
});
