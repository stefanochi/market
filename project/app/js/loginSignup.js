//code for handling login and singup

var Login = (function(){
    
    //if the user is already logged in, show the profile
    function initLogin(){
        $('.main').html("");
        if(loggedUser.info){
            //if the user is alredy logged in go to his profile page
            Router.navigate('#profile/' + loggedUser.info.ID);
        }else{
            //otherwise show the login page
            showLogin();
        }
    }

    //show the login page
    function showLogin(){
        //compile the template
        var source = $('#login_template').html();
        var template = Handlebars.compile(source);
        var context = {Login: "test login"};
        var html = template(context);
        $('.main').html(html);

        //hide the advanced search div
        $('#advancedSearch_div').addClass('hidden');
       
        setLoginListeners();
    }
    //set the listeners for the login page
    function setLoginListeners(){
        //add the listener for the form
        $('#submit_login').click(function(e){
            e.preventDefault();
            //send login to server
            loginPost();
        });
    
        //listener for the signup
        $('#signup_link').click(function(){
           Router.navigate('#signup');
        });
    }
    
    //send request to the server for the login
    function loginPost(){
    
        var loginUsername = $('#username_login').val();
        var loginPassword = $('#password_login').val();
    
        var payload = {username: loginUsername, password: loginPassword};
    
        //send the login information to the sever
        $.post("ajax/login", payload, function(res){
    
            if(res.state == 0){
                //if the login is successful go to user page
                loggedUser.info = res.data;
                Cart.init();
                Router.navigate('#profile/' + res.data.ID);

                $("#logout_button").html("Logout");
            }else{
                showError(res.message);
            }
        });
    }
    
    //handles signup
    
    //if the user is logged in, show the profile
    function initSignup(){
        $('.main').html("");
        if(loggedUser.info){
            Router.navigate('#profile/' + loggedUser.info.ID);
        }else{
            showSignup();
        }
    }
    //shoe the signup page
    function showSignup(){
        //compile the template
        var source = $('#signup_template').html();
        var template = Handlebars.compile(source);
        var context = {Login: "test signup"};
        var html = template(context);
        $('.main').html(html);

        //hide the advanced search div
        $('#advancedSearch_div').addClass('hidden');
    
        setSignupListeners();
    }
    
    //set the listeners for the signup page
    function setSignupListeners(){
        //add the listener
        $('#submit_signup').click(function(e){
            e.preventDefault();
            //send login to server
            signupPost();
        });
    }
    
    //send request to the server to add a new user with the passed information
    function signupPost(){
    
        var signupUsername = $('#username_signup').val();
        var signupEmail    = $('#email_signup').val();
        var signupPassword = $('#password_signup').val();
    
        var payload = {username: signupUsername, email: signupEmail, password: signupPassword};
    
        //send the login information to the sever
        $.post("ajax/signup", payload, function(res){
    
            if(res.state == 0){
                //if the login is successful go to user page
                loggedUser.info = res.data;
                Cart.init();
                Router.navigate('#profile/' + res.data.ID);

                $("#logout_button").html("Logout");
            }else{
                showError(res.message);
            }
        });
    }

    return {
        initLogin: initLogin,
        initSignup: initSignup
    }
}());