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
const actvFltrs = [];

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

function filterCheck(item, attrs, aptAttrs) {
	// If API data is ready, check against unitTypes[]
	if(dataReady == true) {
		console.log(attrs); console.log(aptAttrs);
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

function opacity0(element) {
	element.style.opacity = "0";
	element.style.filter = "alpha(opacity=0)";
}

function opacity1(element) {
	element.style.opacity = "1";
	element.style.filter = "alpha(opacity=100)";
}

function lstItem(item, x) {
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
	opacity0(thmbImg); opacity0(expDiv);
	// Resize elements
	setTimeout(function() {
		// Shrink thumbnail elements
		buffers[0].style.display = "block"; buffers[1].style.display = "block";
		buffers[0].style.width = "2rem"; buffers[1].style.width = "2rem";
		thmbImg.style.height = "0rem"; thmbImg.style.width = "0rem";
		expDiv.style.height = "0rem";
		// Expand content elements
		item.style.maxHeight = "75rem"; contentCon.style.maxHeight = "60rem";
		item.style.borderBottomWidth = "0.125rem";
	}, 200);
	// Fade in elements
	setTimeout(function() {
		// Arrows
		arrowL.style.display = "block"; arrowR.style.display = "block";
		opacity1(arrowL); opacity1(arrowR);
		// Content
		opacity1(item); opacity1(contentCon);
	}, 600);
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