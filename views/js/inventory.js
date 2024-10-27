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
});
