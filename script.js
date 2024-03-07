/* 1. Utiliza Leaflet para posicionarte en un mapa */

navigator.geolocation.getCurrentPosition(position => {

    const map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

});


/* 2. Dibujar en un mapa las coordenadas de posiciones donde hay terremotos  */

const map2 = L.map('map2').setView([51.5, -0.09], 1.49);

/* L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map2); */

L.tileLayer.provider('OpenTopoMap').addTo(map2);

async function terremotos() {

    let response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
    let data = await response.json();

    /* Ya tenemos los datos procesados para operar con ellos. A partir de aquí todo lo que queremos es hacer es recorrer el array donde están los datos de los terremotos (data.features) para crear markers, y para recorrer la magnitud segun magnitud y dar un color según est. Siempre tenemos que recorrer ese array... pero no necesitamos transformar ese array en otro por lo que no sé si lo mejor es usar map o forEach */

    let terremotos = data.features;

    // console.log(terremotos);

    terremotos.map(terremoto => {

        if (terremoto.properties.mag < 1) {
            color = "green"
        }
        else if (terremoto.properties.mag >= 1 && terremoto.properties.mag < 3) {
            color = "yellow"
        }
        else if (terremoto.properties.mag >= 3 && terremoto.properties.mag < 5){
            color = "orange"
        }
        else {
            color = "red"
        }

        let myIcon = L.icon({
            iconUrl: `assets/marker-icon-${color}.png`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

        L.marker([terremoto.geometry.coordinates[1], terremoto.geometry.coordinates[0]], { icon: myIcon }).addTo(map2)
            .bindPopup(`${terremoto.properties.title}, ${Date(terremoto.properties.time)}, ${terremoto.properties.date}, ${terremoto.properties.mag}, ${terremoto.properties.magType}`)
            .openPopup();
    })
}

terremotos();
