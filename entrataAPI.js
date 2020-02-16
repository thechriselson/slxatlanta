/////////////////
// Entrata API //
/////////////////

// Request parameters
const data = JSON.stringify({"auth":{"type":"basic"},"requestId":15,"method":{"name":"getUnitsAvailabilityAndPricing","version":"r1","params":{"propertyId":"775371","availableUnitsOnly":"0","unavailableUnitsOnly":"0","skipPricing":"0","showChildProperties":"0","includeDisabledFloorplans":"0","includeDisabledUnits":"0","showUnitSpaces":"0","useSpaceConfiguration":"0","allowLeaseExpirationOverride":"0"}}});

var xhr = new XMLHttpRequest();
var dataReady = false;
var unitTypes = [];
var units = [];

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
		console.log(unitTypes);
		console.log(units);
		dataReady = true;
	}
});

// Request data
xhr.open("POST", "https://matrixresidential.entrata.com/api/v1/propertyunits");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Authorization", "Basic ZnJlZF9hZ2VuY3lfYXBpQG1hdHJpeHJlc2lkZW50aWFsOkZyZWQxMzAyMDIwKg==");

xhr.send(data);