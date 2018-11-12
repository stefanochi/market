<?php include("top.html"); ?>

<form action="matches-submit.php" method="get">
    <fieldset>
        <legend>Returnign User:</legend>
        <div>
            <label class="left" for="name"><strong>Name:</strong></label>
            <input id="name" type="text" name="name" size="16">
        </div>
        <div>
            <label class="left">
                <input type="submit">
            </label>
        </div>
    </fieldset>
</form>


<?php include("bottom.html"); ?>