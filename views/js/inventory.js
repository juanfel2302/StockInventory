document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch("/api/products", { method: "GET" });
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }
        
        const products = await response.json();
        console.log(products); // Verifica si los productos se están recibiendo

        const tableBody = document.getElementById("inventoryTable");
        products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.nombre}</td>
                <td>${product.precio}</td>
                <td>${product.categoria}</td>
                <td>${product.stock}</td>
                <td>${product.estado}</td>
                <td>${product.proveedor}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar el inventario:", error);
    }
});

  