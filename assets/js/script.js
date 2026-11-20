// ===============================
// FUNCIONES COMUNES - TODAS LAS PÁGINAS
// ===============================

// ========== 🔑 CORREOS DE ADMINISTRADOR ==========
const ADMIN_EMAILS = [
  "bcordobaortiz06@gmail.com"
];

// ========== TOASTS (mensajes flotantes) ==========

function mostrarToast(mensaje, tipo = "exito") {
  // Crear el contenedor si no existe
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;
  toast.textContent = mensaje;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast-visible"));

  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), 400);
  }, 2200);
}

// ========== CONFIGURACIÓN / MODO OSCURO ==========

function aplicarModoOscuro(activar) {
  if (activar) document.body.classList.add("dark-mode");
  else document.body.classList.remove("dark-mode");
}

function cargarModoOscuro() {
  const config = localStorage.getItem("configCleanCity");
  if (config) {
    try {
      const { dark } = JSON.parse(config);
      aplicarModoOscuro(dark === true);
    } catch (e) {
      console.log("Error al cargar configuración");
    }
  }
}

function actualizarFechaHora() {
  const fechaBox = document.getElementById("fechaHora");
  if (fechaBox) {
    const fecha = new Date();
    fechaBox.innerHTML = `<strong>📅 ${fecha.toLocaleDateString()}</strong><br>⏰ ${fecha.toLocaleTimeString()}`;
  }
}

window.addEventListener("storage", (event) => {
  if (event.key === "configCleanCity") {
    try {
      const nuevaConfig = JSON.parse(event.newValue);
      if (nuevaConfig && typeof nuevaConfig.dark !== "undefined") {
        aplicarModoOscuro(nuevaConfig.dark);
      }
    } catch (e) {}
  }
});

// ========== AUTENTICACIÓN ==========

function estaLogueado() {
  return localStorage.getItem("usuarioCleanCity") !== null;
}

function obtenerUsuario() {
  const usuario = localStorage.getItem("usuarioCleanCity");
  if (usuario) {
    try {
      return JSON.parse(usuario);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function guardarUsuario(usuario) {
  let datos;
  if (typeof usuario === "string") {
    datos = { nombre: usuario, email: "" };
  } else {
    datos = {
      nombre: usuario.nombre || "Usuario",
      email: (usuario.email || "").toLowerCase()
    };
  }
  localStorage.setItem("usuarioCleanCity", JSON.stringify(datos));
}

function redirigirSiNoLogueado() {
  if (!estaLogueado()) window.location.href = "../login/login.html";
}

function cerrarSesion() {
  localStorage.removeItem("usuarioCleanCity");
  window.location.href = "../login/login.html";
}

// ========== ADMIN ==========

function esAdmin() {
  const usuario = obtenerUsuario();
  if (!usuario || !usuario.email) return false;
  return ADMIN_EMAILS.includes(usuario.email.toLowerCase());
}

function esEmailAdmin(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

function actualizarEnlaceAdmin() {
  const menu = document.getElementById("menuPrincipal");
  if (!menu) return;

  let linkAdmin = menu.querySelector(".link-admin");

  if (esAdmin()) {
    if (!linkAdmin) {
      linkAdmin = document.createElement("a");
      linkAdmin.href = "../administracion/admin.html";
      linkAdmin.className = "link-admin";
      linkAdmin.textContent = "🛠️ Administrador";
      menu.appendChild(linkAdmin);
    }
    if (window.location.pathname.endsWith("/administracion/admin.html")) {
      linkAdmin.classList.add("active");
    }
  } else if (linkAdmin) {
    linkAdmin.remove();
  }
}

// ========== MENÚ / PERFIL ==========

function actualizarMenu() {
  const menuLogueado = document.getElementById("menuLogueado");
  const profileBox = document.getElementById("profileBox");

  if (estaLogueado()) {
    if (menuLogueado) menuLogueado.style.display = "block";
    if (profileBox) {
      const usuario = obtenerUsuario();
      const rol = esAdmin() ? "🛠️ Administrador" : "Ciudadano activo";
      profileBox.innerHTML = `
        <div class="profile-img">👤</div>
        <div>
          <h4>${usuario.nombre}</h4>
          <p>${rol}</p>
        </div>
      `;
    }
  } else {
    if (menuLogueado) menuLogueado.style.display = "none";
    if (profileBox) {
      profileBox.innerHTML = `
        <div class="profile-img">👤</div>
        <div>
          <h4>Invitado</h4>
          <p>Inicia sesión para más opciones</p>
        </div>
      `;
    }
  }

  actualizarEnlaceAdmin();
}

// ========== INICIALIZACIÓN ==========
cargarModoOscuro();
setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();

console.log("✅ script.js cargado");