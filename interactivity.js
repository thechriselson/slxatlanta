///////////////////
// Interactivity //
///////////////////

const contDiv = document.querySelector(".res-content-div");
const galDiv = document.querySelector(".res-gal-div");
const galArr = document.getElementsByClassName("res-gal-col-item");
const lstDiv = document.querySelector(".res-lst-div");
const lstArr = document.getElementsByClassName("res-lst-col-item");
const lstColList = document.querySelector(".res-lst-col-list");
const lstSldr = document.querySelector(".res-lst-col-wrap");

// Sitemap layers
//const sitemaps = document.getElementsByClassName("");
const sitemapLayers = document.getElementsByClassName("res-map-col-item");

// Filter datepicker
const picker = datepicker("#filterDate", {
	onSelect: (instance, date) => {
		// Convert date input to MM/DD/yyyy
		let year = date.getFullYear();
		let month = (1 + date.getMonth()).toString();
		if(month.length == 1) {month = "0" + month}
		let day = date.getDate().toString();
		if(day.length == 1) {day = "0" + day}
		// Add selected date to actvFltrs[]
		actvFltrs[3] = month + "/" + day + "/" + year
	}
});

// Filter selectors, [0]=Bed [1]=Floor [2]=Price [3]=MoveDate
const fltrArr = [document.getElementById("filterBed"), document.getElementById("filterFloor"), document.getElementById("filterPrice"), document.getElementById("filterDate")];
var actvFltrs = [];

console.log(fltrArr);

// Switcher
const switcher = document.querySelector(".res-fltr-all-div");

// Current vars
var curVu = 0; // View: 0 = Gallery, 1 = List
var curSt = 0; // State: 0 = List, 1 = Detail
var curIt = 0; // Item

var galNum = 0;
var galMaxH = "";
var lstMaxH = "150rem";

function updateMaxH() {
	computeGalMaxH();
	computeLstMaxH();
}

function changeSlide() {
	if(curIt < 0) {curIt = 1; return}
	if(curIt == lstArr.length) {curIt = lstArr.length - 1; return}
	// Shrink other items + expand newItem if needed + slide
	for(let i = 0; i < lstArr.length; i++) {
		if(lstArr[i] != lstArr[curIt]) {lstItem(lstArr[i], 0)}
		else {lstItem(lstArr[i], 2)}
	}
	lstSldr.style.transform = "translateX(-" + curIt * 100 + "%)";
	// Recalculate lstMaxH + expand all with lstMaxH
	setTimeout(function() {
		lstMaxH = "" + (Number(getComputedStyle(lstArr[curIt]).height.replace(/[^\d\.-]/g, '')) / 16) + "rem";
		lstDiv.style.maxHeight = lstMaxH;
		for(let i = 0; i < lstArr.length; i++) {lstItem(lstArr[i], 2, 1)}
	}, 800);
}

function opacity0(element) {
	element.style.opacity = "0";
	element.style.filter = "alpha(opacity=0)";
}

function opacity1(element) {
	element.style.opacity = "1";
	element.style.filter = "alpha(opacity=100)";
}

function lstItemMin(item, els) {
	item.style.cursor = "none";
	// Fade out
	opacity0(els[0]); opacity0(item);
	// Resize
	setTimeout(function() {
		// Shrink
		els[0].style.maxHeight = "0rem"; item.style.maxHeight = "0rem";
		item.style.borderBottomWidth = "0rem";
	}, 200);
}

function lstItemThmb(item, els) {
	// Fade out
	opacity0(els[0]); opacity0(els[4][0]); opacity0(els[4][1]);
	// Resize
	setTimeout(function() {
		els[4][0].style.display = "none"; els[4][1].style.display = "none";
		// Shrink
		els[0].style.maxHeight = "0rem";
		els[3][0].style.width = "0rem"; els[3][1].style.width = "0rem";
		// Expand
		item.style.maxHeight = "12rem"; item.style.borderBottomWidth = "0.125rem";
		els[1].style.height = "10rem"; els[1].style.width = "10rem";
		els[2].style.height = "2.125rem";
	}, 200);
	// Fade in
	setTimeout(function() {
		els[3][0].style.display = "none"; els[3][1].style.display = "none";
		opacity1(item); opacity1(els[1]); opacity1(els[2]);
	}, 600);
	item.style.cursor = "pointer";
}

