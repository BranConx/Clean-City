// ===============================
// CALENDARIO DE RECOLECCIÓN
// ===============================
// Componente reutilizable. Se activa si existe el div #calendarioRecoleccion

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_CORTOS = ["Do","Lu","Ma","Mi","Ju","Vi","Sa"];
const DIAS_LARGOS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

let calMes = new Date().getMonth();
let calAño = new Date().getFullYear();
let calSeleccionado = null;

// Mapear nombre de día → números de día de la semana
function diasDeHorario(diaTexto) {
  const mapa = {
    "Domingo": [0],
    "Lunes": [1],
    "Martes": [2],
    "Miércoles": [3],
    "Jueves": [4],
    "Viernes": [5],
    "Sábado": [6],
    "Sábados": [6],
    "Domingos": [0],
    "Lunes a viernes": [1, 2, 3, 4, 5]
  };
  return mapa[diaTexto] || [];
}

function leerHorarios() {
  try {
    return JSON.parse(localStorage.getItem("horariosCleanCity") || "[]");
  } catch (e) {
    return [];
  }
}

function leerZonas() {
  try {
    return JSON.parse(localStorage.getItem("zonasCleanCity") || "[]");
  } catch (e) {
    return [];
  }
}

function horariosParaDia(diaSemana) {
  return leerHorarios().filter(h => diasDeHorario(h.dia).includes(diaSemana));
}

// ========== RENDER ==========

function renderCalendario() {
  const contenedor = document.getElementById("calendarioRecoleccion");
  if (!contenedor) return;

  const hoy = new Date();
  const primerDia = new Date(calAño, calMes, 1);
  const ultimoDia = new Date(calAño, calMes + 1, 0);
  const totalDias = ultimoDia.getDate();
  const diaSemanaInicio = primerDia.getDay();

  let html = `
    <div class="calendario-header">
      <button class="calendario-nav" id="calPrev" type="button">‹</button>
      <h3 class="calendario-titulo">${MESES[calMes]} ${calAño}</h3>
      <button class="calendario-nav" id="calNext" type="button">›</button>
    </div>
    <div class="calendario-grid">
  `;

  DIAS_CORTOS.forEach(d => {
    html += `<div class="cal-dia-nombre">${d}</div>`;
  });

  for (let i = 0; i < diaSemanaInicio; i++) {
    html += `<div class="cal-dia vacio"></div>`;
  }

  for (let d = 1; d <= totalDias; d++) {
    const fecha = new Date(calAño, calMes, d);
    const diaSemana = fecha.getDay();
    const tieneRecoleccion = horariosParaDia(diaSemana).length > 0;
    const esHoy = hoy.getDate() === d && hoy.getMonth() === calMes && hoy.getFullYear() === calAño;

    const fechaStr = `${calAño}-${String(calMes + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    let clases = "cal-dia";
    if (tieneRecoleccion) clases += " con-recoleccion";
    if (esHoy) clases += " hoy";
    if (calSeleccionado === fechaStr) clases += " seleccionado";

    html += `<div class="${clases}" data-fecha="${fechaStr}" data-dia="${diaSemana}">${d}</div>`;
  }

  html += `</div>
    <div class="calendario-leyenda">
      <div class="calendario-leyenda-item">
        <div class="calendario-leyenda-punto"></div>
        <span>Día con recolección</span>
      </div>
      <div class="calendario-leyenda-item">
        <div class="calendario-leyenda-punto-hoy"></div>
        <span>Hoy</span>
      </div>
    </div>
    <div class="calendario-info" id="calInfo"></div>
  `;

  contenedor.innerHTML = html;

  document.getElementById("calPrev")?.addEventListener("click", () => {
    calMes--;
    if (calMes < 0) { calMes = 11; calAño--; }
    renderCalendario();
  });

  document.getElementById("calNext")?.addEventListener("click", () => {
    calMes++;
    if (calMes > 11) { calMes = 0; calAño++; }
    renderCalendario();
  });

  document.querySelectorAll(".cal-dia[data-fecha]").forEach(el => {
    el.addEventListener("click", () => {
      calSeleccionado = el.dataset.fecha;
      renderCalendario();
      mostrarInfoDia(el.dataset.fecha, parseInt(el.dataset.dia));
    });
  });

  if (calSeleccionado) {
    const partes = calSeleccionado.split("-");
    const diaSemana = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2])).getDay();
    mostrarInfoDia(calSeleccionado, diaSemana);
  } else {
    const info = document.getElementById("calInfo");
    if (info) {
      info.innerHTML = `<div class="calendario-info-vacio">👆 Haz clic en un día para ver los horarios</div>`;
    }
  }
}

function mostrarInfoDia(fechaStr, diaSemana) {
  const info = document.getElementById("calInfo");
  if (!info) return;

  const horarios = horariosParaDia(diaSemana);
  const zonas = leerZonas();

  const partes = fechaStr.split("-");
  const fecha = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
  const fechaBonita = `${DIAS_LARGOS[diaSemana]}, ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`;

  if (horarios.length === 0) {
    info.innerHTML = `
      <div class="calendario-info-titulo">${fechaBonita}</div>
      <div class="calendario-info-vacio">🚫 No hay recolección programada este día</div>
    `;
    return;
  }

  let html = `<div class="calendario-info-titulo">${fechaBonita}</div>`;

  horarios.forEach(h => {
    const zona = zonas.find(z => z.id === h.zonaId);
    const nombreZona = zona ? zona.nombre : "(zona eliminada)";

    html += `
      <div class="calendario-info-item">
        <div>
          <div class="calendario-info-hora">🕐 ${h.hora}</div>
          <small style="color:#888;">📍 ${nombreZona}</small>
        </div>
        <span class="calendario-info-tipo">${h.tipo}</span>
      </div>
    `;
  });

  info.innerHTML = html;
}

// ========== AUTO-REFRESCO ==========

window.addEventListener("storage", (e) => {
  if (e.key === "horariosCleanCity" || e.key === "zonasCleanCity") {
    renderCalendario();
  }
});

window.addEventListener("focus", renderCalendario);

// ========== INICIALIZACIÓN ==========
renderCalendario();

console.log("✅ calendario.js cargado");