document.addEventListener("DOMContentLoaded", function () {
    const filterModal = document.getElementById("filterModal");
    const filterButton = document.getElementById("filterButton");
    const closeFilterModal = document.getElementById("closeFilterModal");
    const filterForm = document.getElementById("filterForm");
    const searchProductFilter = document.getElementById("searchProductFilter");

    let allCategories = [];
    let allProviders = [];
    let allStatuses = [];

    // Abrir el modal de filtros y cargar opciones
    filterButton.onclick = () => {
        loadFilterOptions();
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
    
        const query = searchProductFilter.value.trim(); // Captura el texto del campo de búsqueda
        const category = document.getElementById("categoryFilter").value || null;
        const provider = document.getElementById("providerFilter").value || null;
        const status = document.getElementById("statusFilter").value || null;
    
        let endpoint = '/api/products/filter'; // Endpoint predeterminado para filtros
    
        if (query) {
            // Usa el nuevo endpoint para búsqueda por texto
            endpoint = `/api/products/search-filter?q=${encodeURIComponent(query)}`;
        } else {
            // Si no hay texto, aplica los filtros normales
            endpoint += `?category=${category || ''}&provider=${provider || ''}&status=${status || ''}`;
        }
    
        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error("Error al filtrar productos");
    
            const products = await response.json();
            renderProducts(products); // Actualiza la tabla con los resultados
            filterModal.style.display = "none"; // Cierra el modal
        } catch (error) {
            console.error("Error al buscar o filtrar productos:", error);
        }
    };

    // Función para cargar las opciones dinámicas
    async function loadFilterOptions() {
        try {
            const categorySelect = document.getElementById('categoryFilter');
            const providerSelect = document.getElementById('providerFilter');
            const statusSelect = document.getElementById('statusFilter');

            // Limpiar listas desplegables
            categorySelect.innerHTML = '<option value="">Todas</option>';
            providerSelect.innerHTML = '<option value="">Todos</option>';
            statusSelect.innerHTML = '<option value="">Todos</option>';

            const [categories, providers, statuses] = await Promise.all([
                fetch('/api/categories').then(res => res.ok ? res.json() : []),
                fetch('/api/providers').then(res => res.ok ? res.json() : []),
                fetch('/api/states').then(res => res.ok ? res.json() : [])
            ]);

            // Guardar todas las opciones en variables globales
            allCategories = categories || [];
            allProviders = providers || [];
            allStatuses = statuses || [];

            // Llenar selectores con opciones iniciales
            populateOptions(categorySelect, allCategories, "id_categoria", "nombre_categoria");
            populateOptions(providerSelect, allProviders, "id_proveedor", "nombre");
            populateOptions(statusSelect, allStatuses, "id_estado_producto", "nombre_estado");
        } catch (error) {
            console.error("Error al cargar opciones de filtro:", error);
        }
    }

    // Llenar un selector con opciones
    function populateOptions(selectElement, items, valueField, textField) {
        selectElement.innerHTML = '<option value="">Todas</option>'; // Limpiar opciones y agregar la opción predeterminada
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            selectElement.appendChild(option);
        });
    }
});
