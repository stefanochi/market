<?php

include_once('model/Carts/CartModel.php');

class CartController{
    
    public $cartModel;

    public function __construct(){
        $this->cartModel = new CartModel();
    }

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

        //add the products
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
}
?>