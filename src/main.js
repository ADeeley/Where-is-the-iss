import url from "../assets/iss.svg"; // Import the image URL so we can bundle with parcel
console.log(`../assets${url}`);
const devMode = false; // use mocked lat long so we don't spam the API
const openNotifyApi = "http://api.open-notify.org/iss-now.json";
const dataFetchInterval = 30000;

const map = new OpenLayers.Map("mapdiv");
const markers = new OpenLayers.Layer.Markers("Markers");
let issMarker;
map.addLayer(markers);

if (devMode) {
  const data = { latitude: "-6.7052", longitude: "46.7854" };
  drawMap(data);
  drawDetails(data);
} else {
  getData();
  setInterval(getData, dataFetchInterval);
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
function drawMarker(lonLat) {
  var size = new OpenLayers.Size(25, 25);
  var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
  var icon = new OpenLayers.Icon(url, size, offset);
  markers.removeMarker(issMarker);
  issMarker = new OpenLayers.Marker(lonLat, icon);
  markers.addMarker(issMarker);
}

function drawMap(position) {
  map.addLayer(new OpenLayers.Layer.OSM());

  const lonLat = new OpenLayers.LonLat(
    position.longitude,
    position.latitude
  ).transform(
    new OpenLayers.Projection("EPSG:4326"),
    map.getProjectionObject()
  );

  const zoom = 1;
  drawMarker(lonLat);
  map.setCenter(lonLat, zoom);
}

function drawDetails(position) {
  document.querySelector(
    "#location"
  ).innerHTML = `<p>lat: ${position.latitude}, long: ${position.longitude}</p>`;
}

function init() {
  document.querySelector("#updateInterval").innerHTML = `${
    dataFetchInterval / 1000
  } seconds`;
}

init();
