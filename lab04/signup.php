<?php include("top.html"); ?>

<div>
    <form action="signup-submit.php" method="post">
        <fieldset>
        <legend>New User Signup:</legend>
        <div>
            <label for="name" class="left"><strong>Name:</strong></label>
            <input id="name" type="text" name="name" size="16">
        </div>

        <div>
            <label class="left" for="female"><strong>Gender:</strong></label>
            <input id="male" type="radio" name="gender" value="M">
            <label for="male">Male</label>
            <input id="female" type="radio" name="gender" value="F" checked="checked">
            <label for="female">Female</label>
        </div>

        <div>
            <label class="left" for="age"><strong>Age:</strong></label>
            <input id="age" type="text" name="age" size="6" maxlength="2">
        </div>

        <div>
            <label class="left" for="personality"><strong>Personality type:</strong></label>
            <input id="personality" type="text" name="personality" size="6" maxlength="4">
            (<a href="www.humanmetrics.com/cgi-win/JTypes2.asp">Don't know your type?</a>)
        </div>

        <div>
            <label class="left" for="favoriteos"><strong>Favorite OS:</strong></label>
            <select id="favoriteos" class="column"  name="favoriteos">
                    <option>Windows</option>
                    <option>Mac OS X</option>
                    <option>Linux</option>
            </select>
        </div>

        <div>
            <label class="left" for="min"><strong>Seeking age:</strong></label>
            <input id="min" type="text" name="minAge" placeholder="min" size="6" maxlength="2">
            <input id="max" type="text" name="maxAge" placeholder="max" size="6" maxlength="2">
        </div>
        <div>
            <label class="left">
                <input type="submit" value="Sign Up">
            </label>
        </div>
        </fieldset>
    </form>
</div>

<?php include("bottom.html"); ?>