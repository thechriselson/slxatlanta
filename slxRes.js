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
						units[j].push([unitAttrs.UnitNumber, floorNum, unitObj.Rent["@attributes"].MinRent.split(".")[0], ]);
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

///////////////////
// Interactivity //
///////////////////

const galDiv = document.querySelector(".res-gal-div");
const galArr = document.getElementsByClassName("res-gal-col-item");
const lstDiv = document.querySelector(".res-lst-div");
const lstArr = document.getElementsByClassName("res-lst-col-item");
const lstSldr = document.querySelector(".res-lst-col-wrap");

// Filter selectors, [0]=Bed [1]=Floor [2]=Price [3]=MoveDate
const fltrArr = [document.getElementById("filterBed"), document.getElementById("filterFloor"), document.getElementById("filterPrice")]; // Add move-in-date
const actvFltrs = [4];

// Upgrade to filter activated
const g2LTrgr = document.getElementById("resG2LTrigger");

var lstView = false;
var detView = false;
var galNum = 0;
var galMaxH = "";
var currentSld = 0;

function computeGalMaxH() {
	if(galArr.length%2 != 0) {galNum = galArr.length + 1}
	else {galNum = galArr.length}
	let galImgH = Number(getComputedStyle(galArr[0]).height.replace(/[^\d\.\-]/g, ''));
	galMaxH = "" + (galNum * galImgH / 32 + galNum) + "rem";
	galDiv.style.maxHeight = galMaxH;
}

function filterCheck(item, attrs) {
	for(let i = 1; i < attrs.length; i++) {
		if(dataReady = true) {
			let checkArr = [];
			for(let j = 0; j < attrs[i].length; j++) {
				if(attrs[i][j] == Number(actvFltrs[i-1])) {checkArr.push(false)}
				else {checkArr.push(true)}
			}
			console.log(checkArr);
			if(checkArr.includes(true)) {item.dataset.filter = "true"}
			else {item.dataset.filter = "false"}
			console.log(item.dataset.filter);
		}
		else {
			if(attrs[i] == Number(actvFltrs[i-1])) {item.dataset.filter = "false"}
			else {item.dataset.filter = "true"; break}
		}
	}
	if(item.dataset.filter == "true") {lstItem(item, 0)}
	else {lstItem(item, 1)}
}

function filter() {
	for(let i = 0; i < lstArr.length; i++) {
		let tempData = lstArr[i].querySelector(".res-lst-data").dataset;
		let tempAttrs = [tempData.name.toUpperCase(), [Number(tempData.beds)]];
		if(dataReady == true) {
			// Match current lstArr[i] to correct unitType[j] + filterCheck() 
			for(let j = 0; j < unitTypes.length; j++) {
				if(unitTypes[j][0][0] == tempData.name.toUpperCase()) {filterCheck(lstArr[i], unitTypes[j])}
			}
		}
		else {filterCheck(lstArr[i], tempAttrs)}
	}
}

function opacity0(element) {
	element.style.opacity = "0";
	element.style.filter = "alpha(opacity=0)";
}

function opacity1(element) {
	element.style.opacity = "1";
	element.style.filter = "alpha(opacity=100)";
}

function lstItem(item, x) {
	console.log(item);
	let contentCon = item.querySelector(".res-lst-content-con");
	let thmbImg = item.querySelector(".res-lst-thumb-div");
	let expDiv = item.querySelector(".res-lst-expand-div");
	let buffers = item.querySelectorAll(".res-lst-overview-buffer");
	let arrowL = item.querySelector(".res-lst-arrow-left");
	let arrowR = item.querySelector(".res-lst-arrow-right");
	if(x == 0) {lstItemMin(item, contentCon, thmbImg, expDiv, buffers, arrowL, arrowR)}
	else if(x == 1) {lstItemThmb(item, contentCon, thmbImg, expDiv, buffers, arrowL, arrowR)}
	else if(x == 2) {lstItemExp(item, contentCon, thmbImg, expDiv, buffers, arrowL, arrowR)}
}

