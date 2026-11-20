// ===============================
// MAPA DE RECICLAJE - POPAYÁN
// ===============================

let map;

// ========== LOADER ==========

function mostrarLoaderMapa() {
  const loader = document.getElementById("mapaLoading");
  if (loader) loader.classList.add("visible");
}

function ocultarLoaderMapa() {
  const loader = document.getElementById("mapaLoading");
  if (loader) loader.classList.remove("visible");
}

// ========== PRECARGA DE TILES ==========

function precargarTiles() {
  // Coordenadas del centro de Popayán en zoom 13
  // Los tiles se piden con estos números para que estén en caché
  const tilesClave = [
    'https://tile.openstreetmap.de/13/2417/4191.png',
    'https://tile.openstreetmap.de/13/2418/4191.png',
    'https://tile.openstreetmap.de/13/2417/4192.png',
    'https://tile.openstreetmap.de/13/2418/4192.png'
  ];
  tilesClave.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// ========== INICIALIZACIÓN DEL MAPA ==========

function initMap() {
  const popayan = [2.4416, -76.6067];

  // ⚡ Opciones de rendimiento del mapa
  map = L.map('map', {
    preferCanvas: true,
    zoomControl: true,
    fadeAnimation: true,
    zoomAnimation: true,
    markerZoomAnimation: true,
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    wheelPxPerZoomLevel: 120
  }).setView(popayan, 13);

  // ⚡ Tiles desde el MIRROR ALEMÁN (más rápido que el principal de OSM)
  L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    keepBuffer: 4,            // Mantiene 4 tiles extra alrededor
    updateWhenIdle: false,    // Carga mientras mueves
    updateWhenZooming: false, // No recarga en zoom intermedio
    detectRetina: false,      // No pide 2x en pantallas retina
    crossOrigin: true         // Ayuda al caché
  }).addTo(map);

  // ==================== PUNTOS DE RECICLAJE (VERDES) ====================
  const puntosReciclaje = [
    { nombre: "ARMAC", direccion: "Cra. 5 #9N-203, Barrio Santa Teresa", lat: 2.4585, lng: -76.6090 },
    { nombre: "Recicladora del Sur", direccion: "Popayán, Cauca", lat: 2.4310, lng: -76.5950 },
    { nombre: "Chatarrería San Diego", direccion: "Cra. 33 #7-30", lat: 2.4560, lng: -76.5970 },
    { nombre: "Chatarrería Disney", direccion: "Carrera 19 #68N-25", lat: 2.4760, lng: -76.5700 },
    { nombre: "AREMARPO", direccion: "Cra. 4A #15A-52", lat: 2.4480, lng: -76.6140 }
  ];

  // ==================== PUNTOS DE VENTA (ROJOS) ====================
  const puntosVenta = [
    { nombre: "BRASOC S.A.S.", direccion: "Variante Norte", lat: 2.5100, lng: -76.5400 },
    { nombre: "Reciclaje Global de Plástico", direccion: "Cra. 17 #61N-16", lat: 2.4780, lng: -76.5650 },
    { nombre: "Etramar S.A.S.", direccion: "Carrera 12 #60N-50", lat: 2.4750, lng: -76.5680 },
    { nombre: "Chatarrería la Mayorista", direccion: "Cra. 51 con Calle 7", lat: 2.4300, lng: -76.5800 },
    { nombre: "Chatarrería San Diego", direccion: "Cra. 33 #7-30", lat: 2.4560, lng: -76.5970 },
    { nombre: "Chatarrería Disney", direccion: "Carrera 19 #68N-25", lat: 2.4760, lng: -76.5700 }
  ];

  // Marcadores verdes
  puntosReciclaje.forEach(punto => {
    L.circleMarker([punto.lat, punto.lng], {
      radius: 10,
      fillColor: "#4caf50",
      color: "white",
      weight: 2,
      fillOpacity: 1
    }).addTo(map).bindPopup(`<strong>♻️ ${punto.nombre}</strong><br>📍 ${punto.direccion}<br><span style="color:#4caf50;">Punto de reciclaje</span>`);
  });

  // Marcadores rojos
  puntosVenta.forEach(punto => {
    L.circleMarker([punto.lat, punto.lng], {
      radius: 10,
      fillColor: "#f44336",
      color: "white",
      weight: 2,
      fillOpacity: 1
    }).addTo(map).bindPopup(`<strong>💰 ${punto.nombre}</strong><br>📍 ${punto.direccion}<br><span style="color:#f44336;">Punto de venta</span>`);
  });

  // Ocultar loader cuando las baldosas carguen
  let tilesLoaded = 0;
  map.eachLayer(layer => {
    if (layer instanceof L.TileLayer) {
      layer.on('load', () => {
        tilesLoaded++;
        if (tilesLoaded >= 1) {
          setTimeout(() => ocultarLoaderMapa(), 200);
        }
      });
    }
  });

  // Fallback: ocultar loader de todos modos
  map.whenReady(() => {
    setTimeout(() => ocultarLoaderMapa(), 800);
  });
}

// ========== EVENTO DEL BOTÓN ACTUALIZAR ==========

document.getElementById("actualizarMapa")?.addEventListener("click", () => {
  if (map) {
    mostrarLoaderMapa();
    map.setView([2.4416, -76.6067], 13);
    setTimeout(() => {
      ocultarLoaderMapa();
      mostrarToast("🗺️ Mapa centrado en Popayán", "info");
    }, 700);
  } else {
    mostrarLoaderMapa();
    initMap();
  }
});

// ========== INICIALIZACIÓN ==========

// 1. Precargar tiles (mientras el DOM termina de armarse)
precargarTiles();

// 2. Mostrar loader
mostrarLoaderMapa();

// 3. Inicializar mapa
setTimeout(() => {
  initMap();
}, 150);

// 4. Fallback por si algo falla
setTimeout(ocultarLoaderMapa, 5000);

console.log("✅ Mapa de reciclaje cargado correctamente (mirror alemán)");