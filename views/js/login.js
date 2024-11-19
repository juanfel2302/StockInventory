document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Detiene el comportamiento predeterminado del formulario

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const modal = document.getElementById("error-modal");
  const modalMessage = document.getElementById("modal-message");
  const closeModal = document.getElementById("close-modal");

  console.log("Formulario enviado con:", { username, password });

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_usuario: username, contrasena: password }),
    });

    console.log("Respuesta del servidor recibida:", response);

    if (response.ok) {
      const result = await response.json();
      console.log("Datos procesados:", result);

      if (result.success) {
        // Redirige al home si el login es exitoso
        window.location.href = result.redirectTo;
      } else {
        // Muestra el mensaje de error en el modal
        modalMessage.textContent = result.error || "Credenciales incorrectas. Intenta de nuevo.";
        modal.style.display = "block"; // Abre el modal
      }
    } else {
      // Manejo de respuesta no OK
      console.error("Error en la respuesta del servidor:", response);
      modalMessage.textContent = "Error inesperado. Contacta al administrador.";
      modal.style.display = "block";
    }
  } catch (error) {
    // Manejo de errores de conexión o excepciones
    console.error("Error en la solicitud de login:", error);
    modalMessage.textContent = "No se pudo conectar con el servidor. Por favor, intenta más tarde.";
    modal.style.display = "block";
  }

  // Evento para cerrar el modal al hacer clic en la "X"
  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  // Evento para cerrar el modal si se hace clic fuera del contenido
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});
