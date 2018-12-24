function loadProducts(id){
    $.get('/project/ajax/products', {id: id}, function(res){
        if(res.state == 0){
            showProducts(id, res.data);
        }else{
            console.log("error retreiving data");
        }
    });
}

function showProducts(userID, products){
    $('.content').html("<div id='productList_div' class='main'></div>");
    $('#productList_div').append("<button id='addProduct_button' class='hidden'>Add Product</button>");
    var source = $('#product_template').html();
    var template = Handlebars.compile(source);
    for(var i=0; i<products.length; i++){
        var context = products[i];
        var html = template(context);

        $('#productList_div').append(html);
    }

    if(user && user.ID == userID){
        $('#addProduct_button').removeClass("hidden");
    }

    setListenersProducts();
}

function setListenersProducts(){
    $('.product_delete').click(buttonDelete);

    //$('.product_update').click(updateProduct);
    
    $('#addProduct_button').click(showAddProductForm);
}

function buttonDelete(e){
    var id = $(e.target).parent().attr('id');
    console.log(id);
    $.post('/project/ajax/products/delete', {productID: id}, function(res){
        console.log(res.message);
        loadProducts(user.ID);
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
            loadProducts(user.ID);
        }else{
            console.log(res.message);
        }
    });
}