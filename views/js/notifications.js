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
                const fechaCreacion = new Date(notification.fecha_creacion);

                // Crear un elemento para la notificación
                const notificationItem = document.createElement('div');
                notificationItem.classList.add('notification-item');

                // Agregar clase adicional si la notificación ya está leída
                if (notification.leida) {
                    notificationItem.classList.add('read'); // Clase CSS para notificaciones leídas
                }

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

                // Agregar contenido de la notificación con un botón para marcarla como leída
                notificationItem.innerHTML = `
                    <i class="${iconClass}"></i>
                    <p>${notification.mensaje}</p>
                    <span class="notification-time">${formatTimeAgo(fechaCreacion)}</span>
                    ${
                        !notification.leida
                            ? `<button class="mark-read-button" data-id="${notification.id_notificacion}">Marcar como leída</button>`
                            : ''
                    }
                `;
                notificationsList.appendChild(notificationItem);
            });

            // Agregar eventos a los botones de "Marcar como leída"
            document.querySelectorAll('.mark-read-button').forEach(button => {
                button.addEventListener('click', async event => {
                    const notificationId = event.target.getAttribute('data-id');
                    await markNotificationAsRead(notificationId);
                    loadNotifications();
                });
            });
        } catch (error) {
            console.error('Error cargando notificaciones:', error);
            notificationsList.innerHTML = '<p>Error al cargar notificaciones.</p>';
        }
    }

    async function markNotificationAsRead(id) {
        try {
            const response = await fetch(`/api/notifications/${id}/marcar-leida`, { method: 'PUT' });
            if (!response.ok) throw new Error('Error al marcar la notificación como leída');
        } catch (error) {
            console.error('Error al marcar la notificación como leída:', error);
        }
    }

    async function markAllNotificationsAsRead() {
        try {
            const response = await fetch('/api/notifications/marcar-todas-leidas', { method: 'PUT' });
            if (!response.ok) throw new Error('Error al marcar todas las notificaciones como leídas');
        } catch (error) {
            console.error('Error al marcar todas las notificaciones como leídas:', error);
        }
    }

    // Marcar todas como leídas
    markAllReadButton.addEventListener('click', async () => {
        await markAllNotificationsAsRead();
        loadNotifications();
    });

    function formatTimeAgo(fechaBase) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - fechaBase) / 1000);

        if (diffInSeconds < 60) return 'Hace unos segundos';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }

    // Cargar las notificaciones al cargar la página
    loadNotifications();
});
