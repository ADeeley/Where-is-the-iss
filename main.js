const devMode = true; // use mocked lat long so we don't spam the API
const openNotifyApi = 'http://api.open-notify.org/iss-now.json';

if (devMode) {
	drawMap({ latitude: "43.7988", longitude: "155.2097" });
} else {
	fetch(openNotifyApi)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			drawMap(data.iss_position)
		});
}

function drawMap(position) {
	map = new OpenLayers.Map("mapdiv");
	map.addLayer(new OpenLayers.Layer.OSM());

	const lonLat = new OpenLayers.LonLat(position.longitude, position.latitude)
		.transform(
			new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
			map.getProjectionObject() // to Spherical Mercator Projection
		);

	const zoom = 4;
	const markers = new OpenLayers.Layer.Markers("Markers");
	map.addLayer(markers);

	markers.addMarker(new OpenLayers.Marker(lonLat));

	map.setCenter(lonLat, zoom);
}
