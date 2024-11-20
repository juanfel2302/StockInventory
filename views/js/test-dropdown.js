document.addEventListener('DOMContentLoaded', function () {
    const testIcon = document.getElementById('testIcon');
    const testDropdown = document.getElementById('testDropdown');
    const logoutAction = document.getElementById('logoutAction');
  
    // Mostrar/Ocultar dropdown al hacer clic en el ícono
    testIcon.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      testDropdown.style.display = testDropdown.style.display === 'block' ? 'none' : 'block';
    });
  
    // Cerrar el dropdown al hacer clic fuera de él
    window.addEventListener('click', function (event) {
      if (!testIcon.contains(event.target) && !testDropdown.contains(event.target)) {
        testDropdown.style.display = 'none';
      }
    });
  
    // Acción de cierre de sesión
    logoutAction.addEventListener('click', async function (event) {
      event.preventDefault();
      try {
        const response = await fetch('/api/auth/logout', { method: 'POST' });
        if (response.ok) {
          // Redirige al login
          window.location.href = '/';
        } else {
          console.error('Error al cerrar sesión:', await response.text());
          alert('Error al cerrar sesión. Intenta nuevamente.');
        }
      } catch (error) {
        console.error('Error en la solicitud de logout:', error);
        alert('Error al conectar con el servidor.');
      }
    });
  });
  