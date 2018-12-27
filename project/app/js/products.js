var Products = (function(){

    var userID;
    var products;

    function loadProductsByUserID(requestedID){
        //empty the content of the page to be replaced
        $('.main').html("");
        userID = requestedID;
        
        var payload = userID ? {id: userID} : {};
        $.get('/project/ajax/products', payload, function(res){
            if(res.state == 0){
                products = res.data;
                showProducts();
            }else{
                console.log(res.message);
            }
        });
    }
    
    function loadProductsBySearch(search){
        $('.main').html("");
        $.get("ajax/products/search", {search: search}, function(res){
            if(res.state == 0){
                products = res.data;
                showProducts();
            }else{
                console.log(res.message);
            }
        });
    }
    
    function showProducts(){
        $('.main').html("<div id='productList_div'></div>");
        $('#productList_div').append("<button id='addProduct_button' class='hidden'>Add Product</button>");
        var source = $('#product_template').html();
        var template = Handlebars.compile(source);
        for(var i=0; i<products.length; i++){
            var context = products[i];
            var html = template(context);
    
            $('#productList_div').append(html);
        }
    
        if(loggedUser.info && loggedUser.info.ID == userID){
            $('#addProduct_button').removeClass('hidden');
            $('.button_div').removeClass('hidden');
        }
    
        setListenersProducts();
    }
    
    function setListenersProducts(){
        $('.product_delete').click(buttonDelete);
    
        //$('.product_update').click(updateProduct);
        
        $('#addProduct_button').click(showAddProductForm);
    }
    
    function buttonDelete(e){
        var productID = $(e.target).parent().attr('id');
        $.post('/project/ajax/products/delete', {productID: productID}, function(res){
            loadProducts();
        });   
    }
    
    function showAddProductForm(){
        var source = $('#addProduct_template').html();
        var template = Handlebars.compile(source);   
        $('.main').html(template());
    
        $('#product_add').click(addProduct);
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
                loadProducts();
            }else{
                console.log(res.message);
            }
        });
    }

    return{
        loadProductsByUserID: loadProductsByUserID,
        loadProductsBySearch: loadProductsBySearch
    }
}());