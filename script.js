function $(id) {
	return document.getElementById(id);
}

// ----- SETUP -----

let fuse;
let data;
const options = {
	includeScore: true,
	keys: [
		{
			name: "name",
			weight: 0.5,
		},
		{
			name: "url",
			weight: 0.2,
		},
		{
			name: "description",
			weight: 0.3,
		},
	],
};

async function start() {
	let request = await fetch("sites.json");
	data = await request.json();
	fuse = new Fuse(data, options);
}

start();
showHomePage();

// ----- MAIN SEARCH ALGORITHM -----

function search(term) {
	results = fuse.search(term);
	let output = [];
	for (result of results) {
		output.push(data[result.refIndex]);
	}
	displaySearch(output);
}

function displaySearch(results) {
	output = "";
	for (result of results) {
		output += `<div class='block'>`;
		output += `<a class='block-url' href='${result.url}'> ${result.url} </a>`;
		output += `<a class='block-name' href='${result.url}'> ${result.name} </a>`;
		output += `<p class='block-description'> ${result.description} </p>`;
		output += `</div>`;
	}
	if (results.length == 0) {
		output += `<div class='block'>`;
		output += `<p class='block-description'> No results were found. Please try another search term. </p>`;
		output += `</div>`;
	}
	document.getElementsByClassName("blocks")[0].innerHTML = output;
}

// ----- NAVIGATION -----

function showHomePage() {
	document.getElementsByClassName("page-results")[0].classList.add("hidden");
	document.getElementsByClassName("page-home")[0].classList.remove("hidden");
}

function showResultPage() {
	document.getElementsByClassName("page-home")[0].classList.add("hidden");
	document
		.getElementsByClassName("page-results")[0]
		.classList.remove("hidden");
}

// ----- BUTTONS AND STUFF -----

$("page-result-search-bar").addEventListener("change", function () {
	search($("page-result-search-bar").value);
});

$("page-home-search-bar").addEventListener("change", function () {
	search($("page-home-search-bar").value);
	$("page-result-search-bar").value = $("page-home-search-bar").value;
	showResultPage();
});

$("page-home-feeling-lucky").addEventListener("click", function () {
	let site = data[Math.floor(Math.random() * data.length)];
	displaySearch([site]);
	$("page-result-search-bar").value = site.name;
	showResultPage();
});

$("page-home-all-sites").addEventListener("click", function () {
	displaySearch(data);
	$("page-result-search-bar").value = "";
	showResultPage();
});

$("page-result-google-logo").addEventListener("click", function () {
	$("page-home-search-bar").value = "";
	showHomePage();
});
