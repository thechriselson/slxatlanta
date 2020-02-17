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
	// [0] = contentCon, [1] = thmbImg, [2] = expDiv, [3] = buffers[], [4] = arrows[]
	let els = [item.querySelector(".res-lst-content-con"), item.querySelector(".res-lst-thumb-div"), item.querySelector(".res-lst-expand-div"), item.querySelectorAll(".res-lst-overview-buffer"), [item.querySelector(".res-lst-arrow-left"), item.querySelector(".res-lst-arrow-right")]];
	let s = item.querySelector(".res-lst-data").dataset.state;
	if(s == 0) {if(x == 1) {lstItemThmb(item, els)} else if(x == 2) {lstItemExp(item, els)}}
	else if(s == 1) {if(x == 0) {lstItemMin(item, els)} else if(x == 2) {lstItemExp(item, els)}}
	else if(s == 2) {if(x == 0) {lstItemMin(item, els)} else if(x == 1) {lstItemThmb(item, els)}}
}

function lstItemMin(item, els) {
	item.querySelector(".res-lst-data").dataset.state = 0;
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
	item.querySelector(".res-lst-data").dataset.state = 1;
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
	item.querySelector(".res-lst-data").dataset.state = 2;
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
		item.style.maxHeight = "75rem"; els[0].style.maxHeight = "60rem";
		item.style.borderBottomWidth = "0.125rem";
	}, 200);
	// Fade in
	setTimeout(function() {
		els[4][0].style.display = "block"; els[4][1].style.display = "block";
		opacity1(els[4][0]); opacity1(els[4][1]);
		opacity1(item); opacity1(els[0]);
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
			}, 800);
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