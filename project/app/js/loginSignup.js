var Login = (function(){
    
    function initLogin(){
        $('.content').html("");
        if(loggedUser){
            Router.navigate('#profile/' + loggedUser.ID);
        }else{
            showLogin();
        }
    }

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
    
    function loginPost(){
    
        var loginUsername = $('#username_login').val();
        var loginPassword = $('#password_login').val();
    
        var payload = {username: loginUsername, password: loginPassword};
    
        //send the login information to the sever
        $.post("ajax/login", payload, function(res){
    
            if(res.state == 0){
                //if the login is successful go to user page
                console.log("login successful");
                loggedUser = res.data;
                Router.navigate('#profile/' + res.data.ID);
            }else{
                showError("Wrong combination of name and password");
            }
        });
    }
    
    //handles signup
    //
    //
    //
    //
    //
    
    function initSignup(){
        $('.content').html("");
        if(loggedUser){
            Router.navigate('#profile/' + loggedUser.ID);
        }else{
            showSignup();
        }
    }
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
        $('#submit_signup').click(function(e){
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
        $.post("ajax/signup", payload, function(res){
    
            if(res.state == 0){
                //if the login is successful go to user page
                console.log("signup successful");
                loggedUser = res.data;
                Router.navigate('#profile/' + res.data.ID);
            }else{
                showError(data.message);
            }
        });
    }
    
    function showError(message){
        console.log("showing error");
        $('.form_div .alert_div').remove();
        $('.form_div').prepend($('<div class="alert_div"></div>').html(message));
    }

    return {
        initLogin: initLogin,
        initSignup: initSignup
    }
}());