<!DOCTYPE HTML>
<html>
<head>
<title>Chat</title>
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
<h1>Chat</h1>
<div style="text-align:center;">
<iframe src='messages.php' frameborder="0" marginheight="0" width='660' height='360' scrolling='no'></iframe>
</div>
<a name='type'></a>
<div id='chattext'>
<form method='post' action='#type'>
<table border='0'>
<tr>
<td>User:</td>
<td><input type='text' disabled="disabled" class='input' name='user' value='<?php echo $_GET['user']; ?>' size='70'></td>
</tr>
<tr>
<td>Message:</td>
<td><input align='right' type='text' class='input' name='message' size='70'></td>
<td><input type='submit' class='input' name='submit' value='Send'></td>
</tr>
</table>
</form>
<?php
if (isset($_POST['submit'])) {
	$fh = fopen('chat.txt', 'a');
	fwrite($fh, $_GET['user'].": ".$_POST['message']."\n");
	fclose($fh);
}

if (($_GET['user'])=='') {

	header( 'Location: chatlogin.php' );

}

?>
</div>
<?php
include('footer.php');
?>
</center>
</body>
</html>