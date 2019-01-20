<?php

include_once('model/Users/User.php');
include_once('model/config.php');

class UserModel{

    private $db;
    
    public function __construct(){
        global $database;
        $this->db = $database;
    }

    //edit the information of an existing user
    public function editUser($userID, $username, $email, $image, $info){
        //update the username
        if($username != NULL){
            $stmt = $this->db->prepare(
                'UPDATE Users
                 SET username = ?
                 WHERE ID = ?'
            );
            $res = $stmt->execute([$username, $userID]);
            if(!$res){
                throw new Exception("error updating username");
            }
        }
        //update the email
        if($email != NULL && filter_var($email, FILTER_VALIDATE_EMAIL)){
            $stmt = $this->db->prepare(
                'UPDATE Users
                 SET email = ?
                 WHERE ID = ?'
            );
            $res = $stmt->execute([$email, $userID]);
            if(!$res){
                throw new Exception("error updating email");
            }
        }
        //update the image
        if($image != NULL && filter_var($image, FILTER_VALIDATE_URL)){
            $stmt = $this->db->prepare(
                'UPDATE Users
                 SET image = ?
                 WHERE ID = ?'
            );
            $res |= $stmt->execute([$image, $userID]);
            if(!$res){
                throw new Exception("error updating image");
            }
        }
        //update info
        if($info != NULL){
            $stmt = $this->db->prepare(
                'UPDATE Users
                 SET info = :info
                 WHERE ID = :ID'
            );
            $res |= $stmt->execute([":info" => $info, ":ID" => $userID]);
            if(!$res){
                throw new Exception("error updating info");
            }
        }

        return $this->getUserByID($userID);
    }

    //after checking the validity of the data, adds the new user to the database
    //with the date of the registration
    public function addUser($username, $password, $email){
        if(($email == "" && !isset($email)) || !filter_var($email, FILTER_VALIDATE_EMAIL)){
            throw new Exception("Invalid Email");
        }
        if($username == "" && !isset($username)){
            throw new Exception("Invalid username");
        }
        if($password == "" && !isset($password)){
            throw new Exception("Invalid password");
        }
        $stmt = $this->db->prepare(
            'INSERT INTO Users (username, password, email, reg_date)
             VALUES (?, ?, ?, ?)');
        $res = $stmt->execute([$username, $password, $email, date('Y-m-d')]);

        if(!$res){
            throw new Exception($this->db->errorInfo()[0]);
        }

        return $this->getUserByUsername($username);
        
    }

    //checks if exists a user with the combination of usenrame and password specified
    //if it doesn't throw an exception
    //if it does return a new instance of User with the information about the user
    public function usernamePasswordExists($username, $password){
        if($username == ""){
            throw new Exception("Username can't be empty");
        }
        if($password == ""){
            throw new Exception("Password can't be empty");
        }
        
        $stmt = $this->db->prepare(
            'SELECT *
            FROM Users
            WHERE username = ? AND password = ?');

        $res = $stmt->execute([$username, $password]);

        if(!$res){
            throw new Exception("error in query execeution");
        }

        //if there are 2 users with the same name, throw an exception
        if($stmt->rowCount() > 1){
            throw new Exception("Two users with the same username and password");
        }
        //if the is no user with that name, throw an exception
        if($stmt->rowCount() < 1){
            throw new Exception("No user with that username and password");
        }

        $user = $stmt->fetch(); 
        return new User(
            $user['ID'],
            $user['username'], 
            $user['email'],
            $user['reg_date'],
            $user['rating'],
            $user['image'],
            $user['info']);
    }

    public function getUserByUsername($username){

        if($username == ""){
            throw new Exception("Username can't be empty");
        }
        
        $stmt = $this->db->prepare(
            'SELECT *
            FROM Users
            WHERE username = ?');

        $res = $stmt->execute([$username]);

        //if there are 2 users with the same name, throw an exception
        if($stmt->rowCount() > 1){
            throw new Exception("Two users with the same username");
        }
        //if the is no user with that name, throw an exception
        if($stmt->rowCount() < 1){
            throw new Exception("No user with that username");
        }

        $user = $stmt->fetch();
        return new User(
            $user['ID'],
            $user['username'], 
            $user['email'],
            $user['reg_date'],
            $user['rating'],
            $user['image'],
            $user['info']);

    }

    public function getUserByEmail($email){
        if($email == ""){
            throw new Exception("Email can't be empty");
        }
        
        $stmt = $this->db->prepare(
            'SELECT *
            FROM Users
            WHERE email = ?');

        $stmt->execute([$email]);

        //if there are 2 users with the same name, throw an exception
        if($stmt->rowCount() > 1){
            throw new Exception("Two users with the same email");
        }
        //if the is no user with that name, throw an exception
        if($stmt->rowCount() < 1){
            throw new Exception("No user with that email");
        }

        $user = $stmt->fetch(); 
        return new User(
            $user['ID'],
            $user['username'], 
            $user['email'],
            $user['reg_date'],
            $user['rating'],
            $user['image'],
            $user['info']);
    }

    //get the information about the user with the corresponding id
    //returns an instance of Users containing the information
    public function getUserByID($id){
        $stmt = $this->db->prepare(
            'SELECT *
            FROM Users
            WHERE ID = ?');

        $stmt->execute([$id]);

        //if there are 2 users with the same name, throw an exception
        if($stmt->rowCount() > 1){
            throw new Exception("Two users with the same id");
        }
        //if the is no user with that name, throw an exception
        if($stmt->rowCount() < 1){
            throw new Exception("No user with that id");
        }

        $user = $stmt->fetch(); 
        return new User(
            $user['ID'],
            $user['username'], 
            $user['email'],
            $user['reg_date'],
            $user['rating'],
            $user['image'],
            $user['info']);
    }

    //checks if the passed username is already in use
    public function availableUsername($username){
        if($username == ""){
            throw new Exception("Username can't be empty");
        }
        
        $stmt = $this->db->prepare(
            'SELECT ID
            FROM Users
            WHERE username = ?');

        $stmt->execute([$username]);

        //if the is no user with that name, return true
        if($stmt->rowCount() < 1){
            return true;
        }
        //otherwise return false
        return false;
    }

    //checks is the passed email is laredy in use
    public function availableEmail($email){
        if($email == ""){
            throw new Exception("Email can't be empty");
        }
        
        $stmt = $this->db->prepare(
            'SELECT ID
            FROM Users
            WHERE email = ?');

        $stmt->execute([$email]);

        //if the is no user with that name, return true
        if($stmt->rowCount() < 1){
            return true;
        }
        //otherwise return false
        return false;
    }
}

?>