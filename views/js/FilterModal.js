document.addEventListener("DOMContentLoaded", function () {
    const filterModal = document.getElementById("filterModal");
    const filterButton = document.getElementById("filterButton");
    const closeFilterModal = document.getElementById("closeFilterModal");
    const filterForm = document.getElementById("filterForm");

    // Abrir el modal de filtros y cargar opciones
    filterButton.onclick = () => {
        loadFilterOptions(); // Llamar aquí la función
        filterModal.style.display = "block";
    };

    // Cerrar el modal
    closeFilterModal.onclick = () => filterModal.style.display = "none";

    // Cerrar el modal al hacer clic fuera de él
    window.onclick = (event) => {
        if (event.target == filterModal) {
            filterModal.style.display = "none";
        }
    };

    // Procesar el formulario de filtros
    filterForm.onsubmit = async function (event) {
        event.preventDefault();

        const category = document.getElementById("categoryFilter").value || null;
        const provider = document.getElementById("providerFilter").value || null;
        const status = document.getElementById("statusFilter").value || null;

        try {
            const response = await fetch(`/api/products/filter?category=${category || ''}&provider=${provider || ''}&status=${status || ''}`);
            if (!response.ok) throw new Error("Error al filtrar productos");

            const products = await response.json();
            renderProducts(products); // Actualizar la tabla con los resultados
            filterModal.style.display = "none";
        } catch (error) {
            console.error("Error al filtrar productos:", error);
        }
    };
});

// Función para cargar las opciones dinámicas
async function loadFilterOptions() {
    try {
        const categorySelect = document.getElementById('categoryFilter');
        categorySelect.innerHTML = '<option value="">Todas</option>';
        const providerSelect = document.getElementById('providerFilter');
        providerSelect.innerHTML = '<option value="">Todos</option>';
        const statusSelect = document.getElementById('statusFilter');
        statusSelect.innerHTML = '<option value="">Todos</option>';

        const categoriesResponse = await fetch('/api/categories');
        if (categoriesResponse.ok) {
            const categories = await categoriesResponse.json();
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id_categoria;
                option.textContent = category.nombre_categoria;
                categorySelect.appendChild(option);
            });
        }

        const providersResponse = await fetch('/api/providers');
        if (providersResponse.ok) {
            const providers = await providersResponse.json();
            providers.forEach(provider => {
                const option = document.createElement('option');
                option.value = provider.id_proveedor;
                option.textContent = provider.nombre;
                providerSelect.appendChild(option);
            });
        }

        const statusesResponse = await fetch('/api/states');
        if (statusesResponse.ok) {
            const statuses = await statusesResponse.json();
            statuses.forEach(status => {
                const option = document.createElement('option');
                option.value = status.id_estado_producto;
                option.textContent = status.nombre_estado;
                statusSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar opciones de filtro:", error);
    }
}
