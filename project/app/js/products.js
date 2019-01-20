//code for showing and managing the products
var Products = (function(){

    var userID;
    var products;

    //initialize the product section and show the products from the specified user
    function init(requestedID){
        //set listeners for the button to add a product
        $('#addProduct_button').click(showAddProductForm);

        //removes previuos listeners
        $("#addProduct_modal *").off();
        $("#updateProduct_modal *").off();

        //listeners for the window to add a new product
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

        //set listeners for the advanced search
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

        //request products from the server
        loadProductsByUserID(requestedID);
    }

    //get all the products of the specified user
    function loadProductsByUserID(requestedID){
        userID = requestedID;
        if(!userID){
            //if no userID is specified, navigate to the login page
            //if the user is already logged in, he will be redirected to his profile page
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
        
        //generate the html for each products
        var source = $('#product_template').html();
        var template = Handlebars.compile(source); //compile with handlebars
        for(var i=0; i<products.length; i++){
            var context = products[i];
            var html = template(context);//generate the html with the data
            
            //append the html to the list of products
            $('#productList_div').append(html);
            
            //for each products check if the current user is the product's owner and chose which buttons to show
            if(loggedUser.info && loggedUser.info.ID == products[i].ownerID){
                //show delete and update button if the product is sold by the current user
                $('#' + products[i].ID + ' .product_delete').removeClass('hidden');
                $('#' + products[i].ID + ' .product_update').removeClass('hidden');
            }else{
                //show to button to add to the cart if another user is watching the product
                $('#' + products[i].ID + ' .product_addToCart').removeClass('hidden');
            }

            //drag and drop functionality to add product to the cart
            $("#" + products[i].ID).attr('draggable', 'True');
            $("#" + products[i].ID).on('dragstart', function(e){
                e.originalEvent.dataTransfer.setData("product", e.target.id);
            });
        }
        
        //if the user if watching his own profile page and he is logged in show the button to
        //add a new product
        if(loggedUser.info && loggedUser.info.ID == userID){
            $('#addProduct_button').removeClass('hidden');
        }
    }
    
    //set the listeners for the buttons in the products just added to the page
    function setListenersProducts(){
        //delete a product
        $('.product_delete').click(function(e){
            var productID = $(e.target).parent().parent().attr('id');
            showDeleteConfirmation(productID);
        });
        //update a product
        $('.product_update').click(function(e){
            //pass the id of the product to update to the function
            var productID = $(e.target).parent().parent().attr('id');
            showUpdateProductForm(productID);
        });
        //add a product to the cart
        $('.product_addToCart').click(function(e){
            var productID = $(e.target).parent().parent().attr('id');
            Cart.addProductToCart(productID);
        });
    }

    //show the confirmation window for deleting a product
    function showDeleteConfirmation(productID){
        //attach the product id to the element to know which element to delete
        $("#confirmDelete_modal").data("productID", productID);
        //show the confirmation window
        $('#confirmDelete_modal').removeClass('hidden');

        //remove previous handlers and set again the handler form the confirmation window
        $('#confirmDelete_modal .confirm').off();
        $('#confirmDelete_modal .close').off();
        $('#confirmDelete_modal .cancel').off();

        //set the listeners for the confirmation window
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

    //hide the confirmation window
    function hideDeleteConfirmation(){
        $('#confirmDelete_modal').data("productID", null);
        $('#confirmDelete_modal').addClass('hidden');
    }
    
    //send request to the server to delete a product
    function deletProduct(productID){
        $.post('/project/ajax/products/delete', {productID: productID}, function(res){
            if(res.state == 0){
                showMessage("Product removed successfully");
                loadProductsByUserID(loggedUser.info.ID); //reload the products
            }else{
                showError("Could not remove the product");
            }
        });   
    }

    //show the window to update a product
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
            $('.updateProduct_sold[value=sold]').attr("checked", true);
        }else{
            $('.updateProduct_sold[value=available]').attr("checked", true);
        }
    }

    //send the request to the server to update the information of a product
    function updateProduct(){
        //get the new values
        var ID = $("#updateProduct_id").val();
        var title = $("#updateProduct_title").val();
        var price = $("#updateProduct_price").val();
        var description = $("#updateProduct_description").val();
        var image = $("#updateProduct_image").val();
        var sold = $('.updateProduct_sold[value=sold]').prop('checked') ? 1 : 0;

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
    
    //show the window to add a product
    function showAddProductForm(){
        //show the window
        $('#addProduct_modal').removeClass('hidden');
        
        //empty the text fields
        $('#product_title').val("");
        $('#product_price').val("");
        $('#product_description').val("");
        $('#product_image').val("");
        
    }

    //hide the window to add a product
    function removeAddProductForm(){
        $('#addProduct_modal').addClass('hidden');
    }
    
    //send request to the server to add a product
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
                loadProductsByUserID(loggedUser.info.ID); //reload the products
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