<?php

//page for all movies by an actor

include("top.html");
include("db_helper.php"); //for databse query and display

$firstname = $_GET['firstname'];
$lastname = $_GET['lastname'];
?>

<h1>Results for <?=$firstname . " " . $lastname?></h1>

<?php

//get the db instance
$imdb = get_imdb();

//get all movies by that actor
$rows = get_all_movies($imdb, $firstname, $lastname);
    show_table($rows);

include("bottom.html");
?>