function lstItemExp(item, els, mxh) {
	item.style.cursor = "auto";
	// Fade out
	opacity0(els[1]); opacity0(els[2]);
	// Resize
	setTimeout(function() {
		// Shrink
		els[3][0].style.display = "block"; els[3][1].style.display = "block";
		els[3][0].style.width = "2rem"; els[3][1].style.width = "2rem";
		els[1].style.height = "0rem"; els[1].style.width = "0rem";
		els[2].style.height = "0rem";
		// Expand
		item.style.maxHeight = mxh; els[0].style.maxHeight = mxh;
		item.style.borderBottomWidth = "0.125rem";
	}, 200);
	// Fade in
	setTimeout(function() {
		els[4][0].style.display = "block"; els[4][1].style.display = "block";
		opacity1(els[4][0]); opacity1(els[4][1]);
		opacity1(item); opacity1(els[0]);
	}, 600);
}

function lstItem(item, x, y) {
	// x: 0 = lstItemMin, 1 = lstItemThmb, 2 = lstItemExp
	// y: 0 = default mxh, 1 = lstMaxH
	// els: [0] = contentCon, [1] = thmbImg, [2] = expDiv, [3] = buffers[], [4] = arrows[]
	let els = [item.querySelector(".res-lst-content-con"), item.querySelector(".res-lst-thumb-div"), item.querySelector(".res-lst-expand-div"), item.querySelectorAll(".res-lst-overview-buffer"), [item.querySelector(".res-lst-arrow-left"), item.querySelector(".res-lst-arrow-right")]];
	let mxh = "150rem"; if(y == 1) {mxh = lstMaxH}
	if(x == 0) {lstItemMin(item, els)}
	else if(x == 1) {lstItemThmb(item, els)}
	else if(x == 2) {lstItemExp(item, els, mxh)}
}

/*function filterCheck(item, attrs, aptAttrs) {
	// If API data is ready, check against unitTypes[]
	if(dataReady == true) {
		let checkArr = [[], [], [], []];
		for(let i = 1; i < attrs.length; i++) {
			if(attrs[i].length == 0 || actvFltrs[i-1] == undefined || actvFltrs[i-1].length == 0) {checkArr[i-1].push(false); continue}
			let actvFltr = Number(actvFltrs[i-1]);
			for(let j = 0; j < attrs[i].length; j ++) {
				if(attrs[i][j] != actvFltr) {checkArr[i-1].push(true)}
				else {checkArr[i-1].push(false)}
			}
		}
		// Check against actvFltr[3] (move-in-date)
		for(let i = 0; i < checkArr.length; i++) {
			if(!checkArr[i].includes(false)) {item.dataset.filter = "true"; break}
			else {item.dataset.filter = "false"}
		}
	}
	// If API data isn't ready, check against tempAttrs[]
	else {
		for(let i = 1; i < attrs.length; i++) {
			let actvFltr = Number(actvFltrs[i-1]);
			if(attrs[i] != actvFltr) {item.dataset.filter = "true"; break}
			else {item.dataset.filter = "false"}
		}
	}
	// Set list item state based on data-filter value
	if(item.dataset.filter == "true") {lstItem(item, 0)}
	else {lstItem(item, 1)}
}*/

function filterCheck(item, unitType, units, apts) {
	if(dataReady == true) {
		let aptVis = [];
		// For each unit of unitType
		for(let i = 0; i < units.length; i++) {
			// #beds
			if(Number(actvFltrs[0] != unitType[1])) {aptVis[i] = false; break}
			// Floor#
			if(Number(actvFltrs[1]) != units[i][1]) {aptVis[i] = false; break}
			// Price range
			let hidden = false;
			for(let j = 0; j < 2; j++) {if(Number(actvFltrs[2][j]) != units[i][3][j]) {hidden = true}}
			if(hidden == true) {aptVis[i] = false; break}
			// Move-in-date
			let fltrDate = actvFltrs[3].split("/");
			let avaiDate = units[i][2].split("/");
			// Year
			if(Number(fltrDate[2]) > Number(avaiDate[2])) {aptVis[i] = false; break}
			else if(Number(fltrDate[2]) < Number(avaiDate[2])) {}
			// Month
			else if(Number(fltrDate[0]) > Number(avaiDate[0])) {aptVis[i] = false; break}
			else if(Number(fltrDate[0]) < Number(avaiDate[0])) {}
			// Day
			else if(Number(fltrDate[1]) > Number(avaiDate[1])) {aptVis[i] = false; break}
			// If unit passes all filters
			aptVis[i] = true
		}
		// Minimise or expand each apts[]
		for(let i = 0; i < aptVis.length; i++) {
			console.log(aptVis[i]);
			if(aptVis[i] == false) {/* minimise apts[i] */}
			else {/* expand apts[i] */}
		}
		if(!aptVis.includes(true)) {item.dataset.filter = "true"}
		else {item.dataset.filter = "false"}
	}
	else {
		// #beds
		if(Number(actvFltrs[0]) != unitType[1]) {item.dataset.filter = "true"}
		else {item.dataset.filter = "false"}
	}
	// Minimise or expand list item
	if(item.dataset.filter == "true") {lstItem(item, 0)}
	else {lstItem(item, 1)}
}

