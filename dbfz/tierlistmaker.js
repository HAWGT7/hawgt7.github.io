'use strict';

var dbfz = (function () {

	var tiers = [
		{
			title: "Z",
			minPowerLevel: 88,
			maxPowerLevel: 100,
			characters: []
		},
		{
			title: "S",
			minPowerLevel: 75,
			maxPowerLevel: 87,
			characters: []
		},
		{
			title: "A",
			minPowerLevel: 63,
			maxPowerLevel: 74,
			characters: []
		},
		{
			title: "B",
			minPowerLevel: 50,
			maxPowerLevel: 62,
			characters: []
		},
		{
			title: "C",
			minPowerLevel: 38,
			maxPowerLevel: 49,
			characters: []
		},
		{
			title: "D",
			minPowerLevel: 25,
			maxPowerLevel: 37,
			characters: []
		},
		{
			title: "E",
			minPowerLevel: 13,
			maxPowerLevel: 24,
			characters: []
		},
		{
			title: "F",
			minPowerLevel: 0,
			maxPowerLevel: 12,
			characters: []
		}
	]

	var characters = [
		{ title: "android_16", powerLevel: 50 },
		{ title: "android_17", powerLevel: 50 },
		{ title: "android_18", powerLevel: 50 },
		{ title: "android_21", powerLevel: 50 },
		{ title: "bardock", powerLevel: 50 },
		{ title: "beerus", powerLevel: 50 },
		{ title: "broly", powerLevel: 50 },
		{ title: "broly_dbs", powerLevel: 50 },
		{ title: "cell", powerLevel: 50 },
		{ title: "cooler", powerLevel: 50 },
		{ title: "frieza", powerLevel: 50 },
		{ title: "ginyu", powerLevel: 50 },
		{ title: "gogeta", powerLevel: 50 },
		{ title: "gohan", powerLevel: 50 },
		{ title: "gohan_teen", powerLevel: 50 },
		{ title: "goku", powerLevel: 50 },
		{ title: "goku_black", powerLevel: 50 },
		{ title: "goku_gt", powerLevel: 50 },
		{ title: "goku_ss", powerLevel: 50 },
		{ title: "goku_ssb", powerLevel: 50 },
		{ title: "goku_ui", powerLevel: 50 },
		{ title: "gotenks", powerLevel: 50 },
		{ title: "hit", powerLevel: 50 },
		{ title: "janemba", powerLevel: 50 },
		{ title: "jiren", powerLevel: 50 },
		{ title: "kefla", powerLevel: 50 },
		{ title: "kid_buu", powerLevel: 50 },
		{ title: "krillin", powerLevel: 50 },
		{ title: "majin_buu", powerLevel: 50 },
		{ title: "nappa", powerLevel: 50 },
		{ title: "piccolo", powerLevel: 50 },
		{ title: "roshi", powerLevel: 50 },
		{ title: "super_baby_2", powerLevel: 50 },
		{ title: "tien", powerLevel: 50 },
		{ title: "trunks", powerLevel: 50 },
		{ title: "vegeta", powerLevel: 50 },
		{ title: "vegeta_ss", powerLevel: 50 },
		{ title: "vegeta_ssb", powerLevel: 50 },
		{ title: "vegito", powerLevel: 50 },
		{ title: "videl", powerLevel: 50 },
		{ title: "yamcha", powerLevel: 50 },
		{ title: "zamasu", powerLevel: 50 },
	];

	var selectedCharacter = { title: "", powerLevel: 0 };

	var init = function () {
		selectCharacter(characters[Math.floor(Math.random() * characters.length)].title);
		renderTierList();
	}

	function selectCharacter(title) {
		characters.filter(character => {
			if (character.title == title) selectedCharacter = character;
		})
		var el = document.getElementById("selectedCharacter");
		var html = "";
		html += "<div class='container text-center center'>";
		html += "<div class='divBlockTop'>";
		html += "<div class='characterSelect'><img src='./images/renders/" + selectedCharacter.title + ".png'></div>";
		html += "</div>";
		html += "<div class='divBlockTop'>";
		html += "<div><label for='powerLevel'>Power Level</label><input type='number' class='form-control' id='powerLevel' min='0' max='100' oninput='dbfz.updateCharacter()' value='" + selectedCharacter.powerLevel + "'></div>";
		html += "</div>";
		html += "</div>";
		el.innerHTML = html;
	}

	function updateCharacter() {
		var powerLevel = document.getElementById("powerLevel").value;
		if (powerLevel < 0) document.getElementById("powerLevel").value = 0;
		if (powerLevel > 100) document.getElementById("powerLevel").value = 100;
		selectedCharacter.powerLevel = powerLevel;
		characters.filter(character => character.title == selectedCharacter.title).forEach(character => character == selectedCharacter);
		renderTierList();
	}

	function renderTierList() {
		characters.sort(function(a,b) {
			return b.powerLevel - a.powerLevel
		});
		//[...array] also copies
		tiers.forEach(tier => tier.characters = characters.filter(character => character.powerLevel >= tier.minPowerLevel && character.powerLevel <= tier.maxPowerLevel))
		var el = document.getElementById("tierList");
		var html = "";
		html += "<table class='table'>";
		html += "<tr><th class='tier'>TIER</th><th>CHARACTERS</th></tr>";
		tiers.forEach(tier => {
			html += "<tr><td>" + tier.title + " (" + tier.maxPowerLevel + " - " + tier.minPowerLevel + ")" + "</td><td>";
			tier.characters.forEach(character => {
				html += "<div class='characterTier'><img src='./images/cells/" + character.title + ".png' onclick='dbfz.selectCharacter(\"" + character.title + "\")'><span class='powerLevel'>" + character.powerLevel + "</span></div>"
			})
			html += "</td></tr>";
		})
		html += "</table>";
		el.innerHTML = html;
	}


	return {
		init: init,
		selectCharacter: selectCharacter,
		updateCharacter: updateCharacter
	};

})();

dbfz.init();
