const offices = document.querySelectorAll(".rt-lst-of-hdng-div");
const retailSpaces = document.querySelectorAll(".rt-lst-item-div.rt");
const sitemapLayers = document.querySelectorAll(".rt-sitemap-col-item");

for(let i = 0; i < offices.length; i++) {
	let officeSpaces = offices[i].nextSibling.querySelectorAll(".rt-lst-item-div");
	// Set # of available office spaces
	offices[i].querySelector(".rt-lst-of-count").textContent = officeSpaces.length;
	// Display correspondng sitemap office availability
	let officeAvai = true;
	if(officeSpaces.length == 0) {officeAvai = false}
	for(let j = 0; j < sitemapLayers.length; j++) {
		if(offices[i].querySelector(".rt-lst-of-hdng").textContent.includes(sitemapLayers[j].querySelector(".rt-sitemap-layer-data").dataset.name)) {
			if(officeAvai == false) {sitemapLayers[j].querySelector(".rt-sitemap-svg.unavai").style.display = "inline-block"}
			else {sitemapLayers[j].querySelector(".rt-sitemap-svg.avai").style.display = "inline-block"}
		}
	}
}

// Display available or unavailable retail spaces sitemap layers
/*for(let i = 0; i < retailSpaces.length; i++) {
	let layerMatch = false;
	let currentLayer = sitemapLayers[0];
	let rtTitleTxt = retailSpaces[i].querySelector(".rt-lst-item-txt.title.rt").textContent;
	// Cycle through sitemapLayers[] to find the corresponding layer for retailSpaces[i]
	for(let j = 0; j < sitemapLayers.length; j++) {
		currentLayer = sitemapLayers[j];
		let layerName = sitemapLayers[j].querySelector(".rt-sitemap-layer-data").dataset.name;
		if(rtTitleTxt.includes(layerName)) {layerMatch = true; break}
	}
	// If layerMatch == true, show that layer's available SVG. Else, show layer's unavailable SVG
	let avaiSVG = currentLayer.querySelector(".rt-sitemap-svg.avai");
	let unavaiSVG = currentLayer.querySelector(".rt-sitemap-svg.unavai");
	if(layerMatch == true) {avaiSVG.style.display = "inline-block"}
	else {unavaiSVG.style.display = "inline-block"}
}*/

// Retail spaces sitemap layers
for(let i = 0; i < sitemapLayers.length; i++) {
	let layerMatch = false;
	let layerName = sitemapLayers[i].querySelector(".rt-sitemap-layer-data").dataset.name;
	let avaiSVG = sitemapLayers[i].querySelector(".rt-sitemap-svg.avai");
	let unavaiSVG = sitemapLayers[i].querySelector(".rt-sitemap-svg.unavai");
	// Cycle through each retailSpaces[] to find the matching listing
	for(let j = 0; j < retailSpaces.length; j++) {
		let rtTitleTxt = retailSpaces[j].querySelector(".rt-lst-item-txt.title.rt").textContent;
		if(rtTitleTxt.includes(layerName)) {layerMatch = true; break}	
	}
	// If a match is found, display avaiSVG. If not, display unavaiSVG
	if(layerMatch == true) {avaiSVG.style.display = "inline-block"}
	else {unavaiSVG.style.display = "inline-block"}
}