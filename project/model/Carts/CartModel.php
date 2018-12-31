<?php
class CartModel{
    private $db;

    public function __construct(){
        global $database;
        $this->db = $database;
    }

    //insert the product in the cart of the user
    public function addItemToCart($productID, $userID){
        //check if productsID and UserID are valid
        if(!isset($productID) || $productID == ""){
            throw new Exception("productID not specified");
        }
        if(!isset($userID) || $userID == ""){
            throw new Exception("userID not specified");
        }

        $productModel = new ProductModel();
        $productInfo = $productModel->getProductByID($productID);
        if($productInfo->getOwnerID() == $userID){
            throw new Exception("can't add own product to cart");
        }

        //insert the values in the database 
        $stmt = $this->db->prepare(
            'INSERT INTO Carts (productID, userID)
             VALUES (?, ?)'
        );
        $res = $stmt->execute([$productID, $userID]);

        //if the insertion fails, throw an exception
        if(!$res){
            throw new Exception($this->db->errorInfo()[0]);
        }

        //return all the items in the cart of the user
        return $this->getCart($userID);
    }

    //remove the products from the user's cart
    public function removeItemFromCart($productID, $userID){
        //check if productsID and UserID are valid
        if(!isset($productID) || $productID == ""){
            throw new Exception("productID not specified");
        }
        if(!isset($userID) || $userID == ""){
            throw new Exception("userID not specified");
        }

        //query execution
        $stmt = $this->db->prepare(
            'DELETE FROM Carts
             WHERE productID = ? AND userID = ?'
        );
        $res = $stmt->execute([$productID, $userID]);
        //throws an exception if insertion fails
        if(!$res){
            throw new Exception("removeItemFromCart(): error deleting product" . $this->db->errorInfo()[0]);
        }

        return $this->getCart($userID);
    }

    //get all the products in the cart of the user
    public function getCart($userID){
        if(!isset($userID) || $userID == ""){
            throw new Exception("userID not specified");
        }

        //get all the products inside the user's cart
        $stmt = $this->db->prepare(
            'SELECT ID, title, description, price, image, ownerID
             FROM Products JOIN Carts ON ID = productID
             WHERE userID = ?'
        );
        $res = $stmt->execute([$userID]);
        if(!$res){
            throw new Exception("getCart(): " . $this->db->errorInfo()[0]);
        }

        //return an array of products
        $products = $stmt->fetchAll();
        $result = array();
        foreach($products as $product){
            array_push($result, new Product(
                $product['ID'],
                $product['title'],
                $product['description'],
                $product['price'],  
                $product['ownerID'],
                $product['image']
            ));
        }
        return $result;
    }
}
?>