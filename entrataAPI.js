/////////////////
// Entrata API //
/////////////////

// Request parameters
const data = JSON.stringify({"auth":{"type":"basic"},"requestId":15,"method":{"name":"getUnitsAvailabilityAndPricing","version":"r1","params":{"propertyId":"775371","availableUnitsOnly":"0","unavailableUnitsOnly":"0","skipPricing":"0","showChildProperties":"0","includeDisabledFloorplans":"0","includeDisabledUnits":"0","showUnitSpaces":"0","useSpaceConfiguration":"0","allowLeaseExpirationOverride":"0"}}});

var xhr = new XMLHttpRequest();
var dataReady = false;
var unitTypes = [];
var units = [];
var apts = [];

// Sitemap
const sitemaps = document.getElementsByClassName("res-map-sitemap");
const sitemapConts = document.getElementsByClassName("res-map-col-wrap");
var sitemapLayers = [];
for(let i = 0; i < sitemaps.length; i++) {sitemapLayers.push(sitemaps[i].nextSibling.querySelectorAll(".res-map-col-item"))}

function priceRange(price) {
	if(price < 1501) {return 1}
	else if(price < 1901) {return 2}
	else if(price < 2501) {return 3}
	else if(price < 3001) {return 4}
	else {return 5}
}

function pushToUnitTypes(i, j, item) {
	if(unitTypes[i][j].length > 0 && unitTypes[i][j].includes(item)) {}
	else {unitTypes[i][j].push(item)}
}

function populateApts() {
	for(let i = 0; i < unitTypes.length; i++) {
		let aptDiv = {}
		// Match unitTypes[i] to its corresponding list item + store its aptDiv
		for(let j = 0; j < lstArr.length; j ++) {
			aptDiv = lstArr[j].querySelector(".res-lst-apt-div");
			if(aptDiv.dataset.apt.toUpperCase() == unitTypes[i][0][0]) {break}
		}
		// For each units[i], clone aptDiv + populate
		apts.push([]);
		for(let j = 0; j < units[i].length; j++) {
			let aptCon = aptDiv.parentNode
			let newApt = aptDiv.cloneNode(true);
			let txtArr = newApt.querySelectorAll(".res-lst-apt-txt");
			let mapView = newApt.querySelector(".res-lst-apt-txt-div.map");
			txtArr[0].innerText = "APT " + units[i][j][0];
			txtArr[1].innerText = "Floor " + units[i][j][1];
			txtArr[2].innerText = "Available " + units[i][j][2];
			txtArr[3].innerText = "Starting at $" + units[i][j][3][0];
			// Click to display unit on sitemap
			mapView.addEventListener('click', () => {changeFloor(units[i][j][1])});
			newApt.style.display = "flex";
			aptCon.appendChild(newApt);
			// Store newApt(s) relative to their parent unit type
			apts[i].push(newApt)
		}
	}
	// Set avai or unavai SVGs for each sitemap layer
	for(let i = 0; i < sitemapLayers.length; i++) {
		for(let j = 0; j < sitemapLayers[i].length; j++) {
			let layerMatch = false;
			let aptNum = sitemapLayers[i][j].querySelector(".res-map-data").dataset.apt;
			let avaiSVG = sitemapLayers[i][j].querySelector(".res-map-svg.avai");
			let unavaiSVG = sitemapLayers[i][j].querySelector(".res-map-svg.unavai");
			// Cycle through each group of apts
			for(let k = 0; k < apts.length; k++) {
				if(layerMatch == true) {break}
				// Cycle through each apt in that group to find a match
				for(let l = 0; l < apts[k].length; l++) {
					let aptTxt = apts[k][l].querySelector(".res-lst-apt-txt.apt").textContent;
					if(aptTxt.includes(aptNum)) {layerMatch = true; break}
				}
			}
			// If match is found, display avaiSVG. If not, display unavaiSVG
			if(layerMatch == true) {avaiSVG.style.display = "inline-block"}
			else {unavaiSVG.style.display = "inline-block"}
		}
	}
}

// For IE
if(!Object.keys) Object.keys = function(o) {
	if(o !== Object(o))
		throw new TypeError('Object.keys called on a non-object');
	var k=[],p;
	for(p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
	return k;
}

// Sort data
xhr.addEventListener('readystatechange', function() {
	if(this.readyState == 4) {
		let json = JSON.parse(this.responseText);
		let jsonUnitTypes = json.response.result.Properties.Property[0].Floorplans.Floorplan;
		let jsonUnits = json.response.result.ILS_Units.Unit;
		let objKeysUnits = Object.keys(jsonUnits);
		// Populate unitTypes[] with name & # of bedrooms of each + empty arrays
		for(let i = 0; i < jsonUnitTypes.length; i++) {
			let beds = [];
			// Extract # of bedrooms + push to beds[]
			for(let j = 0; j < jsonUnitTypes[i].Room.length; j++) {
				if(jsonUnitTypes[i].Room[j].Comment == "Bedroom") {
					beds.push(jsonUnitTypes[i].Room[j].Count)
				}
				if(jsonUnitTypes[i].Name.includes("Studio")) {beds[0] = 0}
			}
			unitTypes.push([[jsonUnitTypes[i].Name.toUpperCase()], beds, [], [], []]);
		}
		// Set units[] length to match unitTypes[] + set each entry as []
		units.length = unitTypes.length;
		for(let i = 0; i < units.length; i++) {units[i] = []}
		// 
		for(let i = 0; i < objKeysUnits.length; i++) {
			let unitObj = jsonUnits[Number(objKeysUnits[i])];
			let unitAttrs = unitObj["@attributes"];
			// Check if the unit is available
			if(unitAttrs.Availability == "Available") {
				let floorNum = unitAttrs.FloorId - 2663330;
				let minPrice = priceRange(Number(unitObj.Rent["@attributes"].MinRent.replace(/,/g, "")));
				let maxPrice = priceRange(Number(unitObj.Rent["@attributes"].MaxRent.replace(/,/g, "")));
				// Push to units[], corresponding to matching unit type in unitTypes[]
				for(let j = 0; j < unitTypes.length; j++) {
					if(unitAttrs.FloorPlanName.toUpperCase() == unitTypes[j][0]) {
						// Floor #
						pushToUnitTypes(j, 2, floorNum);
						// Price range
						pushToUnitTypes(j, 3, minPrice);
						pushToUnitTypes(j, 3, maxPrice);
						// Push selected attributes to new units[] entry
						units[j].push([unitAttrs.UnitNumber, floorNum, unitAttrs.AvailableOn, [unitObj.Rent["@attributes"].MinRent.split(".")[0], minPrice, maxPrice]]);
						break
					}
				}
			}
		}
		populateApts();
		if(curSt == 1) {changeSlide()}
		dataReady = true;
		for(let i = 0; i < fltrArr.length; i++) {fltrArr[i].disabled = false}
	}
});

// Request data
xhr.open("POST", "https://matrixresidential.entrata.com/api/v1/propertyunits");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Authorization", "Basic ZnJlZF9hZ2VuY3lfYXBpQG1hdHJpeHJlc2lkZW50aWFsOkZyZWQxMzAyMDIwKg==");

xhr.send(data);