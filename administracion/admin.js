// ===============================
// ADMIN - GESTIÓN COMPLETA
// ===============================

function iniciarPanelAdministrador() {
  if (!esAdmin()) {
    alert("⚠️ No tienes permiso para acceder a esta sección");
    window.location.replace("../inicio/inicio.html");
    return;
  }

  // ========== HELPERS ==========

  function leerStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (e) {
      return [];
    }
  }

  function guardarStorage(key, valor) {
    localStorage.setItem(key, JSON.stringify(valor));
  }

  function generarId(prefijo) {
    return `${prefijo}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  function escaparHTML(valor) {
    const caracteres = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return String(valor ?? "").replace(/[&<>"']/g, caracter => caracteres[caracter]);
  }

  // ========== ESTADO ==========

  let zonas = leerStorage("zonasCleanCity");
  let horarios = leerStorage("horariosCleanCity");

  // ========== RESUMEN ==========

  function renderResumen() {
    document.getElementById("statZonas").textContent = zonas.length;
    document.getElementById("statHorarios").textContent = horarios.length;
    document.getElementById("statReportes").textContent = leerStorage("reportesCleanCity").length;
    document.getElementById("statUsuarios").textContent = leerStorage("usuariosCleanCity").length;
  }

  // ========== ZONAS ==========

  function renderZonas() {
    const contenedor = document.getElementById("listaZonas");
    const select = document.getElementById("horarioZona");

    if (zonas.length === 0) {
      contenedor.innerHTML = '<p class="admin-vacio">📭 No hay zonas registradas. Agrega la primera.</p>';
    } else {
      contenedor.innerHTML = "";
      zonas.forEach(z => {
        const div = document.createElement("div");
        div.className = "admin-item";
        div.innerHTML = `
          <div class="admin-item-info">
            <div class="admin-item-titulo">📍 ${escaparHTML(z.nombre)}</div>
              ${z.descripcion ? `<div class="admin-item-detalle">${escaparHTML(z.descripcion)}</div>` : ""}
          </div>
            <button class="btn-eliminar-admin" data-id="${escaparHTML(z.id)}">🗑️ Eliminar</button>
        `;
        contenedor.appendChild(div);
      });

      contenedor.querySelectorAll(".btn-eliminar-admin").forEach(btn => {
        btn.addEventListener("click", () => eliminarZona(btn.dataset.id));
      });
    }

    // Refrescar el select de horarios
    if (select) {
      const valorPrevio = select.value;
      select.innerHTML = '<option value="">— Selecciona una zona —</option>';
      zonas.forEach(z => {
        const opt = document.createElement("option");
        opt.value = z.id;
        opt.textContent = z.nombre;
        select.appendChild(opt);
      });
      if (zonas.some(z => z.id === valorPrevio)) select.value = valorPrevio;
    }
  }

  function agregarZona() {
    const nombre = document.getElementById("zonaNombre").value.trim();
    const descripcion = document.getElementById("zonaDescripcion").value.trim();

    if (!nombre) {
      alert("❌ Escribe un nombre para la zona");
      return;
    }

    if (zonas.some(z => z.nombre.toLowerCase() === nombre.toLowerCase())) {
      alert("⚠️ Ya existe una zona con ese nombre");
      return;
    }

    zonas.push({
      id: generarId("zona"),
      nombre: nombre,
      descripcion: descripcion,
      fechaCreacion: new Date().toLocaleString()
    });

    guardarStorage("zonasCleanCity", zonas);
    renderZonas();
    renderResumen();

    document.getElementById("zonaNombre").value = "";
    document.getElementById("zonaDescripcion").value = "";
  }

  function eliminarZona(id) {
    const zona = zonas.find(z => z.id === id);
    if (!zona) return;

    const horariosAsociados = horarios.filter(h => h.zonaId === id);
    let mensaje = `¿Eliminar la zona "${zona.nombre}"?`;
    if (horariosAsociados.length > 0) {
      mensaje += `\n\n⚠️ También se eliminarán ${horariosAsociados.length} horario(s) asociados.`;
    }

    if (!confirm(mensaje)) return;

    zonas = zonas.filter(z => z.id !== id);
    horarios = horarios.filter(h => h.zonaId !== id);

    guardarStorage("zonasCleanCity", zonas);
    guardarStorage("horariosCleanCity", horarios);

    renderZonas();
    renderHorarios();
    renderResumen();
  }

  // ========== HORARIOS ==========

  function renderHorarios() {
    const contenedor = document.getElementById("listaHorarios");

    if (horarios.length === 0) {
      contenedor.innerHTML = '<p class="admin-vacio">📭 No hay horarios programados. Agrega el primero.</p>';
      return;
    }

    contenedor.innerHTML = "";
    horarios.forEach(h => {
      const zona = zonas.find(z => z.id === h.zonaId);
      const nombreZona = zona ? zona.nombre : "(zona eliminada)";

      const div = document.createElement("div");
      div.className = "admin-item";
      div.innerHTML = `
        <div class="admin-item-info">
          <div class="admin-item-titulo">📅 ${escaparHTML(h.dia)} · ${escaparHTML(h.hora)}</div>
          <div class="admin-item-detalle">
            📍 Zona: <strong>${escaparHTML(nombreZona)}</strong><br>
            🏷️ Tipo: ${escaparHTML(h.tipo)}
          </div>
        </div>
        <button class="btn-eliminar-admin" data-id="${escaparHTML(h.id)}">🗑️ Eliminar</button>
      `;
      contenedor.appendChild(div);
    });

    contenedor.querySelectorAll(".btn-eliminar-admin").forEach(btn => {
      btn.addEventListener("click", () => eliminarHorario(btn.dataset.id));
    });
  }

  function agregarHorario() {
    const zonaId = document.getElementById("horarioZona").value;
    const dia = document.getElementById("horarioDia").value;
    const hora = document.getElementById("horarioHora").value.trim();
    const tipo = document.getElementById("horarioTipo").value;

    if (!zonaId) {
      alert("❌ Selecciona una zona primero");
      return;
    }

    if (!hora) {
      alert("❌ Escribe la hora del horario");
      return;
    }

    horarios.push({
      id: generarId("hor"),
      zonaId: zonaId,
      dia: dia,
      hora: hora,
      tipo: tipo,
      fechaCreacion: new Date().toLocaleString()
    });

    guardarStorage("horariosCleanCity", horarios);
    renderHorarios();
    renderResumen();

    document.getElementById("horarioHora").value = "";
  }

  function eliminarHorario(id) {
    if (!confirm("¿Eliminar este horario?")) return;

    horarios = horarios.filter(h => h.id !== id);
    guardarStorage("horariosCleanCity", horarios);
    renderHorarios();
    renderResumen();
  }

  // ========== REPORTES ==========

  function renderReportesAdmin() {
    const contenedor = document.getElementById("listaReportesAdmin");
    const reportes = leerStorage("reportesCleanCity");

    if (reportes.length === 0) {
      contenedor.innerHTML = '<p class="admin-vacio">📭 No hay reportes enviados.</p>';
      return;
    }

    contenedor.innerHTML = "";
    reportes.forEach(r => {
      const div = document.createElement("div");
      div.className = "admin-item";
      div.innerHTML = `
        <div class="admin-item-info">
          <div class="admin-item-titulo">📍 ${escaparHTML(r.lugar)}</div>
          <div class="admin-item-detalle">
            ${escaparHTML(r.descripcion)}<br>
            <small>📅 ${escaparHTML(r.fecha)}</small>
          </div>
        </div>
      `;
      contenedor.appendChild(div);
    });
  }

  // ========== USUARIOS ==========

  function renderUsuariosAdmin() {
    const contenedor = document.getElementById("listaUsuariosAdmin");
    const usuarios = leerStorage("usuariosCleanCity");

    if (usuarios.length === 0) {
      contenedor.innerHTML = '<p class="admin-vacio">📭 No hay usuarios registrados.</p>';
      return;
    }

    contenedor.innerHTML = "";
    usuarios.forEach(u => {
      const email = String(u.email || "");
      const esAdminEste = (typeof ADMIN_EMAILS !== "undefined") && ADMIN_EMAILS.includes(email.toLowerCase());
      const div = document.createElement("div");
      div.className = "admin-item";
      div.innerHTML = `
        <div class="admin-item-info">
          <div class="admin-item-titulo">
            👤 ${escaparHTML(u.nombre)} ${esAdminEste ? '<span class="badge-admin">🛠️ Admin</span>' : ''}
          </div>
          <div class="admin-item-detalle">
            📧 ${escaparHTML(email)}<br>
            📱 ${escaparHTML(u.telefono || "—")}
          </div>
        </div>
      `;
      contenedor.appendChild(div);
    });
  }

  // ========== RENDER GLOBAL ==========

  function renderTodo() {
    renderResumen();
    renderZonas();
    renderHorarios();
    renderReportesAdmin();
    renderUsuariosAdmin();
  }

  // ========== EVENTOS ==========

  document.getElementById("btnAgregarZona")?.addEventListener("click", agregarZona);
  document.getElementById("btnAgregarHorario")?.addEventListener("click", agregarHorario);

  document.getElementById("zonaNombre")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") agregarZona();
  });
  document.getElementById("zonaDescripcion")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") agregarZona();
  });
  document.getElementById("horarioHora")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") agregarHorario();
  });

  // Auto-refresco si otra pestaña cambia datos
  window.addEventListener("storage", (e) => {
    if (["zonasCleanCity", "horariosCleanCity", "reportesCleanCity", "usuariosCleanCity"].includes(e.key)) {
      zonas = leerStorage("zonasCleanCity");
      horarios = leerStorage("horariosCleanCity");
      renderTodo();
    }
  });

  window.addEventListener("focus", () => {
    zonas = leerStorage("zonasCleanCity");
    horarios = leerStorage("horariosCleanCity");
    renderTodo();
  });

  // ========== INICIALIZACIÓN ==========
  renderTodo();

  console.log("✅ admin.js cargado - panel de administrador listo");
}

iniciarPanelAdministrador();
