////////////////////
// Section Scroll //
////////////////////

const heroOverlay = document.getElementById("heroOverlay");
const scrollBgArray = document.getElementsByClassName("sl-bg-cont");
const scrollTextArray = document.getElementsByClassName("scroll-section");
const sectionLinks = document.getElementsByClassName("sl-s-links-col-item");

var time = 0;
const wait = 1500;
var currentSection = 0; // Changed from 1 to account for hero overlay
if(heroOverlay == undefined) {currentSection = 1;}
const totalSections = scrollBgArray.length;

const navLogoWhite = "https://uploads-ssl.webflow.com/5e0cc5b73f3d9576faa5719a/5e0dce01847323e825e25456_slx_logo_white.svg";
const navLogoBlack = "https://uploads-ssl.webflow.com/5e0cc5b73f3d9576faa5719a/5e13505b48d7ea6c5cea76c1_slx_logo_black.svg";
const navLogoMobWhite = "https://uploads-ssl.webflow.com/5e0cc5b73f3d9576faa5719a/5e176d87e85f696eba2f2592_slxLogo_lndscp_white.svg";
const navLogoMobBlack = "https://uploads-ssl.webflow.com/5e0cc5b73f3d9576faa5719a/5e17acb29c4376acbc2400b5_slxLogo_lndscp_black.svg";
const navMenu = document.getElementById("navbarLinksDiv");
const navLogo = document.getElementById("navLogo");
const navLogoMob = document.getElementById("navLogoMob");
const navLinkArray = document.getElementsByClassName("navbar-link");
const navLinkCurrent = document.querySelector(".navbar-link.w--current");
const navMenuIconArray = document.getElementsByClassName("icon-bar");

trueFalse = false;

function colorChange() {
	var cs = currentSection - 1; // - 1 to correlate with array starting at 0
	if(cs == -1) {cs = 0;}
	// Change navLink colors
	if(scrollBgArray[cs].querySelector(".sl-bg-embed").dataset.navcolor) {
		const navColor = scrollBgArray[cs].querySelector(".sl-bg-embed").dataset.navcolor;
		const sectionStyle = getComputedStyle(scrollBgArray[cs]);
		// Change navMenu's bg color based on the current section: to black if transparent bg or to match section's bg
		if(window.matchMedia("(max-width: 991px)").matches) {
			if(sectionStyle.backgroundColor == "rgba(0, 0, 0, 0)") {navMenu.style.backgroundColor = "black";}
			else {navMenu.style.backgroundColor = sectionStyle.backgroundColor;}
		}
		// Change each navLink to current navColor
		for(var i = 0; i < navLinkArray.length; i++) {navLinkArray[i].style.color = navColor;}
		// Change navLogo images to associated color version
		if(navColor == "black" || navColor == "Black") {
			navLogo.src = navLogoBlack;
			navLogoMob.src = navLogoMobBlack;
		}
		else if(navColor == "white" || navColor == "White") {
			navLogo.src = navLogoWhite;
			navLogoMob.src = navLogoMobWhite;
		}
		// Change navMenuIcon color
		for(var j = 0; j < navMenuIconArray.length; j++) {navMenuIconArray[j].style.backgroundColor = navColor;}
	}
}

function overlayFadeout() {
	heroOverlay.style.opacity = "0";
	heroOverlay.style.filter = "alpha(opacity=0)"; // For IE
	setTimeout(function() {
		heroOverlay.style.display = "none"
	}, 750)
}

function overlayFadein() {
	heroOverlay.style.display = "flex";
	setTimeout(function() {
		heroOverlay.style.opacity = "1";
		heroOverlay.style.filter = "alpha(opacity=100)"; // For IE
		currentSection = 0;
	}, 100)
}

function scrollSectionDown() {
	for(var i = 0; i < scrollBgArray.length; i++) {
		scrollBgArray[i].style.transform = "translateY(" + currentSection * -100 + "%)";
	}
	if(scrollTextArray[0] != undefined) {
		for(var j = 0; j < scrollTextArray.length; j++) {
			scrollTextArray[j].style.transform = "translateY(" + currentSection * -100 + "%)";
		}
	}
	currentSection = currentSection + 1;
	colorChange();
}

function scrollSectionUp() {
	for(var i = 0; i < scrollBgArray.length; i++) {
		scrollBgArray[i].style.transform = "translateY(" + (currentSection - 2) * -100 + "%)";
	}
	if(scrollTextArray[0] != undefined) {
		for(var j = 0; j < scrollTextArray.length; j++) {
			scrollTextArray[j].style.transform = "translateY(" + (currentSection - 2) * -100 + "%)";
		}
	}
	currentSection = currentSection - 1;
	colorChange();
}

