const mapCats = document.getElementsByClassName("map-category");
const mapItems = document.getElementsByClassName("map-item");
const mapLists = document.getElementsByClassName("map-item-list");
const slxMarker = {type: "FeatureCollection", features: [{type: "Feature", geometry: {type: "Point", coordinates: [-84.309, 33.891]}}]}
var geojson = {type: "FeatureCollection", features: []}
var catNums = [];
var markers = [];

// Crete new map
mapboxgl.accessToken = "pk.eyJ1IjoidGhlY2hyaXNlbHNvbiIsImEiOiJjazY2aWMwYW4wNHN3M2xwajVwdXg5bnZwIn0.qN17abkQA21Ry6Bu2PbMBA";
var map = new mapboxgl.Map({
	container: "mapContainer",
	style: "mapbox://styles/thechriselson/ck6uy74br02al1io4dynodeq8",
	center: [-84.309, 33.891],
	zoom: 14
});

function openCloseCat(cat) {
	let listNum = 0;
	for(let i = 0; i < catNums.length; i++) {
		if(catNums[i][0] == cat) {listNum = catNums[i][1]; break}
	}
	// MaxH = computed height of a list item * #elements in category / 16 (rem) + 0.875 (padding)
	let maxH = "" + (Number(getComputedStyle(mapItems[0]).height.replace(/[^\d\.-]/g, '')) * listNum / 16 + 0.875) + "rem";
	for(let i = 0; i < mapLists.length; i++) {
		if(mapLists[i].querySelector(".map-item-embed").dataset.cat == cat) {
			// Open list
			mapLists[i].style.maxHeight = maxH;
			mapLists[i].style.paddingBottom = "0.875rem"
		}
		else {
			// Close list
			mapLists[i].style.transition = "all 0ms";
			mapLists[i].style.maxHeight = maxH;
			mapLists[i].style.transition = "all 200ms";
			mapLists[i].style.paddingBottom = "0rem";
			mapLists[i].style.maxHeight = "0rem"
		}
	}
}

// Filter markers
function filterMarkers(cat) {
	for(let i = 0; i < markers.length; i++) {
		if(cat == "All") {markers[i].style.display = "block"}
		else if(markers[i].dataset.cat != cat) {markers[i].style.display = "none"}
		else {markers[i].style.display = "block"}
	}
}

// Create new marker
function createMarker(marker, className, popup) {
	let el = document.createElement('div');
	el.className = className;
	if(popup) {
		new mapboxgl.Marker(el)
			.setLngLat(marker.geometry.coordinates)
			.setPopup(new mapboxgl.Popup({offset: 25})
				.setHTML('<p>' + marker.properties.title + '</p>'))
			.addTo(map);
		// Set color + assign category data to new element + push to array
		el.style.backgroundColor = marker.color;
		el.setAttribute('data-cat', marker.category);
		el.style.transition = "all 400ms";
		markers.push(el)
		}
	else {new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map)}
}

// Collect data from map items + push to geojson[] as marker object
for(let i = 0; i < mapItems.length; i++) {
	let data = mapItems[i].querySelector(".map-item-embed").dataset;
	// Create + push new marker data object
	geojson.features.push({
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: [data.lng, data.lat]
		},
		properties: {
			title: data.name
		},
		category: data.cat,
		color: data.color,
	});
	// Add current item to the corresponding category's count
	if(catNums.length == 0) {catNums.push([data.cat, 1])}
	else if(!catNums.includes(data.cat)) {catNums.push([data.cat, 1])}
	else {
		for(let j = 0; j < catNums.length; j++) {
			if(catNums[i][0] == data.cat) {catNums[i][1]++; break}
		}
	}
}

// Create SLX marker
createMarker(slxMarker.features[0], "slx-marker", false);

// Create all location markers
for(let i = 0; i < geojson.features.length; i++) {createMarker(geojson.features[i], "map-marker", true)}

// Category names onClick
for(let i = 0; i < mapCats.length; i++) {
	mapCats[i].addEventListener('click', function() {
		// Expand items list + filter markers
		openCloseCat(mapCats[i].textContent);
		filterMarkers(mapCats[i].textContent)
	})
}