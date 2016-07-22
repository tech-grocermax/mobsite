<?php

echo "<pre>";

print_r($_REQUEST);



$myfile = fopen("newfile.txt", "w") or die("Unable to open file!");
$txt = print_r($_REQUEST);
fwrite($myfile, $txt);
fclose($myfile);

echo "done"; die;
exit();

?>