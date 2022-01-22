// Agregar Google Hibrido como mapa base
var osmLayer =  L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains:['mt0','mt1','mt2','mt3']
});
//Agregar Open Street Map como mapa base
var OSM = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
});

// Fnción que hace zoom a cada evento al hacer click con el cursor
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
// Función para generar un cartel al posarce sobre el departamento
function popUpfondo (feature, layer) {
    if (feature.properties && feature.properties.nam) {
        layer.bindTooltip("<b>" + feature.properties.nam + "</b>", {
            interactive: true,
            permanent: false,
            fillopacity: 0.01,
            direction: 'top',
            className: 'popup',
        });
        layer.on({      
            click: zoomToFeature
        });
    }
    
}
// Capa de fondo de departamentos
var capa_fondo = L.geoJson(Algodon_19_20, {
    fillOpacity:0,
    color:'indigo',
    weight: 2,
    onEachFeature: popUpfondo,
})

// Generar Función de colores para RTI
function getColor(d) {
    return d == 1 ? '#fefefc' :
           d == 2 ? '#00cfff' :
           d == 3 ? '#2b83ba' :
           '';
    
}

//Modificar el color de fonde en función de la propiedad Riesgo de trabajo infantil
function style(feature) {
    return {
        fillColor: getColor(feature.properties.RTI),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.9
    };
}

// Función para generar un cartel al posarce sobre el departamento
function popUpInfo (feature, layer) {
    if (feature.properties && feature.properties.nam) {
        layer.bindTooltip("<b>" + feature.properties.nam + "</b>"+
        "<br> RTI: "+ feature.properties.RTI, {
            interactive: true,
            permanent: false,
            fillopacity: 0.01,
            direction: 'top',
            className: 'popup',
        });
        layer.on({      
            click: zoomToFeature
        });
    }
    
}
var datos_mirti = L.geoJson(datos_MIRTI, {
    style: style,
    onEachFeature: popUpInfo,
});

// ================= AÑADIR ÁREA SEMBRADA DE ALGODÓN EN DIFERENTES AÑOS====================================
// Función para generar un cartel al posarce sobre el departamento
function popUpInfoAlgodon (feature, layer) {
    if (feature.properties && feature.properties.nam) {
        layer.bindTooltip("<b>" + feature.properties.nam + "</b>"+
        "<br> Área Sembrada: "+ feature.properties.Area_Sem, {
            interactive: true,
            permanent: false,
            fillopacity: 0.01,
            direction: 'top',
            className: 'popup',
        });
        layer.on({
            click: zoomToFeature
        });
    }
}
// Generar Función de colores para RTI
function getColorAlgodon(d) {
    return d > 21021 ? '#672202' :
           d > 11017 ? '#de001d' :
           d > 6464  ? '#fc0800' :
           d > 2500  ? '#f6755e' :
           d > 0     ? '#f8c5c0' :
           '#ffffff';
    
}  

//Modificar el color de fonde en función de la propiedad Riesgo de trabajo infantil
function styleAlgodon(feature) {
    return {
        fillColor: getColorAlgodon(feature.properties.Area_Sem),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 1
    };
}

// añadir área sembrada de Algodón 2018-2019 al mapa
var algodon_18_19 = L.geoJson(Algodon_18_19, {
    style: styleAlgodon,
    onEachFeature: popUpInfoAlgodon,
});
// añadir área sembrada de Algodón 2019-2020 al mapa
var algodon_19_20 = L.geoJson(Algodon_19_20, {
    style: styleAlgodon,
    onEachFeature: popUpInfoAlgodon,
});

var map = L.map('map',{
    center: [-29.25,-61.43],
    zoom: 6,
    layers: [osmLayer,capa_fondo]
});

// Hacer un diccionario con los mapa base que podemos usar
var baseMaps = {
    "Open Street Map": OSM
};
// Unir las capas que pretendemos controlar mediante la función L.control.layers()
var capas = {
    'Departamentos': capa_fondo,
    'Datos MIRTI': datos_mirti,
    'Algodón 18-19': algodon_18_19,
    'Algodón 19-20': algodon_19_20
}

L.control.layers(capas,baseMaps,{}).addTo(map);
// Añadir leyenda en función del mapa que se selecciona
var legend = L.control({position: 'bottomright'});
var ChangeLegend = L.control({position: 'bottomright'});

legend.onAdd = function(map){
    var div = L.DomUtil.create('div','info legend');
    div.innerHTML +=
    '<img id = "legend" src="leyenda_area_sembrada.jpg" width="120" height="150"/>';
    return div;
};
ChangeLegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML +=
    '<img id = "legend" src="RTI_leyenda.jpg" width="120" height="150"/>';
    return div;
};

// Función que permite visualizar la leyenda en función de la capa seleccionada
map.on('baselayerchange', function (eventLayer) {
    if (eventLayer.name === 'Datos MIRTI') {
        osmLayer.addTo(this);
        this.removeControl(legend);
        ChangeLegend.addTo(this);
    } else if (eventLayer.name === 'Algodón 19-20') {
        osmLayer.addTo(this);
        this.removeControl(ChangeLegend);
        legend.addTo(this);
        
    } else if (eventLayer.name === 'Algodón 18-19') {
        osmLayer.addTo(this);
        this.removeControl(ChangeLegend);
        legend.addTo(this);
    } else {
        this.removeControl(legend);
        this.removeControl(ChangeLegend);
        osmLayer.addTo(this);
    };
});
// Agregar información para interpretar las capas
var btnAbrirPopup = document.getElementById('btn-abrir-popup'),
	overlay = document.getElementById('overlay'),
	popup = document.getElementById('popup-popup'),
	btnCerrarPopup = document.getElementById('btn-cerrar-popup');

btnAbrirPopup.addEventListener('click', function(){
	overlay.classList.add('active');
	popup.classList.add('active');
});

btnCerrarPopup.addEventListener('click', function(e){
	e.preventDefault();
	overlay.classList.remove('active');
	popup.classList.remove('active');
});








