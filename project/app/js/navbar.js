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

        $('.nav_links a').click(function(){
            if($(window).width() < 767){
                //hide the sidebar after any link is clicked
                hideSideMenu();
            }
        });

        $('.menu-icon').click(function(){
            showSideMenu();
        });
        $('.nav-right .close').click(function(){
            hideSideMenu();
        });
    }

    function showSideMenu(){
        $(".nav-right").removeClass('hidden');
    }
    function hideSideMenu(){
        $(".nav-right").addClass('hidden');
    }

    function logout(){
        loggedUser.logout();
        Cart.deleteCartProducts();
        Cart.hideCart();
        Router.navigate('#login');

        $("#logout_button").html("Log In");
    }

    return{
        init: init,
        showSideMenu: showSideMenu,
        hideSideMenu, hideSideMenu
    }
}());