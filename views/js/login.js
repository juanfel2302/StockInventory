document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre_usuario: username, contrasena: password })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        window.location.href = "/inventory"; // Redirige a la página de inventario si el login es exitoso
      } else {
        alert(result.error || "Error en el inicio de sesión");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
    }
  });
  