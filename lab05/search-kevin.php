<?php
//movies made with kavin bacon
include("top.html");
include("db_helper.php");

$firstname = $_GET['firstname'];
$lastname = $_GET['lastname'];
?>

<h1>Kavin Bacon with <?=$firstname . " " . $lastname?></h1>

<?php

$imdb = get_imdb();//get db instance
$rows = get_movies_with_bacon($imdb, $firstname, $lastname);//get movies with bacon
show_table($rows);

include("bottom.html");
?>