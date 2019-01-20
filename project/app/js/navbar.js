//code for the navigation bar on top

var Navbar = (function(){
    
    function init(){
        //change the link based on the state of the authentication
        if(loggedUser.info){
            $('#logout_button').html("Logout");
        }
        //setup navbar listeners

        //logout action
        $('#logout_button').click(function(){
            logout();
        });

        //listeners for the search field
        $('#search_submit').click(function(){
            var search = $('#search_input').val();
            if(search){
                Router.navigate("#products/search/" + search);
            }
        });

        //if the screen is small, hide the side panel after a link is clicked
        $('.nav_links a').click(function(){
            if($(window).width() < 767){
                //hide the sidebar after any link is clicked
                hideSideMenu();
            }
        });

        //show the side menu
        $('.menu-icon').click(function(){
            showSideMenu();
        });
        //hide the side menu
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