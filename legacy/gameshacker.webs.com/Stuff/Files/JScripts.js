// JavaScript Document

function createbanner()
{
	var ws=prompt("Web-Site", "O teu Web-Site aqui...");
	var iu=prompt("URL da Imagem", "O URL da tua image aqui...");
	document.write("<plaintext>", "<a href='", ws, "'><img src='", iu, "'></img></a>");
}

function createlink()
{
	var ws=prompt("Web-Site", "O teu Web-Site aqui...");
	var lt=prompt("Texto do Link", "O Texto do teu link aqui...");
	document.write("<plaintext>", "<a href='", ws, "'>", lt, "</a>");
}