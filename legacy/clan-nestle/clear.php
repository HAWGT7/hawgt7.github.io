<?php
unlink('chat.txt');
$fh = fopen('chat.txt','w');
fwrite($fh, "Clan Nestle Chat\n");
fclose($fh);
chmod('chat.txt', 0777);
header( 'Location: chatlogin.php' );
?>