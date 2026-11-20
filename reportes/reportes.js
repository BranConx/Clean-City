// ===============================
// REPORTES - CLEANCITY
// ===============================

let reportes = [];

// Índices temporales para los modales
let indiceEditando = -1;
let indiceEliminando = -1;

// ========== TOAST ==========

function mostrarToast(mensaje, tipo = "exito") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

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

// ========== ALMACENAMIENTO ==========

function guardarReportes() {
  localStorage.setItem("reportesCleanCity", JSON.stringify(reportes));
}

function cargarReportes() {
  const guardados = localStorage.getItem("reportesCleanCity");
  if (guardados) {
    try {
      reportes = JSON.parse(guardados);
    } catch (e) {
      console.log("Error al parsear reportes:", e);
      reportes = [];
    }
  }
  mostrarListaReportes();
}

// ========== INTERFAZ ==========

function mostrarListaReportes() {
  const contenedor = document.getElementById("listaReportes");
  if (!contenedor) return;

  if (reportes.length === 0) {
    contenedor.innerHTML = '<p class="vacio-reportes">📭 No hay reportes enviados.</p>';
    return;
  }

  contenedor.innerHTML = "";

  reportes.forEach((reporte, index) => {
    const div = document.createElement("div");
    div.className = "reporte-item";
    div.innerHTML = `
      <div class="reporte-contenido">
        <strong>📍 ${reporte.lugar}</strong>
        <p>${reporte.descripcion}</p>
        <small>📅 ${reporte.fecha}</small>
      </div>
      <div class="reporte-acciones">
        <button class="btn-editar" data-index="${index}">✏️ Editar</button>
        <button class="btn-eliminar" data-index="${index}">🗑️ Eliminar</button>
      </div>
    `;
    contenedor.appendChild(div);
  });

  document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      abrirModalEditar(index);
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      abrirModalEliminar(index);
    });
  });
}

// ========== CRUD ==========

function agregarReporte(lugar, descripcion) {
  if (!lugar.trim() || !descripcion.trim()) {
    mostrarToast("❌ Por favor, completa todos los campos", "error");
    return false;
  }

  const nuevoReporte = {
    lugar: lugar.trim(),
    descripcion: descripcion.trim(),
    fecha: new Date().toLocaleString()
  };

  reportes.push(nuevoReporte);
  guardarReportes();
  mostrarListaReportes();
  return true;
}

// ========== MODAL EDITAR ==========

function abrirModalEditar(index) {
  if (index < 0 || index >= reportes.length) return;

  indiceEditando = index;
  const reporte = reportes[index];

  document.getElementById("editarLugar").value = reporte.lugar;
  document.getElementById("editarDescripcion").value = reporte.descripcion;

  const modal = document.getElementById("modalEditar");
  modal.classList.add("visible");

  // Foco en el primer campo
  setTimeout(() => document.getElementById("editarLugar").focus(), 100);
}

function cerrarModalEditar() {
  document.getElementById("modalEditar").classList.remove("visible");
  indiceEditando = -1;
}

function guardarEdicion() {
  if (indiceEditando < 0) return;

  const nuevoLugar = document.getElementById("editarLugar").value.trim();
  const nuevaDesc  = document.getElementById("editarDescripcion").value.trim();

  if (!nuevoLugar || !nuevaDesc) {
    mostrarToast("❌ Todos los campos son obligatorios", "error");
    return;
  }

  reportes[indiceEditando] = {
    lugar: nuevoLugar,
    descripcion: nuevaDesc,
    fecha: new Date().toLocaleString()
  };

  guardarReportes();
  mostrarListaReportes();
  cerrarModalEditar();
  mostrarToast("✅ Reporte actualizado correctamente", "exito");
}

// ========== MODAL ELIMINAR ==========

function abrirModalEliminar(index) {
  if (index < 0 || index >= reportes.length) return;

  indiceEliminando = index;
  const reporte = reportes[index];

  document.getElementById("eliminarLugar").textContent = reporte.lugar;
  document.getElementById("eliminarDescripcion").textContent = reporte.descripcion;

  document.getElementById("modalEliminar").classList.add("visible");
}

function cerrarModalEliminar() {
  document.getElementById("modalEliminar").classList.remove("visible");
  indiceEliminando = -1;
}

function confirmarEliminar() {
  if (indiceEliminando < 0) return;

  reportes.splice(indiceEliminando, 1);
  guardarReportes();
  mostrarListaReportes();
  cerrarModalEliminar();
  mostrarToast("🗑️ Reporte eliminado", "exito");
}

// ========== EVENTOS DEL FORMULARIO PRINCIPAL ==========

document.getElementById("enviarReporte")?.addEventListener("click", () => {
  const lugar = document.getElementById("reporteLugar").value;
  const descripcion = document.getElementById("reporteDescripcion").value;

  if (agregarReporte(lugar, descripcion)) {
    document.getElementById("reporteLugar").value = "";
    document.getElementById("reporteDescripcion").value = "";
    mostrarToast("✅ Reporte enviado correctamente", "exito");
  }
});

// ========== EVENTOS DE MODALES ==========

// Modal editar
document.getElementById("btnCancelarEditar")?.addEventListener("click", cerrarModalEditar);
document.getElementById("btnGuardarEditar")?.addEventListener("click", guardarEdicion);

// Modal eliminar
document.getElementById("btnCancelarEliminar")?.addEventListener("click", cerrarModalEliminar);
document.getElementById("btnConfirmarEliminar")?.addEventListener("click", confirmarEliminar);

// Cerrar al hacer clic fuera de la tarjeta
document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      if (overlay.id === "modalEditar") cerrarModalEditar();
      if (overlay.id === "modalEliminar") cerrarModalEliminar();
    }
  });
});

// Cerrar con la tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (document.getElementById("modalEditar")?.classList.contains("visible")) {
      cerrarModalEditar();
    }
    if (document.getElementById("modalEliminar")?.classList.contains("visible")) {
      cerrarModalEliminar();
    }
  }

  // Guardar con Ctrl+Enter dentro del modal de editar
  if (e.key === "Enter" && e.ctrlKey) {
    if (document.getElementById("modalEditar")?.classList.contains("visible")) {
      guardarEdicion();
    }
  }
});

// ========== INICIALIZACIÓN ==========
cargarReportes();

console.log("✅ reportes.js cargado");