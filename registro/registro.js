// ===============================
// REGISTRO - JAVASCRIPT
// ===============================

cargarModoOscuro();

// ========== USUARIOS ==========

function obtenerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem("usuariosCleanCity") || "[]");
  } catch (e) {
    return [];
  }
}

function guardarUsuarios(lista) {
  localStorage.setItem("usuariosCleanCity", JSON.stringify(lista));
}

// ========== EVENTO REGISTRAR ==========

document.getElementById("btnRegistro").addEventListener("click", function () {
  const nombre   = document.getElementById("regNombre").value.trim();
  const email    = document.getElementById("regEmail").value.trim().toLowerCase();
  const telefono = document.getElementById("regTelefono").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirm  = document.getElementById("regConfirm").value;

  if (!nombre || !email || !telefono || !password || !confirm) {
    mostrarToast("❌ Por favor, completa todos los campos", "error");
    return;
  }

  if (nombre.length < 2) {
    mostrarToast("❌ El nombre debe tener al menos 2 caracteres", "error");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    mostrarToast("❌ Ingresa un correo electrónico válido", "error");
    return;
  }

  if (password.length < 4) {
    mostrarToast("❌ La contraseña debe tener al menos 4 caracteres", "error");
    return;
  }

  if (password !== confirm) {
    mostrarToast("❌ Las contraseñas no coinciden", "error");
    return;
  }

  const usuarios = obtenerUsuarios();

  if (usuarios.some(u => u.email === email)) {
    mostrarToast("❌ Ese correo ya está registrado", "error");
    return;
  }

  // Guardar usuario
  usuarios.push({ nombre, email, telefono, password });
  guardarUsuarios(usuarios);

  // Guardar sesión
  guardarUsuario({ nombre, email });

  // Detectar admin
  const esAdminUser = esEmailAdmin(email);

  let mensaje, tipo;
  if (esAdminUser) {
    mensaje = `🛠️ Registro como administrador completado. Enviando al inicio...`;
    tipo = "admin";
  } else {
    mensaje = `✅ Registro completado. Enviando al inicio...`;
    tipo = "exito";
  }

  mostrarToast(mensaje, tipo);

  setTimeout(() => {
    window.location.href = "../inicio/inicio.html";
  }, 1700);
});

// ========== ENTER PARA ENVIAR ==========

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    document.getElementById("btnRegistro").click();
  }
});

// ========== SI YA HAY SESIÓN, REDIRIGIR ==========

if (estaLogueado()) {
  window.location.href = "../inicio/inicio.html";
}

console.log("✅ registro.js cargado");