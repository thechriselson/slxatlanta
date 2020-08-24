// Filters //

const lstDiv = document.querySelector(".res-lst-div");
const lstArr = document.getElementsByClassName("res-lst-col-item");
const lstColList = document.querySelector(".res-lst-col-list");
const lstSldr = document.querySelector(".res-lst-col-wrap");

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
		activeFilters.date = month + "/" + day + "/" + year;
		filter()
	}
});

// Filter selectors, [0]=Bed [1]=Floor [2]=Price [3]=MoveDate
const filterBttns = [
	document.getElementById("filterBed"),
	document.getElementById("filterFloor"),
	document.getElementById("filterPrice"),
	document.getElementById("filterDate")
];
var activeFilters = {beds: false, floor: false, price: false, date: false}

// Deactivate API-based filters
for(let i = 1; i < filterBttns.length; i++) {filterBttns[i].disabled = true}

// Current vars
var curSt = 0; // State: 0 = List, 1 = Detail
var curIt = 0; // Item
var curFloor = 0; // Sitemap FL

var lstMaxH = "225rem";

function changeFloor(i) {
	let x = actvFltrs[1];
	let y = 0; // Default (FL1)
	if(i !== undefined) {x = i} // Passed specific floor
	if(x == undefined || x.length == 0) {}
	else {y = x - 1}
	let z = 0; // Timer delay
	// Hide current floor's units
	if(curFl != y) {opacity0(sitemapConts[curFl]); z = 200}
	// Show all sitemaps[] up until sitemaps[x]
	setTimeout(function() {
		for(let i = 0; i < sitemaps.length; i++) {
			if(i <= y) {opacity1(sitemaps[i])}
			else {opacity0(sitemaps[i])}
		}
	}, z);
	// Show new floor's units + set new curFl
	setTimeout(function() {opacity1(sitemapConts[y]); curFl = y}, z + 200)
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
	let els = [
		item.querySelector(".res-lst-content-con"),
		item.querySelector(".res-lst-thumb-div"),
		item.querySelector(".res-lst-expand-div"),
		item.querySelectorAll(".res-lst-overview-buffer"),
		[item.querySelector(".res-lst-arrow-left"), item.querySelector(".res-lst-arrow-right")]
	];
	let mxh = "225rem"; if(y == 1) {mxh = lstMaxH}
	if(x == 0) {lstItemMin(item, els)}
	else if(x == 1) {lstItemThmb(item, els)}
	else if(x == 2) {lstItemExp(item, els, mxh)}
}

function aptFltr(apt, x) {
	let maxH = "none"; let pad = "0.25rem"; let bord = "0.125rem";
	if(x == 0) {maxH = "0rem"; pad = "0rem"; bord = "0rem"}
	apt.style.maxHeight = maxH;
	apt.style.paddingTop = pad;
	apt.style.paddingBottom = pad;
	apt.style.borderTopWidth = bord;
}

