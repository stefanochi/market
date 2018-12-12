//handles login
//
//
//
//
//
//


function showLogin(){

    //compile the template
    var source = $('#login_template').html();
    var template = Handlebars.compile(source);
    var context = {Login: "test login"};
    var html = template(context);
    $('.content').html(html);

    setLoginListeners();
}

function setLoginListeners(){
    //add the listener for the form
    $('#login_form').submit(function(e){
        e.preventDefault();
        //send login to server
        loginPost();
    });

    //listener for the signup
    $('#signup_link').click(function(){
        page('/signup');
    });
}

function loginPost(){

    var loginUsername = $('#username_login').val();
    var loginPassword = $('#password_login').val();

    var payload = {username: loginUsername, password: loginPassword};

    //send the login information to the sever
    $.post("ajax/login.php", payload, function(data){

        if(data.state == "Success"){
            //if the login is successful go to user page
            console.log("login successful");
            user.logged = true;
            user.data = data;
            page('/user');
        }else{
            //if it failed print on console
            console.log("login failed");
        }
    });
}

//handles signup
//
//
//
//
//


function showSignup(){
    //compile the template
    var source = $('#signup_template').html();
    var template = Handlebars.compile(source);
    var context = {Login: "test signup"};
    var html = template(context);
    $('.content').html(html);

    setSignupListeners();
}


function setSignupListeners(){
    //add the listener
    $('#signup_form').submit(function(e){
        e.preventDefault();
        //send login to server
        signupPost();
    });
}

function signupPost(){

    var signupUsername = $('#username_signup').val();
    var signupEmail    = $('#email_signup').val();
    var signupPassword = $('#password_signup').val();

    var payload = {username: signupUsername, email: signupEmail, password: signupPassword};

    //send the login information to the sever
    $.post("ajax/signup.php", payload, function(data){

        if(data.state == "Success"){
            //if the login is successful go to user page
            console.log("signup successful");
            user.logged = true;
            page('/user');
        }else{
            //if it failed print on console
            console.log("signup failed: " + data.message);
        }
    });
}