function scrollEventDown() {
	if(currentSection == 0) {
		heroOverlay.style.opacity = "0";
		heroOverlay.style.filter = "alpha(opacity=0)"; // For IE
		setTimeout(function() {
			heroOverlay.style.display = "none"
		}, 750);
		//overlayFadeout();
		currentSection = 1;
	}
	else if(currentSection < totalSections) {
		scrollSectionDown();
	}
}

function scrollEventUp() {
	if(currentSection == 1 && heroOverlay != undefined) {
		heroOverlay.style.display = "flex";
		setTimeout(function() {
			heroOverlay.style.opacity = "1";
			heroOverlay.style.filter = "alpha(opacity=100)"; // For IE
			currentSection = 0;
		}, 100)
		//overlayFadein()
	}
	else if(currentSection > 1) {
		scrollSectionUp();
	}
}

function wheelEvent(event) {
	if((time + wait - Date.now()) < 0) {
		if(event.deltaY > 0) {scrollEventDown();}
		else if(event.deltaY < 0) {scrollEventUp();}
		time = Date.now();
	}
}

function keyEvent (event) {
	if(event.keyCode == "40") {scrollEventDown();}
	else if(event.keyCode == "38") {scrollEventUp();}
}

function swipeEvent(el, callback) {

	var touchSurface = el,
	swipeDir,
	startY,
	distY,
	threshold = 50, // min distance travelled to be considered a swipe
	allowedTime = 300, // max time allowed to travel a distance
	elapsedTime,
	startTime,
	handleSwipe = callback || function(swipeDir) {}

	touchSurface.addEventListener('touchstart', function(e) {
		var touchObj = e.changedTouches[0]
		swipeDir = "none"
		dist = 0
		startY = touchObj.pageY
		startTime = new Date().getTime() // When finger first makes contact
	})

	touchSurface.addEventListener('touchmove', function(e) {
		e.preventDefault() // Prevent scrolling by touch
	}, {passive: false})

	touchSurface.addEventListener('touchend', function(e) {
		var touchObj = e.changedTouches[0]
		distY = touchObj.pageY - startY // Vertical distance travelled
		elapsedTime = new Date().getTime() - startTime
		if(elapsedTime <= allowedTime) {
			if(Math.abs(distY) >= threshold) {
				// If distance travelled is negative, indicates an up swipe
				swipeDir = (distY < 0)? "up" : "down"
				e.preventDefault()
			}
			else {trueFalse = true}
		}
		handleSwipe(swipeDir)
	}, {passive: trueFalse})

}

const el = document.querySelector("body");
el.onwheel = wheelEvent;
document.onkeydown = keyEvent;

swipeEvent(el, function(swipeDir) {
	if(swipeDir == "up") {
		scrollEventDown();
	}
	else if(swipeDir == "down") {
		scrollEventUp();
	}
});

// Apply visual variable changes
for(let i = 0; i < scrollBgArray.length; i++) {
	let data = scrollBgArray[i].querySelector(".sl-bg-embed").dataset;
	let bgColor = "black";
	let bgPos = [,];
	if(data.bgcolor != undefined) {bgColor = data.bgcolor}
	if(data.posx != undefined) {bgPos[0] = data.posx}
	if(data.posy != undefined) {bgPos[1] = data.posy}
	if(bgPos.includes("")) {scrollBgArray[i].style.backgroundPosition = "" + bgPos[0] + "% " + bgPos[1] + "%"}
	scrollBgArray[i].style.backgroundColor = bgColor;
	if(data.padded == "Yes") {scrollBgArray[i].className += " padded"}
}

for(let i = 0; i < sectionLinks.length; i++) {
	sectionLinks[i].addEventListener('click', function() {
		// Identify corresponding section + set currentSection + scroll up or down
		for(let j = 0; j < scrollBgArray.length; j++) {
			if(sectionLinks[i].querySelector(".sl-s-link").textContent == scrollBgArray[j].querySelector(".sl-bg-embed").dataset.title) {
				let k = j + 1;
				if(currentSection == 0) {overlayFadeout()}
				if(k < currentSection) {currentSection = k - 1; scrollSectionDown(); break}
				else if(k > currentSection) {currentSection = k + 1; scrollSectionUp(); break}
			}
		}
	})
}

var bigScreen = window.matchMedia("(min-width: 992px)");
window.addEventListener('resize', () => {
	if(bigScreen.matches) {navMenu.style.backgroundColor = "transparent";}
	else {colorChange();}
});