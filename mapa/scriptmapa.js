// ===============================
// MAPA DE RECICLAJE - SCRIPT
// ===============================
// Esta parte del código sirve para: mostrar un mapa interactivo de Popayán con puntos de reciclaje

// Esta parte del código sirve para: inicializar el mapa Leaflet centrado en Popayán
const map = L.map('map').setView([2.4416, -76.6067], 13);

// Esta parte del código sirve para: cargar las baldosas del mapa de OpenStreetMap (gratis sin API key)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// ==================== PUNTOS DE RECICLAJE (VERDES) ====================
// Esta parte del código sirve para: almacenar las ubicaciones de los centros de acopio de reciclaje
const puntosReciclaje = [
    { 
        nombre: "ARMAC", 
        direccion: "Cra. 5 #9N-203, Barrio Santa Teresa",
        lat: 2.4585, 
        lng: -76.6090 
    },
    { 
        nombre: "Recicladora del Sur", 
        direccion: "Popayán, Cauca",
        lat: 2.4310, 
        lng: -76.5950 
    },
    { 
        nombre: "Chatarrería San Diego", 
        direccion: "Cra. 33 #7-30",
        lat: 2.4560, 
        lng: -76.5970 
    },
    { 
        nombre: "Chatarrería Disney", 
        direccion: "Carrera 19 #68N-25, Bello Horizonte",
        lat: 2.4760, 
        lng: -76.5700 
    },
    { 
        nombre: "AREMARPO", 
        direccion: "Cra. 4A #15A-52",
        lat: 2.4480, 
        lng: -76.6140 
    }
];

// ==================== PUNTOS DE VENTA (ROJOS) ====================
// Esta parte del código sirve para: almacenar las ubicaciones donde se venden productos reciclados
const puntosVenta = [
    { 
        nombre: "BRASOC S.A.S.", 
        direccion: "Variante Norte",
        lat: 2.5100, 
        lng: -76.5400 
    },
    { 
        nombre: "Reciclaje Global de Plástico", 
        direccion: "Cra. 17 #61N-16, San Andresito",
        lat: 2.4780, 
        lng: -76.5650 
    },
    { 
        nombre: "Etramar S.A.S.", 
        direccion: "Carrera 12 #60N-50",
        lat: 2.4750, 
        lng: -76.5680 
    },
    { 
        nombre: "Chatarrería la Mayorista", 
        direccion: "Cra. 51 con Calle 7",
        lat: 2.4300, 
        lng: -76.5800 
    },
    { 
        nombre: "Chatarrería San Diego", 
        direccion: "Cra. 33 #7-30",
        lat: 2.4560, 
        lng: -76.5970 
    },
    { 
        nombre: "Chatarrería Disney", 
        direccion: "Carrera 19 #68N-25",
        lat: 2.4760, 
        lng: -76.5700 
    }
];

// ========== AGREGAR MARCADORES VERDES (CÍRCULOS) ==========
// Esta parte del código sirve para: agregar marcadores verdes al mapa para los puntos de reciclaje
puntosReciclaje.forEach(punto => {
    const marker = L.circleMarker([punto.lat, punto.lng], {
        radius: 10,
        fillColor: "#4caf50",
        color: "white",
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    }).addTo(map);
    
    marker.bindPopup(`
        <strong>♻️ ${punto.nombre}</strong><br>
        📍 ${punto.direccion}<br>
        <span style="color: #4caf50;">Punto de reciclaje</span>
    `);
});

// ========== AGREGAR MARCADORES ROJOS (CÍRCULOS) ==========
// Esta parte del código sirve para: agregar marcadores rojos al mapa para los puntos donde venden lo reciclado
puntosVenta.forEach(punto => {
    const marker = L.circleMarker([punto.lat, punto.lng], {
        radius: 10,
        fillColor: "#f44336",
        color: "white",
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    }).addTo(map);
    
    marker.bindPopup(`
        <strong>💰 ${punto.nombre}</strong><br>
        📍 ${punto.direccion}<br>
        <span style="color: #f44336;">Punto de venta de reciclado</span>
    `);
});

console.log("✅ Mapa de reciclaje de Popayán cargado correctamente");