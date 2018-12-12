<?php 

    include_once('model/User.php');
    class Model{

        public $db;

        public function __construct(){
            include 'model/config.php';

            $this->db = new PDO("mysql:dbname=tweb;host=172.21.0.2;port=3306", 'root', 'Pericolo');
        }
        
        public function getUser($username, $password){
            
            $stmt = $this->db->prepare('SELECT name, email FROM Users 
                                        WHERE name =? AND password =?');
            $stmt->execute([$username, $password]);

            if($stmt->rowCount() == 1){
                $res = $stmt->fetch(); 
                $user = new User($res['name'], $res['email']);

                return $user;
            }
            return null;
            
        }

        public function userExists($username, $email){
            $stmt = $this->db->prepare('SELECT name FROM Users 
                                        WHERE name =? OR email =?');
            $stmt->execute([$username, $email]);

            if($stmt->rowCount() > 0){
                return true;
            }
            return false;
        }

        public function addUser($username, $password, $email){
            $stmt = $this->db->prepare(
                'INSERT INTO Users (name, password, email)
                 VALUES (?, ?, ?)');
            $stmt->execute([$username, $password, $email]);

            if($stmt->rowCount() > 0){
                return true;
            }
            return false;
        }
    }
?>