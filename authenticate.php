<?php

echo "<pre>";
print_r($_REQUEST);
echo "done";
header("location: $_REQUEST");
exit();

?>