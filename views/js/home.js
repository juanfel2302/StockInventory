document.addEventListener('DOMContentLoaded', async function() {
    // Verificar la sesión al cargar la página
    try {
        const response = await fetch('/api/auth/check-session', { method: 'GET' });
        if (!response.ok) {
            // Redirigir al login si no hay sesión activa
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error verificando la sesión:', error);
        window.location.href = '/';
    }

    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');
    const logoutLink = document.querySelector('.dropdown-item'); // Selecciona el enlace de cerrar sesión
    const notificationLink = document.querySelector('.fas.fa-bell'); // Selecciona el icono de notificaciones (fix selector)

    // Mostrar y ocultar el menú desplegable del usuario
    userIcon.addEventListener('click', function(event) {
        event.preventDefault(); // Evita que el enlace realice su acción predeterminada
        userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block'; // Alternar visibilidad
    });

    // Cierra el menú al hacer clic fuera de él
    window.addEventListener('click', function(event) {
        if (!userIcon.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.style.display = 'none'; // Oculta el menú si se hace clic fuera
        }
    });

    // Lógica para cerrar sesión
    logoutLink.addEventListener('click', async function(event) {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace
        
        try {
            // Enviar una solicitud POST al servidor para cerrar la sesión
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            
            if (response.ok) {
                // Limpiar almacenamiento local o de sesión si se está utilizando
                localStorage.clear();
                sessionStorage.clear();
                
                // Redirigir al login después de cerrar la sesión
                window.location.href = '/';
            } else {
                console.error('Error al cerrar la sesión:', await response.text());
            }
        } catch (error) {
            console.error('Error en la solicitud de cierre de sesión:', error);
        }
    });

    // Lógica para redirigir a notificaciones
    notificationLink.addEventListener('click', function() {
        window.location.href = '/notification.html'; // Redirige a la página de notificaciones
    });
});
