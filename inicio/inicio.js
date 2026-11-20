// ===============================
// INICIO - ESTADÍSTICAS DINÁMICAS
// ===============================
// Actualiza los 3 contadores de la página de inicio con datos reales.

// ========== HELPERS ==========

// Lee un array de localStorage de forma segura
function leerArrayDeStorage(clave) {
  try {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : [];
  } catch (e) {
    console.log(`Error al leer ${clave}:`, e);
    return [];
  }
}

// ========== 1. REPORTES ACTIVOS ==========
// Cuenta los reportes que el usuario ha creado

function actualizarReportesActivos() {
  const el = document.getElementById("statReportes");
  if (!el) return;

  const reportes = leerArrayDeStorage("reportesCleanCity");
  el.textContent = reportes.length;
}

// ========== 2. PRÓXIMA RECOLECCIÓN ==========
// Busca el próximo recordatorio (por día y hora) y muestra su hora

const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function actualizarProximaRecoleccion() {
  const el = document.getElementById("statRecoleccion");
  if (!el) return;

  const recordatorios = leerArrayDeStorage("recordatoriosCleanCity");

  if (recordatorios.length === 0) {
    el.textContent = "—";
    return;
  }

  const ahora = new Date();
  const diaActual = ahora.getDay();
  const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

  // Calcular minutos hasta cada recordatorio (en los próximos 7 días)
  let proximo = null;
  let menorEspera = Infinity;

  recordatorios.forEach(r => {
    const [h, m] = r.hora.split(":").map(Number);
    const minutosRecordatorio = h * 60 + m;

    // Días de diferencia entre hoy y el día del recordatorio
    let diasDiferencia = (r.dia - diaActual + 7) % 7;

    // Si es hoy pero la hora ya pasó, saltar a la próxima semana
    if (diasDiferencia === 0 && minutosRecordatorio <= horaActual) {
      diasDiferencia = 7;
    }

    // Minutos totales hasta el recordatorio
    const esperaTotal = diasDiferencia * 24 * 60 + (minutosRecordatorio - horaActual);

    if (esperaTotal < menorEspera) {
      menorEspera = esperaTotal;
      proximo = {
        dia: diasDiferencia,
        diaSemana: r.dia,
        hora: r.hora
      };
    }
  });

  if (!proximo) {
    el.textContent = "—";
    return;
  }

  // Formato de hora bonito: "7:00 PM" en lugar de "19:00"
  const [h, m] = proximo.hora.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const horaFormateada = `${h12}:${String(m).padStart(2, "0")} ${ampm}`;

  // Si es hoy → solo la hora. Mañana → "Mañana". Otro día → "Lun", "Mar"…
  if (proximo.dia === 0) {
    el.textContent = horaFormateada;
  } else if (proximo.dia === 1) {
    el.textContent = "Mañana";
  } else {
    el.textContent = diasSemana[proximo.diaSemana].slice(0, 3);
  }
}

// ========== 3. USUARIOS REGISTRADOS ==========
// Cuenta los usuarios guardados en este navegador

function actualizarUsuariosRegistrados() {
  const el = document.getElementById("statUsuarios");
  if (!el) return;

  const usuarios = leerArrayDeStorage("usuariosCleanCity");
  el.textContent = usuarios.length;
}

// ========== INICIALIZACIÓN ==========

function actualizarTodasLasStats() {
  actualizarReportesActivos();
  actualizarProximaRecoleccion();
  actualizarUsuariosRegistrados();
}

// Ejecutar al cargar
actualizarTodasLasStats();

// Refrescar si el usuario cambia algo en otra pestaña
window.addEventListener("storage", (e) => {
  if (["reportesCleanCity", "recordatoriosCleanCity", "usuariosCleanCity"].includes(e.key)) {
    actualizarTodasLasStats();
  }
});

// Refrescar al volver a la pestaña (por si cambió algo mientras estaba fuera)
window.addEventListener("focus", actualizarTodasLasStats);

// Refrescar cada 60 segundos (para que "Próxima recolección" se actualice)
setInterval(actualizarTodasLasStats, 60000);

console.log("✅ inicio.js cargado - estadísticas actualizadas");