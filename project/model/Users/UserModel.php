<?php

include_once('model/Users/User.php');
include_once('model/config.php');

class UserModel{

    private $db;
    
    public function __construct(){
        global $database;
        $this->db = $database;
    }

    public function addUser($username, $password, $email){
        if($password == "" && !isset($password)){
            throw new Exception("password can't be empty");
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

    public function usernamePasswordExists($username, $password){
        if($username == ""){
            throw new Exception("Username can't be empty");
        }
        if($password == ""){
            throw new Exception("Password can't be empty");
        }
        
        $stmt = $this->db->prepare(
            'SELECT ID, username, email, reg_date
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

    public function availableUsername($username){
        if($username == ""){
            throw new Exception("availableUsername(): Username can't be empty");
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

    public function availableEmail($email){
        if($email == ""){
            throw new Exception("availableEmail(): Email can't be empty");
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