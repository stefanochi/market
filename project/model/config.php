<?php
    $dsn = "mysql:dbname=tweb;host=172.21.0.2;port=3306";
    $dbuser = "root";
    $dbpassword = "Pericolo";

    $database = new PDO($dsn, $dbuser, $dbpassword);
?>