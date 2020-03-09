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
for(let i = 0; i < retailSpaces.length; i++) {
	let layerMatch = false;
	let currentLayer = sitemapLayers[0];
	let rtTitleTxt = retailSpaces[i].querySelector(".rt-lst-item-txt.title.rt").textContent;
	console.log(rtTitleTxt);
	// Cycle through sitemapLayers[] to find the corresponding layer for retailSpaces[i]
	for(let j = 0; j < sitemapLayers.length; j++) {
		currentLayer = sitemapLayers[j];
		console.log(currentLayer);
		let layerName = sitemapLayers[j].querySelector(".rt-sitemap-layer-data").dataset.name;
		console.log(layerName);
		if(rtTitleTxt.includes(layerName)) {layerMatch = true; console.log("It's a match!"); break}
	}
	// If layerMatch == true, show that layer's available SVG. Else, show layer's unavailable SVG
	let avaiSVG = currentLayer.querySelector(".rt-sitemap-svg.avai");
	let unavaiSVG = currentLayer.querySelector(".rt-sitemap-svg.unavai");
	console.log(avaiSVG); console.log(unavaiSVG);
	if(layerMatch == true) {avaiSVG.style.display = "inline-block"; console.log("Matchy match.")}
	else {unavaiSVG.style.display = "inline-block"; console.log("No match :(")}
}