const offices = document.querySelectorAll(".rt-lst-of-hdng-div");

for(let i = 0; i < offices.length; i++) {
	let officeSpaces = offices[i].nextSibling.querySelectorAll(".rt-lst-item-div");
	offices[i].querySelector(".rt-lst-of-count").textContent = officeSpaces.length
}