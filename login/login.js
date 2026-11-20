// ===============================
// LOGIN - JAVASCRIPT
// ===============================

cargarModoOscuro();

// ========== VALIDACIÓN INLINE ==========

function mostrarError(idError, mensaje) {
  const el = document.getElementById(idError);
  if (!el) return;
  el.textContent = mensaje;
  el.classList.add("visible");
}

function limpiarError(idError) {
  const el = document.getElementById(idError);
  if (!el) return;
  el.textContent = "";
  el.classList.remove("visible");
}

function marcarCampo(idCampo, conError) {
  const el = document.getElementById(idCampo);
  if (!el) return;
  if (conError) el.classList.add("input-error");
  else el.classList.remove("input-error");
}

function limpiarTodosLosErrores() {
  limpiarError("errorEmail");
  limpiarError("errorPassword");
  limpiarError("errorGeneral");
  marcarCampo("loginEmail", false);
  marcarCampo("loginPassword", false);
}

// ========== USUARIOS ==========

function obtenerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem("usuariosCleanCity") || "[]");
  } catch (e) {
    return [];
  }
}

// ========== EVENTO ENTRAR ==========

document.getElementById("btnLogin").addEventListener("click", function () {
  limpiarTodosLosErrores();

  const email    = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  let hayError = false;

  if (!email) {
    mostrarError("errorEmail", "⚠️ Ingresa tu correo electrónico");
    marcarCampo("loginEmail", true);
    hayError = true;
  } else if (!email.includes("@") || !email.includes(".")) {
    mostrarError("errorEmail", "⚠️ Ingresa un correo electrónico válido");
    marcarCampo("loginEmail", true);
    hayError = true;
  }

  if (!password) {
    mostrarError("errorPassword", "⚠️ Ingresa tu contraseña");
    marcarCampo("loginPassword", true);
    hayError = true;
  } else if (password.length < 4) {
    mostrarError("errorPassword", "⚠️ La contraseña debe tener al menos 4 caracteres");
    marcarCampo("loginPassword", true);
    hayError = true;
  }

  if (hayError) return;

  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (!usuario) {
    mostrarError("errorGeneral", "❌ Correo o contraseña incorrectos");
    marcarCampo("loginEmail", true);
    marcarCampo("loginPassword", true);
    return;
  }

  // Guardar sesión
  guardarUsuario({ nombre: usuario.nombre, email: usuario.email });

  // Detectar admin
  const esAdminUser = esEmailAdmin(usuario.email);

  let mensaje, tipo;
  if (esAdminUser) {
    mensaje = `🛠️ Sesión iniciada. ¡Bienvenido, administrador ${usuario.nombre}!`;
    tipo = "admin";
  } else {
    mensaje = `✅ Sesión iniciada. ¡Bienvenido, ${usuario.nombre}!`;
    tipo = "exito";
  }

  mostrarToast(mensaje, tipo);

  setTimeout(() => {
    window.location.href = "../inicio/inicio.html";
  }, 1500);
});

// ========== LIMPIAR ERRORES AL ESCRIBIR ==========

document.getElementById("loginEmail")?.addEventListener("input", () => {
  limpiarError("errorEmail");
  limpiarError("errorGeneral");
  marcarCampo("loginEmail", false);
  marcarCampo("loginPassword", false);
});

document.getElementById("loginPassword")?.addEventListener("input", () => {
  limpiarError("errorPassword");
  limpiarError("errorGeneral");
  marcarCampo("loginPassword", false);
  marcarCampo("loginEmail", false);
});

// ========== ENTER PARA ENVIAR ==========

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    document.getElementById("btnLogin").click();
  }
});

// ========== SI YA HAY SESIÓN, REDIRIGIR ==========
if (estaLogueado()) {
  window.location.href = "../inicio/inicio.html";
}

console.log("✅ login.js cargado");