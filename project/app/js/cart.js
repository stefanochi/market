//Handles the functionality for the cart

var Cart = (function(){
    var cartProducts;

    function init(){
        if(loggedUser.info){
            setListeners();
            getCartProducts();
        }
    }


    //set the listener
    function setListeners(){
        //remove previous listeners
        $('#cart_div *').off();
        $('#confirmCheckout_modal *').off();

        //add drag and drop functionality
        $('#cart_div').on('dragover', function(e){
            e.preventDefault();
        });
        $('#cart_div').on('dragenter', function(e){
            e.preventDefault();
        });
        $('#cart_div').on('drop', function(e){
            e.preventDefault();
            var data = e.originalEvent.dataTransfer.getData('product');
            addProductToCart(data);
        });

        //listeners for the buttons
        $('#cart_buy').click(function(){
            showConfirmationWindow();
        });

        //listeners for the checkout confirmation window
        $('#confirmCheckout_modal .confirm').click(function(){
            buyCartProducts();
            hideConfirmationWindow();
        });
        $('#confirmCheckout_modal .close').click(function(){
            hideConfirmationWindow();
        });
        $('#confirmCheckout_modal .cancel').click(function(){
            hideConfirmationWindow();
        });
    }

    //show tho windows asking for checkout confirmation
    function showConfirmationWindow(){
        $('#confirmCheckout_modal').removeClass('hidden');
    }
    //hide the confirrmation window
    function hideConfirmationWindow(){
        $('#confirmCheckout_modal').addClass('hidden');
    }

    //add a products to the cart given its ID
    function addProductToCart(productID){
        //the user can add the product only if he is logged in
        if(loggedUser.info){
            var payload = {
                userID: loggedUser.info.ID,
                productID: productID
            }
            //tries to add the products the cart,
            //if it is successful, return the new list of products in the cart
            $.post('ajax/cart/add', payload, function(res){
                if(res.state == 0){
                    //if the request was successful, update the cart
                    cartProducts = res.data;
                    showCartProducts();
                }else{
                    //show an error to the user
                    showError(res.message);
                }
            });
        }else{
            showError("Not logged in");
        }
    }

    //send request to the server to remove the specified product form the cart
    function removeProductsFromCart(productID){
        if(loggedUser.info){
            var payload = {
                userID: loggedUser.info.ID,
                productID: productID
            }
            //tries to remove the products the cart,
            //if it is successful, return the new list of products in the cart
            $.post('ajax/cart/remove', payload, function(res){
                if(res.state == 0){
                    //if the request was successful, update the cart
                    cartProducts = res.data;
                    showCartProducts();
                }else{
                    //show an error to the user
                    showError(res.message);
                }
            });
        }else{
            //show an error to the user
            showError("You are nor logged in");
        }
    } 

    //send request to the server for all the products contained in the user's cart
    function getCartProducts(){
        $.get('ajax/cart/', {userID: loggedUser.info.ID}, function(res){
            if(res.state == 0){
                cartProducts = res.data;
                showCartProducts();
            }else{
                //show an error to the user
                showError("Could not load Cart");
            }
        });
    }

    //render the product in the page
    function showCartProducts(){
        //empty the cart div
        $('#cartList_div').html("");
        //show the div for the cart
        $("#cart_div").removeClass('hidden');
       
        //show all the products in the cart
        if(cartProducts){

            //compile the template
            var source = $('#cartProduct_template').html();
            var template = Handlebars.compile(source);
            
            for(var i=0; i<cartProducts.length; i++){
                var content = cartProducts[i];
                var html = template(content);

                $('#cartList_div').append(html);
            }
        }

        //set listeners for the products in the cart
        $('.cartProduct_remove').click(function(e){
            var productID = $(e.target).parent().attr('id').split('_')[1];
            removeProductsFromCart(productID);
        });

        
    }

    //reset the list of the products in the cart (only client)
    //the information on the server in unchanged
    function deleteCartProducts(){
        cartProducts = null;
        showCartProducts();
    }

    //send request to the server to buy the products in the cart
    //set the products in the cart as sold (if not already) and removes the products from the cart
    //both on the client and on the server
    function buyCartProducts(){
        if(loggedUser.info){
            $.post('ajax/cart/buy', {userID: loggedUser.info.ID}, function(res){
                if(res.state == 0){
                    showMessage("Products bought successfully");
                    Cart.init();
                }else{
                   //show an error to the user
                   showError("Error buying products");
                }
            });
        }
    }

    //hide the cart div
    //for example when showing the login page we don't want to shoe the cart
    function hideCart(){
        $('#cart_div').addClass('hidden');
    }

    //function available to be called from outside
    return{
        init: init,
        deleteCartProducts: deleteCartProducts,
        addProductToCart: addProductToCart,
        hideCart: hideCart
    }
}());