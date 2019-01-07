var Products = (function(){

    var userID;
    var products;

    function init(requestedID){
        //setListeners
        $('#addProduct_button').click(showAddProductForm);

        $('#product_add').click(function(){
            addProduct();
            removeAddProductForm();
        });
        $('#addProduct_modal .close').click(function(){
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
                    console.log(res.message);
                }
            });
        }
       
    }
    
    //get all the products with the title matching the search string
    function loadProductsBySearch(search){
        userID = null;
        var source = $('#searchResult_template').html();
        var template = Handlebars.compile(source);
        var html = template();
        $('.main').html(html);
        //request to the server
        $.get("ajax/products/search", {search: search}, function(res){
            if(res.state == 0){
                products = res.data;
                //show the list of products
                showProducts();
            }else{
                console.log(res.message);
            }
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
                var button = "<button class='product_delete'>Delete</button><button class='produc_update'>Update</button>";
            }else{
                var button = "<button class='product_addToCart'>Add To Cart</button>";
            }
            $("#" + products[i].ID + "> .button_div").append(button);


            $("#" + products[i].ID).attr('draggable', 'True');
            $("#" + products[i].ID).on('dragstart', function(e){
                e.originalEvent.dataTransfer.setData("product", e.target.id);
            });
        }
    
        if(loggedUser.info && loggedUser.info.ID == userID){
            $('#addProduct_button').removeClass('hidden');
        }
    
        setListenersProducts();
    }
    
    function setListenersProducts(){
        $('.product_delete').click(buttonDelete);
        //$('.product_update').click(updateProduct);

        $('.product_addToCart').click(addProductToCart);
    }

    function addProductToCart(e){
        var productID = $(e.target).parent().parent().attr('id');
        Cart.addProductToCart(productID);
    }
    
    function buttonDelete(e){
        var productID = $(e.target).parent().parent().attr('id');
        $.post('/project/ajax/products/delete', {productID: productID}, function(res){
            loadProductsByUserID(loggedUser.info.ID);
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
                loadProductsByUserID(loggedUser.info.ID);
            }else{
                console.log(res.message);
            }
        });
    }

    return{
        init: init,
        loadProductsByUserID: loadProductsByUserID,
        loadProductsBySearch: loadProductsBySearch
    }
}());