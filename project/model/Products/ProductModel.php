<?php

include_once('model/Products/Product.php');

class ProductModel{

    private $db;

    public function __construct(){
        global $database;
        $this->db = $database;
    }

    public function searchProducts($search){
        $stmt =  $this->db->prepare(
            "SELECT * 
             FROM Products
             WHERE title LIKE ? AND sold=FALSE"
        );
        $res = $stmt->execute(["%" . $search . "%"]);
        if(!$res){
            throw new Exception("searchProducts(): something went wrong");
        }
        $products = $stmt->fetchAll();
        $result = array();
        foreach($products as $product){
            array_push($result, new Product(
                $product['ID'],
                $product['title'],
                $product['description'],
                $product['price'],  
                $product['ownerID'],
                $product['image'],
                $product['sold']
            ));
        }

        return $result;
    }

    public function updateProduct($id, $title, $price, $ownerID, $description, $image, $sold){
        //check if the information is valid
        if($title == ""){
            throw new Exception("updateProduct(): title can't be ampty");
        }
        if(strlen($title) > 128){
            throw new Exception("updateProduct(): title too long");
        }
        if($price < 0){
            throw new Exception("updaeProduct(): price can't be less than zero");
        }

        //query execution
        $stmt = $this->db->prepare(
            'UPDATE Products
             SET title=?, price=?, description=?, image=?
             WHERE ID = ?'
        );
        $res = $stmt->execute([$title, $price, $description, $image, $id]);
        //throws an exception if insertion fails
        if(!$res){
            throw new Exception("updateProduct(): error updating product " . $this->db->errorInfo()[0]);
        }
    }
    
    public function addProduct($title, $price, $ownerID, $description="", $image=""){

        //we assume that the ownerID has already been checked

        //check if the information is valid
        if($title == ""){
            throw new Exception("addProduct(): title can't be ampty");
        }
        if(strlen($title) > 128){
            throw new Exception("addProduct(): title too long");
        }
        if($price < 0){
            throw new Exception("addProduct(): price can't be less than zero");
        }
        if(strlen($image) > 1024){
            throw new Exception("addProduct(): image url too long");
        }
        if(strlen($description) > 1024){
            throw new Exception("addProduct(): image url too long");
        }

        //query execution
        $stmt = $this->db->prepare(
            'INSERT INTO Products (title, price, ownerID, description, image)
             VALUES (?, ?, ?, ?, ?)'
        );
        $res = $stmt->execute([$title, $price, $ownerID, $description, $image]);
        //throws an exception if insertion fails
        if(!$res){
            throw new Exception("addProduct(): error inserting product " . $this->db->errorInfo()[0]);
        }
    }

    public function deleteProduct($productID){
         //query execution
         $stmt = $this->db->prepare(
            'DELETE FROM Products
             WHERE ID = ?'
        );
        $res = $stmt->execute([$productID]);
        //throws an exception if insertion fails
        if(!$res){
            throw new Exception("deleteProduct(): error deleting product " . $this->db->errorInfo()[0]);
        }
    }

    public function getProductByID($productID){
        $stmt = $this->db->prepare(
            'SELECT *
            FROM Products
            WHERE ID = ?');
        $res = $stmt->execute([$productID]);
        if(!$res){
            throw new Exception("getProductByID(): something went wrong");
        }
        
        $product = $stmt->fetch();

        if(!isset($product)){
            throw new Exception("getProductByID(): id not found");
        }

        return new Product(
            $product['ID'],
            $product['title'],
            $product['description'],
            $product['price'],
            $product['ownerID'],
            $product['image'],
            $product['sold']
        );
    }

    public function getAllProductsByUserID($ownerID){
        $stmt = $this->db->prepare(
            'SELECT *
            FROM Products
            WHERE ownerID = ?');
        $res = $stmt->execute([$ownerID]);
        if(!$res){
            throw new Exception("getAllProductsByUserID(): something went wrong");
        }
        $products = $stmt->fetchAll();
        $result = array();
        foreach($products as $product){
            array_push($result, new Product(
                $product['ID'],
                $product['title'],
                $product['description'],
                $product['price'],  
                $product['ownerID'],
                $product['image'],
                $product['sold']
            ));
        }

        return $result;
    }
}

?>