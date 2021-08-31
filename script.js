function $(id) {
	return document.getElementById(id);
}

let data;
async function start() {
	let request = await fetch("sites.json");
	data = await request.json();
	search($("page-home-search-bar").value);
}
start();
showHomePage();

function search(term) {
	let filteredData = [];
	if (term != "") {
		term = term.toLowerCase();
		for (var site of data) {
			for (var prop in site) {
				let str = site[prop].toLowerCase();
				if (str.includes(term)) {
					filteredData.push(site);
					break;
				}
			}
		}
	} else {
		filteredData = data;
	}
	setContent(filteredData);
}

function setContent(filteredData) {
	let output = "";
	for (var site of filteredData) {
		output += `<div class='block'>`;
		output += `<a class='block-url' href='${site.url}'> ${site.url} </a>`;
		output += `<a class='block-name' href='${site.url}'> ${site.name} </a>`;
		output += `<p class='block-description'> ${site.description} </p>`;
		output += `</div>`;
	}
	if (filteredData.length == 0) {
		output += `<div class='block'>`;
		output += `<p class='block-description'> No results were found. Please try another search term. </p>`;
		output += `</div>`;
	}
	document.getElementsByClassName("blocks")[0].innerHTML = output;
}

function showHomePage() {
	document.getElementsByClassName("page-results")[0].classList.add("hidden");
	document.getElementsByClassName("page-home")[0].classList.remove("hidden");
}

function showResultPage() {
	document.getElementsByClassName("page-home")[0].classList.add("hidden");
	document.getElementsByClassName("page-results")[0].classList.remove("hidden");
}

$("page-result-search-bar").addEventListener("change", function () {
	search($("page-result-search-bar").value);
});

$("page-home-search-bar").addEventListener("change", function () {
	search($("page-home-search-bar").value);
	$("page-result-search-bar").value = $("page-home-search-bar").value;
	showResultPage();
});

$("page-home-feeling-lucky").addEventListener("click", function () {
	let site = data[Math.floor(Math.random()*data.length)];
	setContent([site])
	$("page-result-search-bar").value = site.name;
	showResultPage();
})

$("page-home-all-sites").addEventListener("click", function () {
	setContent(data)
	$("page-result-search-bar").value = "";
	showResultPage();
})

$("page-result-google-logo").addEventListener("click", function () {
	$("page-home-search-bar").value = "";
	showHomePage();
});
