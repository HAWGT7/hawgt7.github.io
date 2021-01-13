'use strict';

var dbfz = (function () {
	
	var characters = [
		"android_16",
		"android_17",
		"android_18",
		"android_21",
		"bardock",
		"beerus",
		"broly",
		"broly_dbs",
		"cell",
		"cooler",
		"frieza",
		"ginyu",
		"gogeta",
		"gohan",
		"gohan_teen",
		"goku",
		"goku_black",
		"goku_gt",
		"goku_ss",
		"goku_ssb",
		"goku_ui",
		"gotenks",
		"hit",
		"janemba",
		"jiren",
		"kefla",
		"kid_buu",
		"krillin",
		"majin_buu",
		"nappa",
		"piccolo",
		"roshi",
		"super_baby_2",
		"tien",
		"trunks",
		"vegeta",
		"vegeta_ss",
		"vegeta_ssb",
		"vegito",
		"videl",
		"yamcha",
		"zamasu",
	];
	
	var assists = [
		"<b><font color='#0F0'>A</font></b>",
		"<b><font color='#00F'>B</font></b>",
		"<b><font color='#F00'>C</font></b>",
	];
	
    var init = function () {
		generateRandomTeam();
    }
	
	var generateRandomTeam = function () {
		
		var el = document.getElementById("characters");
		
		var charactersLeftAmount = characters.length;
		
		var pointChar = characters[Math.floor(Math.random() * charactersLeftAmount)];
		var pointAssist = assists[Math.floor(Math.random() * assists.length)];
		
		charactersLeftAmount--;
	
		var midChar = characters.filter(e => e !== pointChar)[Math.floor(Math.random() * charactersLeftAmount)];
		var midAssist = assists[Math.floor(Math.random() * assists.length)];
		
		charactersLeftAmount--;
		
		var anchorChar = characters.filter(e => e !== pointChar && e !== midChar)[Math.floor(Math.random() * charactersLeftAmount)];
		var anchorAssist = assists[Math.floor(Math.random() * assists.length)];
		
        var html = "<table class='table'>";
		html +="<tr>";
		html +="<th>Point</th><th>Mid</th><th>Anchor</th>";
		html +="</tr>";
		html +="<tr>";
		html +="<td class='characterCell'><img src='./images/renders/"+pointChar+".png'></td>";
		html +="<td class='characterCell'><img src='./images/renders/"+anchorChar+".png'></td>";
		html +="<td class='characterCell'><img src='./images/renders/"+midChar+".png'></td>";
		html +="</tr>";
		html +="<tr>";
		html +="<td>"+pointAssist+"</td>";
		html +="<td>"+midAssist+"</td>";
		html +="<td>"+anchorAssist+"</td>";
		html +="</tr>";
		html +="</table>";
        el.innerHTML = html;
		
	}
	
    return {
        init: init,
		generateRandomTeam: generateRandomTeam
    };

})();

dbfz.init();
