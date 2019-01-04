var Cart = (function(){
    var cartProducts;

    function init(){
        if(loggedUser.info){
            getCartProducts();
        }
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
                    //TODO show a notice to the user
                    console.log("Error adding product to cart: " + res.message);
                }
            });
        }else{
            //the user is not logged in
            console.log("User not logged in");
        }
    }

    function removeProductsFromCart(productID){
        if(loggedUser.info){
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
                        //TODO show a notice to the user
                        console.log("Error removing product to cart: " + res.message);
                    }
                });
            }else{
                //the user is not logged in
                console.log("User not logged in");
            }
        }
    }

    function getCartProducts(){
        $.get('ajax/cart/', {userID: loggedUser.info.ID}, function(res){
            if(res.state == 0){
                cartProducts = res.data;
                showCartProducts();
            }
        });
    }

    function showCartProducts(){
        $('.right').html("");
        //create a div for the cart
        $('.right').html("<div id='cart_div'></div>");
        $('#cart_div').html("<button id='cart_buy'>Buy Products</button>");
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
        //show all the products in the cart
        if(cartProducts){

            //compile the template
            var source = $('#cartProduct_template').html();
            var template = Handlebars.compile(source);
            
            for(var i=0; i<cartProducts.length; i++){
                var content = cartProducts[i];
                var html = template(content);

                $('#cart_div').prepend(html);
            }
        }

        //set listeners
        $('.cartProduct_remove').click(function(e){
            var productID = $(e.target).parent().attr('id').split('_')[1];
            removeProductsFromCart(productID);
        });

        $('#cart_buy').click(function(){
            buyCartProducts();
        });
    }

    function deleteCartProducts(){
        cartProducts = null;
        showCartProducts();
    }

    function buyCartProducts(){
        if(loggedUser.info)
            $.post('ajax/cart/buy', {userID: loggedUser.info.ID}, function(res){
                if(res.state == 0){
                    Cart.init();
                }else{
                    console.log("error buying products");
                    //TOTO 
                    //display error message
                }
            });
    }

    function hideCart(){
        $('#cart_div').addClass('hidden');
    }

    return{
        init: init,
        deleteCartProducts: deleteCartProducts,
        addProductToCart: addProductToCart,
        hideCart: hideCart
    }
}());