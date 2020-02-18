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

// Filter selectors, [0]=Bed [1]=Floor [2]=Price [3]=MoveDate
const fltrArr = [document.getElementById("filterBed"), document.getElementById("filterFloor"), document.getElementById("filterPrice")]; // Add move-in-date
const actvFltrs = [];

// OLD - Upgrade to filter activated
const svTrigger = document.getElementById("resG2LTrigger");

// 0 = Gallery, 1 = List, 2 = Detail
var currentView = 0;
var currentState = 0;
var galNum = 0;
var galMaxH = "";
var lstMaxH = "0rem";
var currentItem = 0;

function computeGalMaxH() {
	if(currentView == 0) {
		if(galArr.length%2 != 0) {galNum = galArr.length + 1}
		else {galNum = galArr.length}
		let galImgH = Number(getComputedStyle(galArr[0]).height.replace(/[^\d\.\-]/g, ''));
		galMaxH = "" + (galNum * galImgH / 32 + galNum) + "rem";
	}
	else {galMaxH = "0rem"}
	galDiv.style.maxHeight = galMaxH;
}

function computeLstMaxH() {
	if(currentView == 0) {lstMaxH = "0rem"; console.log("Gallery view")}
	else {
		if(currentState == 1) {lstMaxH = "" + (Number(getComputedStyle(lstArr[currentItem]).height.replace(/[^\d\.-]/g, '')) / 16) + "rem"; console.log("Detail view")}
		else {
			let fltrdLength = 0;
			for(let i = 0; i < lstArr.length; i++) {if(lstArr[i].style.maxHeight != "0rem") {fltrdLength++}}
			lstMaxH = "" + fltrdLength * 12 + "rem";
			console.log("List view")
		}
	}
	console.log("lstMaxH = " + lstMaxH);
	lstDiv.style.maxHeight = lstMaxH;
}

function updateMaxH() {computeGalMaxH(); computeLstMaxH()}

function changeSlide(old) {
	lstItem(lstArr[currentItem], 2);
	lstSldr.style.transform = "translateX(-" + currentItem * 100 + "%)";
	if(typeof old !== "undefined") {setTimeout(function() {lstItem(lstArr[old], 0)}, 600)}
	computeLstMaxH();
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

function lstItemExp(item, els) {
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
		item.style.maxHeight = "101rem"; els[0].style.maxHeight = "102rem";
		item.style.borderBottomWidth = "0.125rem";
	}, 200);
	// Fade in
	setTimeout(function() {
		els[4][0].style.display = "block"; els[4][1].style.display = "block";
		opacity1(els[4][0]); opacity1(els[4][1]);
		opacity1(item); opacity1(els[0]);
	}, 600);
}

function lstItem(item, x) {
	// [0] = contentCon, [1] = thmbImg, [2] = expDiv, [3] = buffers[], [4] = arrows[]
	let els = [item.querySelector(".res-lst-content-con"), item.querySelector(".res-lst-thumb-div"), item.querySelector(".res-lst-expand-div"), item.querySelectorAll(".res-lst-overview-buffer"), [item.querySelector(".res-lst-arrow-left"), item.querySelector(".res-lst-arrow-right")]];
	let mxh = {}; if(currentItem != 0) {mxh = getComputedStyle(lstArr[currentItem]).height}
	if(x == 0) {lstItemMin(item, els)}
	else if(x == 1) {lstItemThmb(item, els)}
	else if(x == 2) {lstItemExp(item, els, mxh)}
}

function filterCheck(item, attrs, aptAttrs) {
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
}

function filter() {
	for(let i = 0; i < lstArr.length; i++) {
		let tempData = lstArr[i].querySelector(".res-lst-data").dataset;
		let tempAttrs = [tempData.name.toUpperCase(), [Number(tempData.beds)]];
		if(dataReady == true) {
			// Match current lstArr[i] to correct unitType[j] + filterCheck() 
			for(let j = 0; j < unitTypes.length; j++) {
				if(unitTypes[j][0][0] == tempData.name.toUpperCase()) {filterCheck(lstArr[i], unitTypes[j], units[j])}
			}
		}
		else {filterCheck(lstArr[i], tempAttrs)}
	}
}

function switchState() {
	// Default values for list to detail
	let cs = 1; let dir = "row"; let delay = 800;
	// Change values if detail to list
	if(currentState == 1) {dir = "column"; delay = 600; cs = 0}

	currentState = cs;
	// toDetail
	for(let i = 0; i < lstArr.length; i++) {
		if(lstArr[i] != lstArr[currentItem]) {lstItem(lstArr[i], 0); setTimeout(function() {lstItem(lstArr[i], 2)}, 800)}
		else {lstItem(lstArr[i], 2)}
	}
	setTimeout(function() {
		lstColList.style.flexDirection = dir; lstColList.style.WebkitFlexDirection = dir;
		lstArr[currentItem].style.transition = "transform 0ms";
		changeSlide();
		lstArr[currentItem].style.transition = "transform 600ms";
	}, 800);
}

function switchView() {
	if(currentView == 0) {currentView = 1; contDiv.style.transform = "translateX(-100%)"}
	else {currentView = 0; contDiv.style.transform = "translateX(0%)"}
	updateMaxH()
}

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
for(let i = 0; i < fltrArr.length; i++) {
	fltrArr[i].addEventListener('change', function() {
		actvFltrs[i] = fltrArr[i].value;
		filter();
	})
}

// List items
for(let i = 0; i < lstArr.length; i++) {
	// When clicked in list view
	lstArr[i].addEventListener('click', function() {if(currentState == 0) {currentItem = i; switchState()}});
	// Arrows
	lstArr[i].querySelector(".res-lst-arrow-left").addEventListener('click', function() {let old = currentItem; currentItem = currentItem - 1; changeSlide(old)});
	lstArr[i].querySelector(".res-lst-arrow-right").addEventListener('click', function() {let old = currentItem; currentItem = currentItem + 1; changeSlide(old)});
}

// Switch view trigger
svTrigger.addEventListener('click', switchView);

window.addEventListener('resize', updateMaxH);