function filter() {
	console.log(activeFilters);
	let results = [];
	let x = 0;
	if(curSt == 1) {x = 800; switchState()}
	setTimeout(() => {
		for(let i = 0; i < units.length; i++) {
			results.push({
				"name": units[i].name,
				"unitsAvailable": 0,
				"apts": []
			});
			for(let j = 0; j < units[i].apts.length; j++) {
				// Compare apt properties to active filters + add to results[]
				let filterPass = true;
				let apt = units[i].apts[j];
				for(const filter in activeFilters) {
					if(activeFilters[filter] === false) {}
					else if(filter == "beds" | filter == "floor") {
						if(activeFilters[filter] != apt[filter]) {filterPass = false}
					}
					else if(filter == "price") {
						let priceArr = activeFilters[filter].split('-');
						let min = Number(priceArr[0]);
						let max = Number(priceArr[1]);
						if(apt[filter] < min | apt[filter] > max) {filterPass = false}
					}
					else if(filter == "date") {
						// Filter date
						let filterDateArr = activeFilters[filter].split('/');
						let filterYear = Number(filterDateArr[2]);
						let filterMonth = Number(filterDateArr[0]);
						let filterDay = Number(filterDateArr[1]);
						// Apt available date
						let aptDateArr = apt[filter].split('/');
						let aptYear = Number(aptDateArr[2]);
						let aptMonth = Number(aptDateArr[0]);
						let aptDay = Number(aptDateArr[1]);
						// Compare
						if(aptYear > filterYear) {filterPass = false}
						else if(filterYear <= aptYear && aptMonth > filterMonth) {filterPass = true}
						else if(filterYear <= aptYear && filterMonth <= aptMonth && aptDay > filterDay) {filterPass = true}
					}
				}
				if(filterPass == true) {
					units[i].apts[j].hidden = false;
					results[i].unitsAvailable++
				}
				else {units[i].apts[j].hidden = true}
				results[i].apts.push({
					"name": apt.name,
					"filterPass": filterPass
				})
			}
		}
		// Update sitemap units
		// Match unitListings[] to results[] + hide/show apts & units
		// Match unit
		for(let i = 0; i < unitListings.length; i++) {
			let unitName = unitListings[i].querySelector('.res-lst-hdng').textContent.toUpperCase();
			console.log(unitName);
			for(let j = 0; j < results.length; j++) {
				if(unitName == results[j].name) {
					// Match apts
					let apts = unitListings[i].querySelectorAll('.res-lst-apt-div');
					console.log(apts);
					for(let k = 0; k < apts.length; k++) {
						let aptName = apts[k].querySelector('.res-lst-apt-txt').textContent;
						console.log(aptName);
						for(let l = 0; l < results[j].apts.length; l++) {
							console.log(results[j].apts.name);
							if(aptName == ("APT " + results[j].apts[l].name + "")) {
								// Show/hide apt
								/*let toggle = false;
								if(!apts[k].classList.contains('hidden') && !results[j].apts[l].filterPass) {toggle = true}
								if(apts[k].classList.contains('hidden') && results[j].apts[l].filterPass) {toggle = true}
								if(toggle) {apts[k].classList.toggle('hidden')}*/
								if(!results[j].apts[l].filterPass) {aptFltr(apts[k], 0)}
								else {aptFltr(apts[k], 1)}
							}
						}
					}
				}
				// Show/hide unit
				/*let unitContH = getComputedStyle(unitListings[i]).height;
				let unitH = getComputedStyle(unitListings[i].querySelector('.res-lst-overview-con')).height;
				if(results[j].unitsAvailable == 0) {
					unitListings[i].style.maxHeight = unitContH;
					setTimeout(() => {unitListings[i].style.maxHeight = "0px"}, 120)
				}
				else {
					setTimeout(() => {
						unitListings[i].style.maxHeight = unitH;
						setTimeout(() => {unitListings[i].style.maxHeight = "none"}, 120)
					}, 120)
				}*/
				if(results[j].unitsAvailable == 0) {lstItem(unitListings[i], 0)}
				else {lstItem(unitListings[i], 1)}
			}
		}
	}, x)
}

function switchState() {
	let txt = document.querySelector(".res-filter-reset-text");
	// curSt: 0 = List, 1 = Detail
	let cs = 1; let dir = "row"; let newTxt = "Back to List";
	if(curSt == 1) {cs = 0; dir = "column"; newTxt = "Reset Filters"}
	curSt = cs;
	// Collapse
	for(let i = 0; i < lstArr.length; i++) {
		if(lstArr[i] != lstArr[curIt]) {lstItem(lstArr[i], 0)}
		else if(curSt == 0) {lstItem(lstArr[i], 1)}
		else {lstItem(lstArr[i], 2)}
	}
	opacity0(txt);
	// Reorientate + rebuild
	setTimeout(function() {
		lstColList.style.flexDirection = dir; lstColList.style.WebkitFlexDirection = dir;
		lstSldr.style.transition = "transform 0ms";
		if(curSt == 0) {
			lstDiv.style.maxHeight = "" + lstArr.length * 12 + "rem";
			lstSldr.style.transform = "translateX(0%)";
		}
		else {changeSlide()}
		setTimeout(function() {lstSldr.style.transition = "transform 600ms"}, 200);
		txt.innerText = newTxt; opacity1(txt)
	}, 800);
}

// Filter reset button
document.querySelector('.res-fltr-reset-div').addEventListener('click', () => {
	if(curSt == 0) {
		// Reset filter buttons
		for(let i = 0; i < filterBttns.length - 1; i++) {filterBttns[i].selectedIndex = 0}
		filterBttns[3].value = "";
		// Remove all active filters
		for(const filter in activeFilters) {activeFilters[filter] = false}
	}
	filter()
})

// Filter buttons
for(let i = 0; i < filterBttns.length - 1; i++) {
	filterBttns[i].addEventListener('change', () => {
		activeFilters[filterBttns[i].dataset.filter] = filterBttns[i].value;
		filter()
	})
}

// List items
for(let i = 0; i < lstArr.length; i++) {
	// When clicked in list view
	lstArr[i].addEventListener('click', () => {if(curSt == 0) {curIt = i; switchState()}});
	// Arrows
	lstArr[i].querySelector(".res-lst-arrow-left").addEventListener('click', () => {curIt = curIt - 1; changeSlide()});
	lstArr[i].querySelector(".res-lst-arrow-right").addEventListener('click', () => {curIt = curIt + 1; changeSlide()});
}

window.addEventListener('resize', () => {if(curSt == 1) {changeSlide()}});