function lstItemMin(item, contentCon, thmbImg, expDiv, buffers, arrowL, arrowR) {
	// Fade out
	opacity0(item);
	// Minimise
	setTimeout(function() {
		item.style.maxHeight = "0rem";
		contentCon.style.maxHeight = "0rem";
		item.style.borderBottomWidth = "0rem";
	}, 200);
}

function lstItemThmb(item, contentCon, thmbImg, expDiv, buffers, arrowL, arrowR) {
	item.style.maxHeight = "12rem";
	contentCon.style.maxHeight = "0rem";
	item.style.borderBottomWidth = "0.125rem";
	setTimeout(function() {
		opacity1(item);
	}, 400);
}

function lstItemExp(item, contentCon, thmbImg, expDiv, buffers, arrowL, arrowR) {
	item.style.cursor = "auto";
	// Fade out elements
	opacity0(thmbImg);
	opacity0(expDiv);
	// Resize elements
	setTimeout(function() {
		buffers[0].style.display = "block"; buffers[1].style.display = "block";
		buffers[0].style.width = "2rem"; buffers[1].style.width = "2rem";
		thmbImg.style.height = "0rem"; thmbImg.style.width = "0rem";
		expDiv.style.height = "0rem";
	}, 200);
	// Fade in arrows
	setTimeout(function() {
		arrowL.style.display = "block"; arrowR.style.display = "block";
		opacity1(arrowL); opacity1(arrowR);
	}, 400);
	// Expand
	setTimeout(function() {
		item.style.maxHeight = "75rem";
		contentCon.style.maxHeight = "60rem";
		item.style.borderBottomWidth = "0.125rem";
	}, 600);
	// Fade in
	setTimeout(function() {
		opacity1(item);
		opacity1(contentCon);
	}, 1000);
}

function changeSlide() {
	lstSldr.style.transform = "translateX(-" + currentSld * 100 + "%)";
}

for(let i = 0; i < fltrArr.length; i++) {
	fltrArr[i].addEventListener('change', function() {
		actvFltrs[i] = fltrArr[i].value;
		filter();
	})
}

g2LTrgr.addEventListener('click', function() {
	if(lstView == false) {
		lstDiv.style.maxHeight = "" + lstArr.length * 12 + "rem";
		setTimeout(function() {
			galDiv.style.maxHeight = "0rem";
		}, 600);
		lstView = true;
	}
	else {
		galDiv.style.maxHeight = galMaxH;
		setTimeout(function() {
			lstDiv.style.maxHeight = "0rem";
		}, 600);
		lstView = false;
	}
});

for(let i = 0; i < lstArr.length; i++) {
	lstArr[i].addEventListener('click', function() {
		if(detView == false) {
			for(let j = 0; j < lstArr.length; j++) {
				if(lstArr[j] != lstArr[i]) {lstItem(lstArr[j], 0)}
				else {lstItem(lstArr[j], 2)}
			}
			currentSld = i;
			// Change list's flexDirection to horizontal + re-expand list items to full
			let lstColList = document.querySelector(".res-lst-col-list");
			setTimeout(function() {
				lstColList.style.flexDirection = "row";
				lstColList.style.WebkitFlexDirection = "row"; // For Safari
				changeSlide();
				for(let k = 0; k < lstArr.length; k++) {
					lstItem(lstArr[k], 2);
				}
			detView = true;
			}, 1000);
		}
	});
	lstArr[i].querySelector(".res-lst-arrow-left").addEventListener('click', function() {
		currentSld = currentSld - 1;
		changeSlide();
	});
	lstArr[i].querySelector(".res-lst-arrow-right").addEventListener('click', function() {
		currentSld = currentSld + 1;
		changeSlide();
	});
}

window.addEventListener('resize', function() {
	computeGalMaxH();
});

computeGalMaxH();