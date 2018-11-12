<?php include("top.html"); ?>


<?php 
    $sing_file = "singles.txt";
    $singles = file($sing_file);

    $current_name = $_GET["name"];

    foreach($singles as $single_str){
        $single = explode(",", $single_str);       
        if($single[0] === $current_name){
            $current_person = $single;
        }
    }

    foreach($singles as $single_str){
        $single = explode(",", $single_str);
        if($single[0] != $current_person[0] && 
           $single[1] != $current_person[1] &&
           $single[4] == $current_person[4] &&
           match_age($single, $current_person) &&
           match_personality($single[3], $current_person[3])){
            show_match($single);
        }
    }

    function match_age($person1, $person2){
        if($person1[2] <= $person2[5] || //less than minimum age
           $person1[2] >= $person2[6]){ //more than maximum
            return false;
        }

        if($person2[2] <= $person1[5] || //less than minimum age
           $person2[2] >= $person1[6]){ //more than maximum
            return false;
        }

        return true;

    }

    function match_personality($person1, $person2){
        for($i=0; $i<strlen($person1); $i++){
            if($person1[$i] == $person2[$i]){
                return true;
            }
        }
        return false;
    }

    function show_match($person){
        ?>
        <div class="match">
            <p><?=$person[0]?></p>
            <img src="http://www.cs.washington.edu/education/courses/cse190m/12sp/homework/4/user.jpg" alt="profile picture">
            <ul>
                <li><strong>gender:</strong><?=$person[1]?></li>
                <li><strong>age:</strong><?=$person[2]?></li>
                <li><strong>type:</strong><?=$person[3]?></li>
                <li><strong>OS:</strong><?=$person[4]?></li>
            </ul>
        </div>

        <?php
    }
?>

<?php include("bottom.html"); ?>
