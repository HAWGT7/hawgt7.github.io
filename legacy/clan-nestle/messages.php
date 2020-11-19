<!DOCTYPE HTML>
<html>
<head>
<title>Clan Nestlé Chat</title>
<meta charset='utf-8' />
<meta http-equiv="refresh" content="5" />
<link rel="stylesheet" type="text/css" href="layouts/layout.css" />
<script type='text/javascript' src='scripts/jquery.js'></script>
<style type="text/css">
body,td,th {
	font-family: Consolas;
	color: #0FF;
	font-weight: bold;
}
body {
	background-color: #000;
}
a {
	font-family: Consolas;
	color: #0F0;
	font-weight: bold;
	font-style: italic;
}
a:link {
	text-decoration: none;
}
a:visited {
	text-decoration: none;
	color: #0F0;
}
a:hover {
	text-decoration: none;
	color: #0F0;
}
a:active {
	text-decoration: none;
	color: #0F0;
}
</style>
</head>
<body>
<center>
<div id='chatbox'>
<textarea name='messages' id='messages' disabled="disabled" rows="22" cols="77">
<?php
include("chat.txt");
?>
</textarea>
</div>
<script type='text/javascript'>
messages.scrollTop = messages.scrollHeight;
</script>
</center>
</body>
</html>