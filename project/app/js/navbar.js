var Navbar = (function(){
    function init(){

        if(loggedUser.info){
            $('#logout_button').html("Logout");
        }
        //setup navbar listeners
        $('#logout_button').click(function(){
            logout();
        });

        $('#search_submit').click(function(){
            var search = $('#search_input').val();
            if(search){
                Router.navigate("#products/search/" + search);
            }
        });
    }

    function logout(){
        loggedUser.logout();
        Cart.deleteCartProducts();
        Cart.hideCart();
        Router.navigate('#login');

        $("#logout_button").html("Log In");
    }

    return{
        init: init
    }
}());