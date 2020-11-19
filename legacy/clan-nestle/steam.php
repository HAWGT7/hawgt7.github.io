<!DOCTYPE HTML>
<html>
<head>
<title>Clan Nestlé</title>
<meta charset='utf-8' />
<link rel="stylesheet" type="text/css" href="layouts/layout.css" />
<style type="text/css">
@font-face {
	font-family: CustomFont;
	src: url('layouts/acens.ttf');
}
body,td,th {
	font-family: CustomFont;
	color: #0FF;
	font-weight: bold;
}
body {
	background-color: #000;
}
</style>
</head>
<body>
<center>
<?php
include('header.php');
?>
<h1>Steam Data Retriever</h1>
<form method="get" action="steam_api.php">
Steam Custom URL: 
<input type='text' class='input' name="id" size='70'>
<select name='tab' class='input'>
<option value='Games'>Show Games</option>
<option value='Profile'>Show Info</option>
</select>
<input type='submit' class='input' name="submit" value="See Status">
</form>
<?php
include('footer.php');
?>
</center>
</body>
</html>