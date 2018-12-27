var Cart = (function(){
    var cartProducts;

    function init(){
        if(loggedUser.info){
            getCartProducts();
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

        $('.right').html("<div id='cart_div'></div>");

        //compile the template
        var source = $('#cartProduct_template').html();
        var template = Handlebars.compile(source);
        
        for(var i=0; i<cartProducts.length; i++){
            var context = cartProducts[i];
            var html = template(context);

            $('.right').append(html);
        }
    }

    return{
        init: init
    }
}());