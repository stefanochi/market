var Products = (function(){

    var userID;
    var products;

    function init(requestedID){
        //setListeners
        $('#addProduct_button').click(showAddProductForm);

        $('#addProduct_modal .confirm').click(function(){
            addProduct();
            removeAddProductForm();
        });
        $('#addProduct_modal .close').click(function(){
            removeAddProductForm();
        });
        $('#addProduct_modal .cancel').click(function(){
            removeAddProductForm();
        });

        loadProductsByUserID(requestedID);
    }

    //get all the products of the specified user
    function loadProductsByUserID(requestedID){
        userID = requestedID;
        if(!userID){
                Router.navigate('#login');  
        }else{
            //if the user requested the products of another user, show that instead
            var payload = {id: userID};
            $.get('/project/ajax/products', payload, function(res){
                if(res.state == 0){
                    products = res.data;
                    showProducts();
                }else{
                    //show an error to the user
                    showError("Could not load the products");
                }

                setListenersProducts();
            });
        }
       
    }
    
    //get all the products with the title matching the search string
    function loadProductsBySearch(arguments){
        userID = null;
        var source = $('#searchResult_template').html();
        var template = Handlebars.compile(source);
        var html = template();
        $('.main').html(html);
        //request to the server

        var payload = {
            search: arguments[0],
            maxPrice: arguments[1],
            minPrice: arguments[2],
            desc: arguments[3],
        }
        $.get("ajax/products/search", payload, function(res){
            if(res.state == 0){
                products = res.data;
                //show the list of products
                showProducts();
            }else{
                //show an error to the user
                showError("Could not load the products");
            }

            setListenersProducts();
        });
    }
    
    //show the list of products, indipendently of the method used to get the data
    function showProducts(){
        //empty the list of products
        $('#productList_div').html("");
        var source = $('#product_template').html();
        var template = Handlebars.compile(source);
        for(var i=0; i<products.length; i++){
            var context = products[i];
            var html = template(context);
    
            $('#productList_div').append(html);
            if(loggedUser.info && loggedUser.info.ID == products[i].ownerID){
                //show delete and update button if the product is sold by the current user
                $('#' + products[i].ID + ' .product_delete').removeClass('hidden');
                $('#' + products[i].ID + ' .product_update').removeClass('hidden');
            }else{
                //show to button to add to the cart if another user is watching the product
                $('#' + products[i].ID + ' .product_addToCart').removeClass('hidden');
            }


            $("#" + products[i].ID).attr('draggable', 'True');
            $("#" + products[i].ID).on('dragstart', function(e){
                e.originalEvent.dataTransfer.setData("product", e.target.id);
            });
        }
    
        if(loggedUser.info && loggedUser.info.ID == userID){
            $('#addProduct_button').removeClass('hidden');
        }
    }
    
    function setListenersProducts(){
        $('.product_delete').click(buttonDelete);
        //$('.product_update').click(updateProduct);

        $('.product_addToCart').click(function(e){
            var productID = $(e.target).parent().parent().attr('id');
            Cart.addProductToCart(productID);
        });
        $('#advancedSearch_form').submit(function(e){
            e.preventDefault();

            var arguments = [
                $('#search_input').val(),
                $('#advancedSearch_maxPrice').val(),
                $('#advancedSearch_minPrice').val(),
                $('#advancedSearch_order').val() == "descending" ? 1 : 0
            ]
            loadProductsBySearch(arguments);
        });
    }
    
    function buttonDelete(e){
        var productID = $(e.target).parent().parent().attr('id');
        $.post('/project/ajax/products/delete', {productID: productID}, function(res){
            if(res.state == 0){
                showMessage("Product removed successfully");
                loadProductsByUserID(loggedUser.info.ID);
            }else{
                showError("Could not remove the product");
            }
        });   
    }
    
    function showAddProductForm(){
        //show the window
        $('#addProduct_modal').removeClass('hidden');
        
        //empty the text fields
        $('#product_title').val("");
        $('#product_price').val("");
        $('#product_description').val("");
        $('#product_image').val("");
        
    }

    function removeAddProductForm(){
        $('#addProduct_modal').addClass('hidden');
    }
    
    function addProduct(){
        var payload = {
            title: $('#product_title').val(),
            price: $('#product_price').val(),
            description: $('#product_description').val(),
            image: $('#product_image').val()
        }
        $.post("/project/ajax/products/add", payload ,function(res){
            if(res.state == 0){
                showMessage("Product added successfully");
                loadProductsByUserID(loggedUser.info.ID);
            }else{
                //show an error to the user
                showError("Could not add the product");
            }
        });
    }

    return{
        init: init,
        loadProductsByUserID: loadProductsByUserID,
        loadProductsBySearch: loadProductsBySearch
    }
}());