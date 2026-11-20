// ===============================
// HORARIOS - VISTA PÚBLICA
// ===============================

function leerStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    return [];
  }
}

// ========== ZONAS ==========

function renderZonasPublicas() {
  const contenedor = document.getElementById("listaZonasPublica");
  if (!contenedor) return;

  const zonas = leerStorage("zonasCleanCity");

  if (zonas.length === 0) {
    contenedor.innerHTML = '<p class="horarios-vacio">📭 Aún no hay zonas registradas por el administrador.</p>';
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "horarios-ul";

  zonas.forEach(z => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>📍 ${z.nombre}</strong>
      ${z.descripcion ? `<br><span class="zona-desc">${z.descripcion}</span>` : ""}
    `;
    ul.appendChild(li);
  });

  contenedor.innerHTML = "";
  contenedor.appendChild(ul);
}

// ========== HORARIOS ==========

function renderHorariosPublicos() {
  const contenedor = document.getElementById("listaHorariosPublica");
  if (!contenedor) return;

  const zonas = leerStorage("zonasCleanCity");
  const horarios = leerStorage("horariosCleanCity");

  if (horarios.length === 0) {
    contenedor.innerHTML = '<p class="horarios-vacio">📭 Aún no hay horarios programados por el administrador.</p>';
    return;
  }

  const grupos = {};
  horarios.forEach(h => {
    if (!grupos[h.zonaId]) grupos[h.zonaId] = [];
    grupos[h.zonaId].push(h);
  });

  contenedor.innerHTML = "";

  Object.keys(grupos).forEach(zonaId => {
    const zona = zonas.find(z => z.id === zonaId);
    const nombreZona = zona ? zona.nombre : "(zona eliminada)";

    const bloque = document.createElement("div");
    bloque.className = "horario-zona-bloque";

    const titulo = document.createElement("h3");
    titulo.className = "horario-zona-titulo";
    titulo.textContent = `📍 ${nombreZona}`;
    bloque.appendChild(titulo);

    const ul = document.createElement("ul");
    ul.className = "horarios-ul";

    grupos[zonaId].forEach(h => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${h.dia}:</strong> ${h.hora}
        <span class="horario-tipo">${h.tipo}</span>
      `;
      ul.appendChild(li);
    });

    bloque.appendChild(ul);
    contenedor.appendChild(bloque);
  });
}

// ========== INICIALIZACIÓN ==========

function renderTodo() {
  renderZonasPublicas();
  renderHorariosPublicos();
}

renderTodo();

window.addEventListener("storage", (e) => {
  if (e.key === "zonasCleanCity" || e.key === "horariosCleanCity") {
    renderTodo();
  }
});

window.addEventListener("focus", renderTodo);

console.log("✅ horarios.js cargado");