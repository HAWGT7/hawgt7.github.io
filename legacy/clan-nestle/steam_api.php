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

//Get Games

if($_GET['tab']=='Games') {

	$xml = simplexml_load_file('http://steamcommunity.com/id/'.$_GET['id'].'/games?tab=all&xml=1');

	echo '<h1>Steam Game Status Fetcher by R4T</h1>';

	$id = 1;
	$worth = 0;

	echo '<div id="accinfo">';

	foreach($xml->xpath('steamID64') as $child) {
		echo 'Steam ID 64: '	. $child . '<br>';
	}

	foreach($xml->xpath('steamID') as $child) {
		echo 'Steam ID: '	. $child . '<br>';
	}
	
	echo '<a href="#worth">How much is this account worth?</a><br>';
	
	echo '</div>';

	foreach($xml->xpath('games') as $child) {
		foreach($child->xpath('game') as $child2) {
			echo '<div id="gamebox">';
			echo 'Game #' . $id . '<br>';
			foreach($child2->xpath('name') as $child3) {
				echo 'Name: '	. $child3 . '<br>';
			}
			foreach($child2->xpath('logo') as $child3) {
				echo '<img src="'.$child3.'"></img><br>';
			}
			foreach($child2->xpath('hoursLast2Weeks') as $child3) {
				echo 'Hours Played in the last 2 weeks: ' . $child3 . '<br>';
			}
			foreach($child2->xpath('hoursOnRecord') as $child3) {
				echo 'Hours Played on Record: ' . $child3 . '<br>';
			}
			foreach($child2->xpath('storeLink') as $child3) {
				echo '<a href="' . $child3 . '" target="_blank">Store Link</a><br>';
			}
			foreach($child2->xpath('appID') as $child3) {
				$tmp_p = getAppPrice($child3, true);
				$worth = $worth + $tmp_p;
				echo 'Price in Store: &#36;' . $tmp_p . ' USD';
			}
			
		$id = $id + 1;
		echo '</div>';
		}
	}
	
	echo '<a name="worth"></a>This Account is worth: &#36;' . $worth;

}

//Get Info

if($_GET['tab']=='Profile') {

	$xml = simplexml_load_file('http://steamcommunity.com/id/'.$_GET['id'].'/?xml=1');
	
	echo '<h1>Steam Profile Info Fetcher by R4T</h1>';
	echo '<div id="fullaccinfo">';
	
	foreach($xml->xpath('steamID64') as $child) {
	
		echo 'Steam ID 64: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('steamID') as $child) {
	
		echo 'Steam ID: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('onlineState') as $child) {
	
		echo 'Online Status: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('stateMessage') as $child) {
	
		echo 'Status Message: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('avatarFull') as $child) {
	
		echo '<img src="' . $child . '"></img><br>';
	
	}
	
	foreach($xml->xpath('vacBanned') as $child) {
	
		echo 'Vac Banned: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('tradeBanState') as $child) {
	
		echo 'Trade Ban Status: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('isLimitedAccount') as $child) {
	
		echo 'Is Account Limited: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('customURL') as $child) {
	
		echo 'Custom URL: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('memberSince') as $child) {
	
		echo 'Member Since: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('steamRating') as $child) {
	
		echo 'Steam Rating: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('hoursPlayed2Wk') as $child) {
	
		echo 'Hours played in the last 2 weeks: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('headline') as $child) {
	
		echo 'Head line: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('location') as $child) {
	
		echo 'Location: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('realname') as $child) {
	
		echo 'Real name: ' . $child . '<br>';
	
	}
	
	foreach($xml->xpath('summary') as $child) {
	
		echo 'Summary: ' . $child . '<br>';
	
	}
	
	echo '</div>';
	
}

//Custom Functions

//Get App Price from store

function getAppPrice($app, $strip) {
$doc = file_get_contents('http://store.steampowered.com/app/' . $app . '/');
if (preg_match('/<div class="game_purchase_price price"  itemprop="price">([^<]*)<\/div>/', $doc, $matches) > 0) {
    $price = $matches[1];
	if($strip==true) {
	$price = str_replace(',', '.', $price);
	$price = str_replace('&#8364;', '', $price);
	$price = str_replace('&#36;', '', $price);
	$price = str_replace('&#163;', '', $price);
	$price = str_replace(' ', '', $price);
	}
	if($price==null) {
		$price = '0';
	}
	return $price;
}
}

?>
</center>
</body>
</html>