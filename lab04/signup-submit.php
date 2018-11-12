<?php include("top.html"); ?>

<?php 
    $sing = "singles.txt";

    $person = implode(",", $_POST);
    file_put_contents($sing, $person . "\n", FILE_APPEND);
?>

<strong>Thank you!</strong>
<p>Welcome to NerdLuv, <?= $_POST["name"]?></p>
<p>Now <a href="matches.php">log in to see your matches!</a></p>

<?php include("bottom.html"); ?>