function filter() {
	let x = 0;
	if(curVu == 0) {x = 600; switchView()}
	if(curSt == 1) {x = 800; switchState()}
	setTimeout(function() {
		for(let i = 0; i < lstArr.length; i++) {
			let tempData = lstArr[i].querySelector(".res-lst-data").dataset;
			let tempAttrs = [tempData.name.toUpperCase(), [Number(tempData.beds)]];
			if(dataReady == true) {
				// Match current lstArr[i] to correct unitType[j] + filterCheck()
				for(let j = 0; j < unitTypes.length; j++) {
					if(unitTypes[j][0][0] == tempData.name.toUpperCase()) {filterCheck(lstArr[i], unitTypes[j], units[j], apts[j])}
				}
			}
			else {filterCheck(lstArr[i], tempAttrs)}
		}
	}, x)
}

function switchState() {
	// curSt: 0 = List, 1 = Detail
	let cs = 1; let dir = "row"; if(curSt == 1) {cs = 0; dir = "column"}
	curSt = cs;
	// Collapse
	for(let i = 0; i < lstArr.length; i++) {
		if(lstArr[i] != lstArr[curIt]) {lstItem(lstArr[i], 0)}
		else if(curSt == 0) {lstItem(lstArr[i], 0)}
		else {lstItem(lstArr[i], 2)}
	}
	// Reorientate + rebuild
	setTimeout(function() {
		lstColList.style.flexDirection = dir; lstColList.style.WebkitFlexDirection = dir;
		lstSldr.style.transition = "transform 0ms";
		if(curSt == 0) {
			lstDiv.style.maxHeight = "" + lstArr.length * 12 + "rem";
			lstSldr.style.transform = "translateX(0%)";
			for(let j = 0; j < lstArr.length; j++) {lstItem(lstArr[j], 1)}
		}
		else {changeSlide()}
		setTimeout(function() {lstSldr.style.transition = "transform 600ms"}, 200)
	}, 800);
}

function switchView() {
	let txt = switcher.querySelector(".res-fltr-all-txt");
	// Gallery to List
	if(curVu == 0) {
		curVu = 1;
		contDiv.style.transform = "translateX(-100%)";
		// Gallery
		galMaxH = "0rem";
		// List
		if(curSt == 0) {lstDiv.style.maxHeight = "" + lstArr.length * 12 + "rem"}
		else {lstDiv.style.maxHeight = lstMaxH}
		// Switcher
		opacity0(txt); setTimeout(function() {txt.innerText = "View Gallery"; opacity1(txt)}, 400);
	}
	// List to Gallery
	else {
		curVu = 0;
		contDiv.style.transform = "translateX(0%)";
		// Gallery
		if(galArr.length%2 != 0) {galNum = galArr.length + 1}
		else {galNum = galArr.length}
		let galImgH = Number(getComputedStyle(galArr[0]).height.replace(/[^\d\.\-]/g, ''));
		galMaxH = "" + (galNum * galImgH / 32 + galNum) + "rem";
		// List
		lstDiv.style.maxHeight = "0rem";
		// Switcher
		opacity0(txt); setTimeout(function() {txt.innerText = "View All"; opacity1(txt)}, 400);
	}
	galDiv.style.maxHeight = galMaxH;
}

// View all
switcher.addEventListener('click', switchView);

// Filter reset
document.querySelector(".res-fltr-reset-div").addEventListener('click', function() {
	// Reset filter selectors
	for(let i = 0; i < fltrArr.length; i++) {fltrArr[i].selectedIndex = 0}
	// Remove all actvFltrs[]
	actvFltrs = [];
	//for(let i = 0; i < actvFltrs.length; i++) {actvFltrs[i] = undefined}
	filter();
});

// Filter selectors
for(let i = 0; i < fltrArr.length - 1; i++) {
	fltrArr[i].addEventListener('change', function() {
		console.log(fltrArr[i].value);
		actvFltrs[i] = fltrArr[i].value;
		console.log(actvFltrs);
		filter();
	})
}

// List items
for(let i = 0; i < lstArr.length; i++) {
	// When clicked in list view
	lstArr[i].addEventListener('click', function() {if(curSt == 0) {curIt = i; switchState()}});
	// Arrows
	lstArr[i].querySelector(".res-lst-arrow-left").addEventListener('click', function() {curIt = curIt - 1; changeSlide()});
	lstArr[i].querySelector(".res-lst-arrow-right").addEventListener('click', function() {curIt = curIt + 1; changeSlide()});
}

//window.addEventListener('resize', updateMaxH);
for(let i = 1; i < fltrArr.length; i++) {fltrArr[i].disabled = true}