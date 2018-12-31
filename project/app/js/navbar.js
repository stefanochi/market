var Navbar = (function(){
    function init(){
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
        Router.navigate('#login');
    }

    return{
        init: init
    }
}());