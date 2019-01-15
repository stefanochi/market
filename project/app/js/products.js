var Products = (function(){

    var userID;
    var products;

    function init(requestedID){
        //setListeners
        $('#addProduct_button').click(showAddProductForm);

        $("#addProduct_modal *").off();
        $("#updateProduct_modal *").off();

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

        //set listeners for the update window
        $('#updateProduct_modal .close').click(function(){
            //hide the window
            $('#updateProduct_modal').addClass('hidden');
        });
        $('#updateProduct_modal .cancel').click(function(){
            //hide the window
            $('#updateProduct_modal').addClass('hidden');
        });
        $('#updateProduct_modal .confirm').click(function(){
            //send requet to the server to update the product
            updateProduct();
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

        //show the advanced search div
        $('#advancedSearch_div').removeClass('hidden');

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
        $('.product_delete').click(function(e){
            var productID = $(e.target).parent().parent().attr('id');
            showDeleteConfirmation(productID);
        });
        $('.product_update').click(function(e){
            //pass the id of the product to update to the function
            var productID = $(e.target).parent().parent().attr('id');
            showUpdateProductForm(productID);
        });

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

    function showDeleteConfirmation(productID){
        //attach the product id to the element to know which element to delete
        $("#confirmDelete_modal").data("productID", productID);
        //show the confirmation window
        $('#confirmDelete_modal').removeClass('hidden');

        //remove previous handlers and set again the handler form the confirmation window
        $('#confirmDelete_modal .confirm').off();
        $('#confirmDelete_modal .close').off();
        $('#confirmDelete_modal .cancel').off();

        $('#confirmDelete_modal .confirm').click(function(){
            var productID = $('#confirmDelete_modal').data().productID;
            deletProduct(productID);
            hideDeleteConfirmation();
        });

        $('#confirmDelete_modal .cancel').click(function(){
            hideDeleteConfirmation();
        });
        $('#confirmDelete_modal .close').click(function(){
            hideDeleteConfirmation();
        });
    }

    function hideDeleteConfirmation(){
        $('#confirmDelete_modal').data("productID", null);
        $('#confirmDelete_modal').addClass('hidden');
    }
    
    function deletProduct(productID){
        $.post('/project/ajax/products/delete', {productID: productID}, function(res){
            if(res.state == 0){
                showMessage("Product removed successfully");
                loadProductsByUserID(loggedUser.info.ID);
            }else{
                showError("Could not remove the product");
            }
        });   
    }

    function showUpdateProductForm(productID){
        //get the current values for the product
        for(var i=0; i<products.length; i++){
            if(products[i].ID == productID){
                var productInfo = products[i];
            }
        }
        //show the update window
        $('#updateProduct_modal').removeClass('hidden');
        
        //set the values in the window
        
        $("#updateProduct_id").val(productInfo.ID); //store the id of the product inside an hidden element
        $("#updateProduct_title").val(productInfo.title);
        $("#updateProduct_price").val(productInfo.price);
        $("#updateProduct_description").val(productInfo.description);
        $("#updateProduct_image").val(productInfo.image);
        if(productInfo.sold){
            $('#updateProduct_sold[value=sold]').attr("checked", true);
        }else{
            $('#updateProduct_sold[value=available]').attr("checked", true);
        }
    }

    function updateProduct(){
        //get the new values
        var ID = $("#updateProduct_id").val();
        var title = $("#updateProduct_title").val();
        var price = $("#updateProduct_price").val();
        var description = $("#updateProduct_description").val();
        var image = $("#updateProduct_image").val();
        var sold = $('#updateProduct_sold[value=sold]').prop('checked') ? 1 : 0;

        var payload = {
            ID: ID,
            title: title,
            description: description,
            image: image,
            price: price,
            sold: sold
        }

        //send request to the server
        $.post('ajax/products/update', payload, function(res){
            if(res.state == 0){
                showMessage("Product updated successfully");
            }else{
                showError(res.message);
            }
        });

        //close the window
        $('#updateProduct_modal').addClass('hidden');

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