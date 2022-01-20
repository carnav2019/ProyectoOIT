

// Agregar Google Hibrido como mapa base
var osmLayer =  L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains:['mt0','mt1','mt2','mt3']
});
// Fnción que hace zoom a cada evento al hacer click con el cursor
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
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
    layers: [osmLayer, algodon_19_20]
});
// Hacer un diccionario con los mapa base que podemos usar
var baseMaps = {
    "Google HYBRID": osmLayer,
};
// Unir las capas que pretendemos controlar mediante la función L.control.layers()
var capas = {
    "Datos MIRTI": datos_mirti,
    "Algodón 18-19": algodon_18_19,
    "Algodón 19-20": algodon_19_20
}

L.control.layers(capas, baseMaps,{groupCheckboxes: true}).addTo(map);

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
// Añadir la leyenda de área sembrada por defecto
legend.addTo(map)
// Función que permite visualizar la leyenda en función de la capa seleccionada
map.on('baselayerchange', function (eventLayer) {
    if (eventLayer.name === 'Datos MIRTI') {
        this.removeControl(legend);
        ChangeLegend.addTo(this);
    } else { 
        this.removeControl(ChangeLegend);
        legend.addTo(this);
    }
});


