var Navbar = (function(){
    function init(){
        //setup navbar listeners
        $('#logout_button').click(function(){
            logout();
        });
    }

    function logout(){
        loggedUser.logout();
        Router.navigate('#login');
    }

    return{
        init: init
    }
}());