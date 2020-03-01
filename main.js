const devMode = true	; // use mocked lat long so we don't spam the API
const openNotifyApi = 'http://api.open-notify.org/iss-now.json';
const dataFetchInterval = 30000;
const map = new OpenLayers.Map("mapdiv");

if (devMode) {
	const data = { latitude: "-6.7052", longitude: "46.7854" };
	drawMap(data);
	drawDetails(data);
} else {
	getData();
}

function getData() {
	fetch(openNotifyApi)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			drawMap(data.iss_position);
			drawDetails(data.iss_position);
		});
}
function drawMarker() {
	var size = new OpenLayers.Size(21, 25);
	var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
	var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
}

function drawMap(position) {
	map.addLayer(new OpenLayers.Layer.OSM());

	const lonLat = new OpenLayers.LonLat(position.longitude, position.latitude)
		.transform(
			new OpenLayers.Projection("EPSG:4326"),
			map.getProjectionObject()
		);

	const zoom = 1;
	const markers = new OpenLayers.Layer.Markers("Markers");
	map.addLayer(markers);

	markers.addMarker(new OpenLayers.Marker(lonLat));

	map.setCenter(lonLat, zoom);
}

function drawDetails(position) {
	document.querySelector('#location').innerHTML = (`<p>lat: ${position.latitude}, long: ${position.longitude}</p>`);
}

setInterval(getData, dataFetchInterval);