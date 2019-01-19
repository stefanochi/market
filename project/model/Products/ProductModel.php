<?php

include_once('model/Products/Product.php');

class ProductModel{

    private $db;

    public function __construct(){
        global $database;
        $this->db = $database;
    }

    //given a string, returns all the products that contains that string in the title
    //and satisfy the proce constraint
    public function searchProducts($search, $maxPrice, $minPrice, $descending=false){

        //default values if not specified
        if($minPrice == NULL){
            $minPrice = 0;
        }
        if($maxPrice == NULL){
            $maxPrice = PHP_INT_MAX;
        }
        if($descending == NULL){
            $descending = false;
        }

        $stmt =  $this->db->prepare(
            "SELECT Products.ID, title, description, price, ownerID, Users.username AS ownerName, Products.image AS image, sold
             FROM Products JOIN Users ON ownerID = Users.ID
             WHERE title LIKE :search AND sold=FALSE AND price >= :minPrice AND price <= :maxPrice
             ORDER BY price " . ($descending ? "DESC" : "ASC") //sort products based on their price
        );
        $stmt->bindValue(':minPrice', (int) $minPrice, PDO::PARAM_INT);
        $stmt->bindValue(':maxPrice', (int) $maxPrice, PDO::PARAM_INT);
        $stmt-> bindValue(':search', "%" . $search . "%");
        $res = $stmt->execute();
        if(!$res){
            throw new Exception("Could't search products" . $this->db->errorInfo()[0]);
        }
        $products = $stmt->fetchAll();

        //create an array containing all the products corresponding to the search parameters
        $result = array();
        foreach($products as $product){
            array_push($result, new Product(
                $product['ID'],
                $product['title'],
                $product['description'],
                $product['price'],  
                $product['ownerID'],
                $product['ownerName'],
                $product['image'],
                $product['sold']
            ));
        }

        return $result;
    }

    //if the data passed is valid,
    //update the information of the product with id = $id
    public function updateProduct($id, $title, $price, $description, $image, $sold){
        //check if the information is valid
        if($title == ""){
            throw new Exception("title can't be ampty");
        }
        if(strlen($title) > 128){
            throw new Exception("title too long");
        }
        if($price < 0){
            throw new Exception("price value not valid");
        }
        if($description != NULL && strlen($description) > 1024){
            throw new Exception("Description too long");
        }
        if($imagen != NULL && strlen($image) > 1024){
            throw new Exception("Image url too long");
        }

        //query execution
        $stmt = $this->db->prepare(
            'UPDATE Products
             SET title=:title, price=:price, description=:description, image=:image, sold=:sold
             WHERE ID = :ID'
        );
        $stmt->bindValue(':title', $title);
        $stmt->bindValue(':price', $price, PDO::PARAM_INT);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':image', $image);
        $stmt->bindValue(':sold', (bool)$sold, PDO::PARAM_BOOL);
        $stmt->bindValue(':ID', $id);
        $res = $stmt->execute();
        
        //throws an exception if insertion fails
        if(!$res){
            throw new Exception("error updating product");
        }
    }
    
    //given the information about the product
    //insert a new products in the database
    public function addProduct($title, $price, $ownerID, $description="", $image=""){
        //check if the information is valid
        if($title == ""){
            throw new Exception("title can't be ampty");
        }
        if(strlen($title) > 128){
            throw new Exception("title too long");
        }
        if($price < 0){
            throw new Exception("price can't be less than zero");
        }
        if(strlen($image) > 1024){
            throw new Exception("image url too long");
        }
        if(strlen($description) > 1024){
            throw new Exception("description too long");
        }

        //query execution
        $stmt = $this->db->prepare(
            'INSERT INTO Products (title, price, ownerID, description, image)
             VALUES (?, ?, ?, ?, ?)'
        );
        $res = $stmt->execute([$title, $price, $ownerID, $description, $image]);
        //throws an exception if insertion fails
        if(!$res){
            throw new Exception("error inserting product " . $this->db->errorInfo()[0]);
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

    //given a product id, returns the information about that product is it exists
    public function getProductByID($productID){
        $stmt = $this->db->prepare(
            'SELECT Products.ID, title, description, price, ownerID, Users.username AS ownerName, Products.image AS image, sold
            FROM Products JOIN Users ON ownerID = Users.ID
            WHERE Products.ID = ?');
        $res = $stmt->execute([$productID]);
        if(!$res){
            throw new Exception("getProductByID(): something went wrong");
        }
        
        $product = $stmt->fetch();

        if(!isset($product)){
            throw new Exception("getProductByID(): id not found");
        }

        //return a new instance of Product
        return new Product(
            $product['ID'],
            $product['title'],
            $product['description'],
            $product['price'],
            $product['ownerID'],
            $product['ownerName'],
            $product['image'],
            $product['sold']
        );
    }

    //given an user id
    //returns an array containing the products by that user
    public function getAllProductsByUserID($ownerID){
        $stmt = $this->db->prepare(
            'SELECT Products.ID, title, description, price, ownerID, Users.username AS ownerName, Products.image AS image, sold
            FROM Products JOIN Users ON ownerID = Users.ID
            WHERE ownerID = ?');
        $res = $stmt->execute([$ownerID]);
        if(!$res){
            throw new Exception("Couldn't load the products");
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
                $product['ownerName'],
                $product['image'],
                $product['sold']
            ));
        }

        return $result;
    }
}

?>