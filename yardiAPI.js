///////////////
// Yardi API //
///////////////

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
		// If listing has no apts available, hide
		if(unitTypes[i])
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
var getJSON = function(url, callback) {

    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    
    xhr.onload = function() {
    
        var status = xhr.status;
        
        if (status == 200) {callback(null, xhr.response);}
        else {callback(status);}
    };

	xhr.addEventListener('readystatechange', function() {
		if(this.readyState == 4) {
			let jsonUnits = this.response;
			for(let i = 0; i < jsonUnits.length; i++) {
				// Establish attributes
				let unitType = [jsonUnits[i].FloorplanName.toUpperCase()];
				let beds = [jsonUnits[i].Beds];
				let aptNum = jsonUnits[i].ApartmentName.substring(2);
				let floorNum = Number(aptNum.charAt(0));
				let avaiDate = jsonUnits[i].AvailableDate;
				let minRent = Number(jsonUnits[i].MinimumRent.split(".")[0]);
				let minPrice = priceRange(Number(jsonUnits[i].MinimumRent));
				let maxPrice = priceRange(Number(jsonUnits[i].MaximumRent));
				// Check for existing unit type
				let typeMatch = false;
				let matchedType = 0;
				if(unitTypes.length != 0) {
					for(let j = 0; j < unitTypes.length; j++) {
						if(unitTypes[j][0][0] == unitType) {typeMatch = true; matchedType = j; break}
					}
				}
				// If no match, push to unitTypes[] & push empty [] to units[]
				if(typeMatch == false) {
					unitTypes.push([unitType, beds, [], [], []]);
					units.push([]);
					matchedType = unitTypes.length - 1
				}
				// Push unit to corresponding type array in units[]
				units[matchedType].push([aptNum, floorNum, avaiDate, [minRent, minPrice, maxPrice]])
			}
			console.log(unitTypes);
			console.log(units);
			populateApts();
			if(curSt == 1) {changeSlide()}
			dataReady = true;
			for(let i = 0; i < fltrArr.length; i++) {fltrArr[i].disabled = false}	
		}
	});
    xhr.send();
};

getJSON('https://api.rentcafe.com/rentcafeapi.aspx?requestType=apartmentavailability&APIToken=OTc2ODI%3d-ypOsYE8hSPU%3d&propertyCode=p1206322',  function(err, data) {
    
    if (err != null) {console.error(err);}
    else {}
});