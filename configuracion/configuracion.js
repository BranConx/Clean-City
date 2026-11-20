// ===============================
// CONFIGURACIÓN - MODO OSCURO Y NOTIFICACIONES
// ===============================
// Todo se guarda automáticamente al marcar/desmarcar las casillas.

// ========== REFERENCIAS AL DOM ==========
const checkModoOscuro = document.getElementById("modoOscuroCheck");
const checkNotificaciones = document.getElementById("notificacionesCheck");

// ========== HELPERS DE CONFIGURACIÓN ==========

// Lee la configuración guardada (o devuelve objeto vacío)
function obtenerConfig() {
  try {
    return JSON.parse(localStorage.getItem("configCleanCity") || "{}");
  } catch (e) {
    console.log("Error al leer config:", e);
    return {};
  }
}

// Guarda la configuración completa en localStorage
function guardarConfigEnStorage(config) {
  localStorage.setItem("configCleanCity", JSON.stringify(config));
}

// ========== MODO OSCURO ==========

// Aplica o quita la clase "dark-mode" al body
function aplicarModoOscuro(activar) {
  if (activar) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

// ========== NOTIFICACIONES ==========

// Verifica si el navegador soporta notificaciones
function soportaNotificaciones() {
  return "Notification" in window;
}

// Activa las notificaciones: guarda preferencia + pide permiso al navegador
function activarNotificaciones() {
  // 1. Guardar la preferencia de inmediato
  const config = obtenerConfig();
  config.notif = true;
  guardarConfigEnStorage(config);
  console.log("🔔 Notificaciones activadas y guardadas");

  // 2. Si el navegador no las soporta, avisar
  if (!soportaNotificaciones()) {
    alert("⚠️ Tu navegador no soporta notificaciones nativas");
    return;
  }

  // 3. Si ya hay permiso, mostrar confirmación
  if (Notification.permission === "granted") {
    new Notification("🔔 CleanCity", {
      body: "Notificaciones activadas correctamente.",
      icon: "https://cdn-icons-png.flaticon.com/512/564/564619.png"
    });
    return;
  }

  // 4. Si el navegador ya las bloqueó antes, avisar
  if (Notification.permission === "denied") {
    alert("⚠️ Bloqueaste las notificaciones. Actívalas desde el candado 🔒 junto a la URL del navegador.");
    return;
  }

  // 5. Pedir permiso (solo la primera vez)
  Notification.requestPermission().then(permiso => {
    if (permiso === "granted") {
      new Notification("🔔 CleanCity", {
        body: "¡Notificaciones activadas! Te avisaremos a la hora programada.",
        icon: "https://cdn-icons-png.flaticon.com/512/564/564619.png"
      });
    } else if (permiso === "denied") {
      // El usuario rechazó → desmarcar la casilla y guardar como false
      if (checkNotificaciones) checkNotificaciones.checked = false;
      const config = obtenerConfig();
      config.notif = false;
      guardarConfigEnStorage(config);
      alert("⚠️ Sin permiso, las notificaciones quedan desactivadas.");
    }
  });
}

// Desactiva las notificaciones: solo guarda la preferencia
function desactivarNotificaciones() {
  const config = obtenerConfig();
  config.notif = false;
  guardarConfigEnStorage(config);
  console.log("🔕 Notificaciones desactivadas");
}

// ========== CARGA INICIAL ==========

// Carga la configuración guardada al abrir la página
function cargarConfiguracion() {
  const config = obtenerConfig();
  console.log("Cargando configuración:", config);

  const dark = config.dark === true;
  const notif = config.notif === true;

  if (checkModoOscuro) checkModoOscuro.checked = dark;
  if (checkNotificaciones) checkNotificaciones.checked = notif;

  aplicarModoOscuro(dark);
}

// ========== EVENTOS ==========

// 🌙 Modo oscuro: se aplica y se guarda al instante
checkModoOscuro?.addEventListener("change", (e) => {
  const activo = e.target.checked;
  aplicarModoOscuro(activo);

  const config = obtenerConfig();
  config.dark = activo;
  guardarConfigEnStorage(config);
  console.log("🌙 Modo oscuro:", activo ? "activado" : "desactivado");
});

// 🔔 Notificaciones: se activan/desactivan al instante
checkNotificaciones?.addEventListener("change", (e) => {
  if (e.target.checked) {
    activarNotificaciones();
  } else {
    desactivarNotificaciones();
  }
});

// ========== INICIO ==========
cargarConfiguracion();

console.log("✅ configuracion.js cargado");