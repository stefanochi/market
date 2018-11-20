<?php
//php for db query and table display

//return an intance of the databse imdb_small
function get_imdb(){
    $imdb = new PDO("mysql:dbname=imdb_small;host=localhost", "root", "Pericolo");
    return $imdb;
}

//return all the movies with both actors
//TODO make two function, one more general to search for 2 general actors, and one that specify bacon
function get_movies_with_bacon($imdb, $firstname, $lastname){

    $actor_id = best_id($imdb, $firstname, $lastname);
    $bacon_id = best_id($imdb, 'Kevin', 'Bacon');

    $rows = $imdb->query("SELECT movies.name name, movies.year year
                        FROM roles AS role1
                            JOIN actors AS actor1 ON actor1.id = role1.actor_id
                            JOIN roles AS role2 ON role1.movie_id = role2.movie_id
                            JOIN actors AS actor2 ON actor2.id = role2.actor_id
                            JOIN movies ON role1.movie_id = movies.id
                        WHERE actor1.id = $bacon_id
                            AND actor2.id = $actor_id
                        ORDER BY movies.year");
    return $rows;
}

//get all movies by an actor
function get_all_movies($imdb, $firstname, $lastname){

    $actor_id = best_id($imdb, $firstname, $lastname);

    $rows = $imdb->query("SELECT movies.name name, movies.year year
                        FROM roles JOIN actors on roles.actor_id = actors.id
                        JOIN movies on movies.id = roles.movie_id
                        WHERE actors.id=$actor_id;
                        ORDER BY movies.year");

    return $rows;
}

//return the correspondent id of an actor given name and lastname
function best_id($imdb, $firstname, $lastname){

    $firstname_l = $firstname . " %";

    $firstname = $imdb->quote($firstname);
    $firstname_l = $imdb->quote($firstname_l);
    $lastname = $imdb->quote($lastname);

    $ids = $imdb->query("
        SELECT MIN(id) id
        FROM actors 
        WHERE last_name=$lastname AND 
              (first_name LIKE $firstname_l OR
              first_name = $firstname) AND 
              film_count = (SELECT MAX(film_count)
                            FROM actors 
                            WHERE last_name=$lastname AND 
                                  (first_name LIKE $firstname_l OR
                                    first_name = $firstname))");

    return $ids->fetch()['id'];
}

//display the table containing the movies
function show_table($rows){
    ?>
    <table>
    <tr>
        <th>#</th>
        <th>Title</th>
        <th>Year</th>
    </tr>
<?php
    $i = 1;
    foreach($rows as $row){
?>      
    <tr>
        <td><?=$i?></td>
        <td><?=$row['name']?></td>
        <td><?=$row['year']?></td>
    </tr>
<?php
    $i++;
    }
?>

</table>
    <?php
}
?>