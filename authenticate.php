<?php

echo "<pre>";
$x =print_r($_REQUEST);
echo "done";
header("location: $x");
exit();

?>