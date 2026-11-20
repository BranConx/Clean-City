// ===============================
// RECORDATORIOS - CLEANCITY
// ===============================

// Arreglo que almacena todos los recordatorios
let recordatorios = [];

// Nombres de los días de la semana
const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// ========== PREFERENCIA DE NOTIFICACIONES ==========

// Verifica si el navegador soporta notificaciones
function soportaNotificaciones() {
  return "Notification" in window;
}

// Lee desde localStorage si el usuario activó las notificaciones (en Configuración)
function notificacionesActivadas() {
  try {
    const config = JSON.parse(localStorage.getItem("configCleanCity") || "{}");
    return config.notif === true;
  } catch (e) {
    return false;
  }
}

// Muestra una notificación nativa si la preferencia está activa y hay permiso;
// si no, cae de vuelta a un alert normal.
function mostrarNotificacion(titulo, cuerpo) {
  const activadas = notificacionesActivadas();
  const permiso = soportaNotificaciones() ? Notification.permission : "unsupported";

  if (activadas && permiso === "granted") {
    new Notification(titulo, {
      body: cuerpo,
      icon: "https://cdn-icons-png.flaticon.com/512/564/564619.png"
    });
  } else {
    // Respaldo: alert si el usuario no las activó o el navegador no dio permiso
    alert(`${titulo}\n${cuerpo}`);
  }
}

// Muestra u oculta el aviso que invita a activar notificaciones en Configuración
function actualizarAvisoNotificaciones() {
  const aviso = document.getElementById("avisoNotif");
  if (!aviso) return;

  const activadas = notificacionesActivadas();
  const permiso = soportaNotificaciones() ? Notification.permission : "unsupported";

  // Solo mostramos el aviso si NO están completamente activadas
  if (activadas && permiso === "granted") {
    aviso.style.display = "none";
  } else {
    aviso.style.display = "";
  }
}

// ========== ALMACENAMIENTO ==========

function guardarEnLocalStorage() {
  localStorage.setItem("recordatoriosCleanCity", JSON.stringify(recordatorios));
}

function cargarDesdeLocalStorage() {
  const guardados = localStorage.getItem("recordatoriosCleanCity");
  if (guardados) {
    try {
      recordatorios = JSON.parse(guardados);
    } catch (e) {
      console.log("Error al parsear recordatorios:", e);
      recordatorios = [];
    }
  }
  mostrarLista();
}

// ========== INTERFAZ ==========

function mostrarLista() {
  const contenedor = document.getElementById("listaRecordatorios");
  if (!contenedor) return;

  if (recordatorios.length === 0) {
    contenedor.innerHTML = '<p class="vacio">📭 No hay recordatorios. Crea uno nuevo.</p>';
    return;
  }

  contenedor.innerHTML = "";

  recordatorios.forEach((recordatorio, index) => {
    const div = document.createElement("div");
    div.className = "recordatorio-item";

    const repetirTexto = recordatorio.repetir === "semanal"
      ? "🔄 Se repite cada semana"
      : "⏰ Solo una vez";

    div.innerHTML = `
      <div class="recordatorio-info">
        <div class="recordatorio-titulo">
          <span>📌</span> ${recordatorio.titulo}
        </div>
        <div class="recordatorio-detalle">
          📅 ${diasSemana[recordatorio.dia]} a las ${recordatorio.hora} | ${repetirTexto}
        </div>
      </div>
      <button class="btn-eliminar" data-index="${index}">🗑️ Eliminar</button>
    `;

    contenedor.appendChild(div);
  });

  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      eliminarRecordatorio(index);
    });
  });
}

// ========== CRUD ==========

function agregarRecordatorio(titulo, dia, hora, repetir) {
  if (!titulo || titulo.trim() === "") {
    alert("❌ Por favor, escribe un título para el recordatorio");
    return false;
  }

  const existe = recordatorios.some(r => r.dia === parseInt(dia) && r.hora === hora);
  if (existe) {
    alert("⚠️ Ya tienes un recordatorio para ese día y hora");
    return false;
  }

  recordatorios.push({
    titulo: titulo.trim(),
    dia: parseInt(dia),
    hora: hora,
    repetir: repetir
  });

  guardarEnLocalStorage();
  mostrarLista();
  return true;
}

function eliminarRecordatorio(index) {
  if (confirm("¿Eliminar este recordatorio?")) {
    recordatorios.splice(index, 1);
    guardarEnLocalStorage();
    mostrarLista();
    alert("✅ Recordatorio eliminado");
  }
}

// ========== VERIFICACIÓN AUTOMÁTICA ==========

function verificarRecordatorios() {
  const ahora = new Date();
  const diaActual = ahora.getDay();
  const horaActual = ahora.toTimeString().slice(0, 5);

  let pendientes = [];

  recordatorios.forEach((recordatorio, index) => {
    if (recordatorio.dia === diaActual && recordatorio.hora === horaActual) {
      pendientes.push({ recordatorio, index });
    }
  });

  pendientes.forEach(pendiente => {
    mostrarNotificacion(
      `🔔 ${pendiente.recordatorio.titulo}`,
      `📅 Hoy a las ${pendiente.recordatorio.hora}`
    );

    if (pendiente.recordatorio.repetir === "una_vez") {
      eliminarRecordatorio(pendiente.index);
    }
  });
}

// ========== EVENTOS ==========

document.getElementById("btnGuardar")?.addEventListener("click", () => {
  const titulo = document.getElementById("titulo").value;
  const dia = document.getElementById("dia").value;
  const hora = document.getElementById("hora").value;
  const repetir = document.getElementById("repetir").value;

  if (agregarRecordatorio(titulo, dia, hora, repetir)) {
    document.getElementById("titulo").value = "";
    alert("✅ Recordatorio guardado correctamente");
  }
});

// ========== INICIALIZACIÓN ==========

// Refrescar el aviso si el usuario cambia el ajuste en otra pestaña
window.addEventListener("storage", (event) => {
  if (event.key === "configCleanCity") {
    actualizarAvisoNotificaciones();
  }
});

// Refrescar el aviso al volver a la pestaña (por si se cambió en otra pestaña)
window.addEventListener("focus", actualizarAvisoNotificaciones);

// Estado inicial
actualizarAvisoNotificaciones();

setInterval(verificarRecordatorios, 60000);
verificarRecordatorios();
cargarDesdeLocalStorage();

console.log("✅ Sistema de recordatorios cargado correctamente");