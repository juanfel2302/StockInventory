document.addEventListener('DOMContentLoaded', async function () {
    const notificationsList = document.querySelector('.notifications-list');
    const markAllReadButton = document.querySelector('.mark-all-read');

    async function loadNotifications() {
        try {
            const response = await fetch('/api/notifications');
            if (!response.ok) throw new Error('Error al obtener las notificaciones');

            const notifications = await response.json();
            notificationsList.innerHTML = ''; // Limpiar la lista de notificaciones

            notifications.forEach(notification => {
                console.log('Fecha de creación recibida:', notification.fecha_creacion);

                // Crear el objeto Date desde la fecha recibida en la base de datos
                const fechaCreacion = new Date(notification.fecha_creacion);

                // Crear un elemento para la notificación
                const notificationItem = document.createElement('div');
                notificationItem.classList.add('notification-item');

                // Determinar el ícono basado en el tipo de notificación
                let iconClass;
                switch (notification.nombre_tipo_notificacion) {
                    case 'Notificación de Stock Bajo':
                        iconClass = 'fas fa-exclamation-circle notification-icon';
                        break;
                    case 'Notificación de Vencimiento':
                        iconClass = 'fas fa-clock notification-icon';
                        break;
                    case 'Notificación de Producto Deshabilitado':
                        iconClass = 'fas fa-ban notification-icon';
                        break;
                    default:
                        iconClass = 'fas fa-info-circle notification-icon';
                        break;
                }

                // Agregar contenido de la notificación
                notificationItem.innerHTML = `
                    <i class="${iconClass}"></i>
                    <p>${notification.mensaje}</p>
                    <span class="notification-time">${formatTimeAgo(fechaCreacion)}</span>
                `;
                notificationsList.appendChild(notificationItem);
            });
        } catch (error) {
            console.error('Error cargando notificaciones:', error);
            notificationsList.innerHTML = '<p>Error al cargar notificaciones.</p>';
        }
    }

    function formatTimeAgo(fechaBase) {
        const now = new Date();

        // Calcular la diferencia en segundos entre `now` y `fechaBase`
        const diffInSeconds = Math.floor((now - fechaBase) / 1000);

        console.log('Fecha base:', fechaBase, 'Fecha actual:', now, 'Diferencia en segundos:', diffInSeconds);

        if (diffInSeconds < 60) return 'Hace unos segundos';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }

    // Marcar todas como leídas
    markAllReadButton.addEventListener('click', () => {
        console.log('Marcar todas como leídas (pendiente de implementación en el backend)');
    });

    // Cargar las notificaciones al cargar la página
    loadNotifications();
});
