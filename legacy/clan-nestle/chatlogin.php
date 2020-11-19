<!DOCTYPE HTML>
<html>
<head>
<title>Clan Nestlé Chat</title>
<meta charset='utf-8' />
<link rel="stylesheet" type="text/css" href="layouts/layout.css" />
<script type='text/javascript' src='scripts/jquery.js'></script>
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
<h1>Chat</h1>
<form method="get" action="chat.php">
User: 
<input type='text' class='input' name="user" size='70'>
<input type='submit' class='input' name="submit" value="Login">
</form>
<?php
include('footer.php');
?>
<center>
</body>
</html>