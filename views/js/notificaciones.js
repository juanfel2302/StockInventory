document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');
    const logoutLink = document.querySelector('.dropdown-item'); // Selecciona el enlace de cerrar sesión
    const notificationLink = document.querySelector('.fa-bell'); // Selecciona el icono de notificaciones

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

    // Redirige a login.html al hacer clic en "Cerrar Sesión"
    logoutLink.addEventListener('click', function() {
        window.location.href = 'login.html'; // Redirige a la página de inicio de sesión
    });

    // Redirige a notificaciones.html al hacer clic en el icono de notificaciones
    notificationLink.addEventListener('click', function() {
        window.location.href = 'notificaciones.html'; // Redirige a la página de notificaciones
    });
});
