<?php

include_once('model/Carts/CartModel.php');

class CartController{
    
    public $cartModel;

    public function __construct(){
        $this->cartModel = new CartModel();
    }
    
    //if the user is logged in add the product with the specified user to the cart
    //POST parameters: productID, userID
    public function addItemToCart(){
        session_start();
        //check if the user is logged in
        if(!isset($_SESSION['ID'])){
            return new Response(1, "You must be logged in");
        }
        //check if the user if modifying his own cart
        if($_POST['userID'] != $_SESSION['ID']){
            return new Response(1, "You don't have the permissions");
        }

        //add the products
        try{
            $products = $this->cartModel->addItemToCart(
                $_POST['productID'],
                $_POST['userID']
            );
            //return the list of products in the cart
            return new Response(0, "Successfully added, list of products in cart", $products);

        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
    }

    //if the user has the permission, remove a product from the cart
    public function removeItemFromCart(){
        session_start();
        //check if the user is logged in
        if(!isset($_SESSION['ID'])){
            return new Response(1, "You must be logged in");
        }
        //check if the user if modifying his own cart
        if($_POST['userID'] != $_SESSION['ID']){
            return new Response(1, "You don't have the permissions");
        }

        //remove the products
        try{
            $products = $this->cartModel->removeItemFromCart(
                $_POST['productID'],
                $_POST['userID']
            );
            //return the list of products in the cart
            return new Response(0, "Successfully removed, list of products in cart", $products);

        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
    }

    //if the user is authenticated and he is trying to access his own cart
    //return the information about all the products in the cart 
    public function getCart(){
        session_start();
        //check if the user is logged in
        if(!isset($_SESSION['ID'])){
            return new Response(1, "You must be logged in");
        }
        //check if the user if modifying his own cart
        if($_GET['userID'] != $_SESSION['ID']){
            return new Response(1, "You don't have the permissions");
        }

        //add the products
        try{
            $products = $this->cartModel->getCart($_GET['userID']);
            //return the list of products in the cart
            return new Response(0, "List of products in cart", $products);

        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
    }
        
    //set all the products in the cart of the user to sold
    //and remove all the products from the cart
    public function buyProductsInCart(){
        session_start();
        //check if the user is logged in
        if(!isset($_SESSION['ID'])){
            return new Response(1, "You must be logged in");
        }
        //check if the user if modifying his own cart
        if($_POST['userID'] != $_SESSION['ID']){
            return new Response(1, "You don't have the permissions");
        }

        //set the products to bought and delete from other carts
        try{
            $products = $this->cartModel->buyProductsInCart($_POST['userID']);

            return new Response(0, "Products bought successfully", $products);
        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
    }
}
?>