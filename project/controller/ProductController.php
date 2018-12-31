<?php

include_once('model/Products/ProductModel.php');

class ProductController{

    public $productModel;

    public function __construct(){
        $this->productModel = new ProductModel();
    }

    public function updateProduct(){
        session_start();

        if(!isset($_SESSION['ID'])){
            //the user is not logged in
            return new Response(1, 'You must be logged in');
        }
            
        if(!$_POST['ownerID'] === $_SESSION['ID']){
            //the ownerID don't correspond to the logged id
            return new Response(1, "You do not have the permission");
        }

        //add the product to the database
        try{
            $this->productModel->updateProduct(
                $_POST['ID'],
                $_POST['title'],
                $_POST['price'],
                $_POST['ownerID'],
                $_POST['description'],
                $_POST['image']);
                    
            //if no exception accours return success
            return new Response(0, "Successfully updatetd");
        }catch(Exception $e){
            //something went wrong when adding the product
            //to the database
            return new Response(1, $e->getMessage());
        }
    }

    //add a prodicts to the selling list
    //a user can add a products only for himself so he must logged in
    public function addProduct(){
        session_start();

        if(!isset($_SESSION['ID'])){
            //the user is not logged in
            return new Response(1, 'You must be logged in');
        }

        //add the product to the database
        try{
            $this->productModel->addProduct(
                $_POST['title'],
                $_POST['price'],
                $_SESSION['ID'],
                $_POST['description'],
                $_POST['image']);
                    
            //if no exception accours return success
            return new Response(0, "Successfully added");
        }catch(Exception $e){
            //something went wrong when adding the product
            //to the database
            return new Response(1, $e->getMessage());
        }
    }

    public function deleteProduct(){
        session_start();
        //check if the user is logged in
        if(!isset($_SESSION['ID'])){
            return new Response(1, "You must be logged in");
        }
        //check if productID is specified
        if(!isset($_POST['productID'])){
            return new Response(1, "You must specify a product id");
        }
        try{
            //get information about the product
            $product = $this->productModel->getProductByID($_POST['productID']);
        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
        //check if the owner of the product correspond to the 
        //logged user
        if($_SESSION['ID'] != $product->getOwnerID()){
            return new Response(1, "You don't have the permissions to delete the product");
        }
        //delete the product
        
        try{
            $this->productModel->deleteProduct($product->getID());
            return new Response(0, "Successfully deleted product");
        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
    }

    //get all products from the user with id $_GET[id]
    public function getAllProducts(){
        if(!isset($_GET['id'])){
            return new Response(1, "ID not specified");
        }
        try{
            $products = $this->productModel->getAllProductsByUserID($_GET['id']);

            return new Response(0, "List of products", $products);
        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
    }

    public function searchProducts(){
        if(!isset($_GET['search'])){
            return new Response(1, "You must specify a search word");
        }
        try{
            $products = $this->productModel->searchProducts($_GET['search']);
            return new Response(0, "searched products", $products);
        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }

    }
}

?>