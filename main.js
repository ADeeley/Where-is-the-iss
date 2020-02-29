
fetch('http://api.open-notify.org/iss-now.json')
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		drawMap(data.iss_position)
	});

function drawMap(position) {
	map = new OpenLayers.Map("mapdiv");
	map.addLayer(new OpenLayers.Layer.OSM());

	var lonLat = new OpenLayers.LonLat(position.longitude, position.latitude)
		.transform(
			new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
			map.getProjectionObject() // to Spherical Mercator Projection
		);

	var zoom = 4;

	var markers = new OpenLayers.Layer.Markers("Markers");
	map.addLayer(markers);

	markers.addMarker(new OpenLayers.Marker(lonLat));

	map.setCenter(lonLat, zoom);
}
