var Products = (function(){

    var userID;
    var products;
    
    function init(requestedID){
        //empty the content of the page to be replaced
        $('.content').html("");
        userID = requestedID;
        loadProducts();
    }

    function loadProducts(){
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
    
    function showProducts(){
        $('.content').html("<div id='productList_div' class='main'></div>");
        $('#productList_div').append("<button id='addProduct_button' class='hidden'>Add Product</button>");
        var source = $('#product_template').html();
        var template = Handlebars.compile(source);
        for(var i=0; i<products.length; i++){
            var context = products[i];
            var html = template(context);
    
            $('#productList_div').append(html);
        }
    
        if(loggedUser && loggedUser.ID == userID){
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
        $('.content').html(template());
    
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
                loadProducts(loggedUser.ID);
            }else{
                console.log(res.message);
            }
        });
    }

    return{
        init: init
    }
}());