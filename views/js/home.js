document.addEventListener('DOMContentLoaded', async function () {
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

  // Referencias a los elementos
  const userIcon = document.getElementById('userIcon');
  const logoutModal = document.getElementById('logoutModal');
  const closeModal = document.getElementById('closeModal');
  const confirmLogout = document.getElementById('confirmLogout');
  const cancelLogout = document.getElementById('cancelLogout');
  const notificationLink = document.querySelector('.fas.fa-bell');

  // Mostrar el modal al hacer clic en el ícono de usuario
  userIcon.addEventListener('click', function (event) {
    event.preventDefault();
    logoutModal.style.display = 'block';
  });

  // Cerrar el modal al hacer clic en la 'x'
  closeModal.addEventListener('click', function () {
    logoutModal.style.display = 'none';
  });

  // Cerrar el modal al hacer clic en 'Cancelar'
  cancelLogout.addEventListener('click', function () {
    logoutModal.style.display = 'none';
  });

  // Cerrar el modal al hacer clic fuera de él
  window.addEventListener('click', function (event) {
    if (event.target === logoutModal) {
      logoutModal.style.display = 'none';
    }
  });

  // Confirmar cierre de sesión
  confirmLogout.addEventListener('click', async function () {
    try {
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

  // Redirigir a la página de notificaciones al hacer clic en el ícono de campana
  notificationLink.addEventListener('click', function () {
    window.location.href = '/notification.html'; // Redirige a la página de notificaciones
  });

  // Lógica para cargar datos dinámicos del home (opcional si tienes este endpoint configurado)
  try {
    const response = await fetch('/api/home');
    if (!response.ok) throw new Error('Error al obtener los datos del home.');
    const data = await response.json();
    document.getElementById('total-stock').textContent = data.totalStock || 'N/A';
    document.getElementById('pending-notifications').textContent = data.pendingNotifications || 'N/A';
  } catch (error) {
    console.error('Error al cargar los datos dinámicos del home:', error);
  }
});

document.addEventListener('DOMContentLoaded', async function () {
  // Referencias al ícono de notificaciones
  const notificationIcon = document.getElementById('notificationIcon');

  // Función para verificar notificaciones no leídas
  async function checkNotifications() {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Error al obtener las notificaciones');

      const notifications = await response.json();

      // Verifica si hay notificaciones no leídas
      const unreadNotifications = notifications.some(notification => !notification.leida);

      // Cambia el color del ícono si hay no leídas
      if (unreadNotifications) {
        notificationIcon.classList.add('notification-alert');
      } else {
        notificationIcon.classList.remove('notification-alert');
      }
    } catch (error) {
      console.error('Error verificando notificaciones:', error);
    }
  }

  // Llama a la función para verificar las notificaciones
  checkNotifications();

  // Lógica para redirigir a la página de notificaciones al hacer clic
  notificationIcon.addEventListener('click', function () {
    window.location.href = '/notification.html';
  });
});