// Populate //

const unitListings = document.querySelectorAll('.res-lst-col-item');
var dataReady = false;
var units = [];
var apts = [];

// Sitemap
const sitemaps = document.getElementsByClassName("res-map-sitemap");
const sitemapConts = document.getElementsByClassName("res-map-col-wrap");
var sitemapLayers = [];
for(let i = 0; i < sitemaps.length; i++) {sitemapLayers.push(sitemaps[i].nextSibling.querySelectorAll(".res-map-col-item"))}

function populateApts() {
	// Match each unitListings[] to it's unit type in units[]
	for(let i = 0; i < unitListings.length; i++) {
		let unitsAvailable = 0;
		for(let j = 0; j < units.length; j++) {
			let listingName = unitListings[i].querySelector('.res-lst-hdng').textContent.toUpperCase();
			// Once matched, populate the apts for that unit
			if(listingName == units[j].name) {
				let aptCont = unitListings[i].querySelector('.res-lst-apt-con');
				// Generate new apts + add to list
				for(let k = 0; k < units[j].apts.length; k++) {
					let aptTemplate = aptCont.querySelector('.res-lst-apt-div');
					let newApt = aptTemplate.cloneNode(true);
					let txtArr = newApt.querySelectorAll('.res-lst-apt-txt');
					let mapView = newApt.querySelector(".res-lst-apt-txt-div.map");
					txtArr[0].innerText = "APT " + units[j].apts[k].name;
					txtArr[1].innerText = "Floor " + units[j].apts[k].floor;
					txtArr[2].innerText = "Available " + units[j].apts[k].date;
					txtArr[3].innerText = "Starting at $" + units[j].apts[k].price;
					// Click to display on sitemap
					mapView.addEventListener('click', () => {changeFloor(units[j].apts[k].floor)});
					newApt.style.display = "flex";
					aptCont.appendChild(newApt);
					unitsAvailable++
				}
			}
		}
		// If unit has no apts available, minimise
		if(unitsAvailable == 0) {lstItem(unitListings[i], 0)}
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
				let typeName = jsonUnits[i].FloorplanName.toUpperCase();
				let name = jsonUnits[i].ApartmentName.substring(2);
				let beds = Number(jsonUnits[i].Beds);
				let floor = Number(name.charAt(0));
				let price = Number(jsonUnits[i].MinimumRent.split(".")[0]);
				let date = jsonUnits[i].AvailableDate;
				// Construct unit object
				let newApt = {
					"name": name,
					"beds": beds,
					"floor": floor,
					"price": price,
					"date": date,
					"hidden": false
				}
				// Check for existing unit type
				let typeMatch = false;
				let matchedType = 0;
				if(units.length != 0) {
					for(let j = 0; j < units.length; j++) {
						if(units[j].name == typeName) {typeMatch = true; matchedType = j; break}
					}
				}
				// If no match, construct new unit type & push to units[]
				if(typeMatch == false) {
					let newUnitType = {
						"name": typeName,
						"apts": []
					}
					units.push(newUnitType);
					matchedType = units.length - 1
				}
				// Push unit to corresponding unit type array in units[]
				units[matchedType].apts.push(newApt)
			}
			console.log(units);
			populateApts();
			if(curSt == 1) {changeSlide()}
			dataReady = true;
			for(let i = 0; i < filterBttns.length; i++) {filterBttns[i].disabled = false}	
		}
	});
    xhr.send();
};

// Get data
getJSON('https://api.rentcafe.com/rentcafeapi.aspx?requestType=apartmentavailability&APIToken=OTc2ODI%3d-ypOsYE8hSPU%3d&propertyCode=p1206322',  function(err/*, data*/) {    
    if (err != null) {console.error(err);}
    else {}
});