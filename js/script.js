mapboxgl.accessToken = 'pk.eyJ1IjoiYXBleGJsbiIsImEiOiJjam9nem5oMHAwa2pyM3BuMHFqY2JqcmxyIn0.deyw0HuvXOvy0zfjI-ha2g';
var map = new mapboxgl.Map({
    container: 'map',
	center: [13.405, 52.520],
    zoom: 10,
	//hash: true, //zeigt Kartenmittelpunkt in URL (zoom, center latitude, center longitude, bearing, and pitch)
    style: 'mapbox://styles/mapbox/streets-v9'
});

// Setzt die Label auf Deutsch (
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js');
map.addControl(new MapboxLanguage({
  defaultLanguage: 'de'
}));

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});

map.addControl(geocoder);



var liveposition = 'https://wanderdrone.appspot.com/';
// var liveposition = 'positionS.json';
var herosberlin = 'geodata/thwblnov.geojson';
var herosfue = 'geodata/thwblnfue.geojson';
var img1 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/THW-Jugend_Logo_2010.svg/2000px-THW-Jugend_Logo_2010.svg.png';
var img2 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/THW.svg/2000px-THW.svg.png';


function berechne_BMI (value) {
	//alert ("BLA: " + value);
	args = "_blank", "toolbar=no,scrollbars=no,width=600,height=600,resizable=no";
	url = "site/popup.php";
	mywindow= window.open(url,"Fenstername",args);
	mywindow.document.write("<p>Fahrzeug: " + value + " </p>");
	mywindow.document.write("<p>Adresse: </p>");	
	mywindow.document.write("<p><Koordinaten: </p>");
	mywindow.document.write("<p>Einsatznummer: </p>");
	mywindow.document.write("<p>Datum: </p>");
	mywindow.document.write("<p>Kennzeichen: </p>");
	mywindow.document.write("<p>Kilometerstand: </p>");
	mywindow.document.write("<p>Alarmirungsstichwort: </p>");
}

map.on('load', function () {
    // Laden der Daten inkl. festlegung wie oft es neu geladen wird (Für Livedaten wichtig)
	window.setInterval(function() {
        map.getSource('drone').setData(liveposition);
		map.getSource('thwblnov').setData(herosberlin);
		map.getSource('thwblnfue').setData(herosfue);
    }, 2000);
	
	// Implimentieren der Liveposition
    map.addSource('drone', { type: 'geojson', data: liveposition });
    map.addLayer({
        "id": "drone",
        "type": "symbol",
        "source": "drone",
        "layout": {
            "icon-image": "rocket-15"
        }
    });
	
	// Implimentieren der THW Ortsverbände aus lokaler GeoJSON
	map.addSource('thwblnov', { type: 'geojson', data: herosberlin });
	map.addLayer({
        "id": "thwblnov",
        "type": "circle",
        "source": "thwblnov",
        "paint": {
            "circle-radius": 10,
            "circle-color": "#007cbf",
            "circle-opacity": 0.5,
            "circle-stroke-width": 0
        }
    });

	// Implimentieren der "THW Führung_gelberPunkt" aus lokaler GeoJSON
	map.addSource('thwblnfue', { type: 'geojson', data: herosfue });
	map.addLayer({
        "id": "thwblnfue",
        "type": "circle",
        "source": "thwblnfue",
        "paint": {
            "circle-radius": 10,
            "circle-color": "yellow",
            "circle-opacity": 1.0,
            "circle-stroke-width": 0
        }
    });
	
	// Implimentieren der "THW Führung_THWJugendSymbol" aus lokaler GeoJSON
	map.loadImage(img1, function(error, image1) {
        if (error) throw error;
        map.addImage('cat1', image1);
        map.addLayer({
            "id": "points",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": "geodata/thwblnfue.geojson"
            },
            "layout": {
                "icon-image": "cat1",
                "icon-size": 0.01
            }
        });
    });
	
	// Stellt Geocoderposition als Punkt dar
    map.addSource('single-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "point",
        "source": "single-point",
        "type": "circle",
        "paint": {
            "circle-radius": 10,
            "circle-color": "#007cbf"
        }
    });

    // Listen for the `result` event from the MapboxGeocoder that is triggered when a user
    // makes a selection and add a symbol that matches the result.
    geocoder.on('result', function(ev) {
        map.getSource('single-point').setData(ev.result.geometry);
		
    });
});

