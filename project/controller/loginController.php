<?php
include_once('model/Users/UserModel.php');

class loginController{

    public $userModel;

    public function __construct(){
        $this->userModel = new UserModel();
    }

    //takes two parameters by POST: username and passoword
    //interrogates the database, if username and password match
    //set the session's variables and send the information about the user
    public function login(){
        //if the user is already logged in, return the informationdirectly
        if(isset($_SESSION['name'])){
            return new Response(
                0, 
                "Already logged in", 
                $this->userModel->getUserByUsername($_SESSION['name']));
        }
        $username = $_POST['username'];
        //password hashing
        $password = hash('sha512', $_POST['password']);

        try{
            $user = $this->userModel->usernamePasswordExists($username, $password);
            session_start();
            $_SESSION['name'] = $username;
            $_SESSION['ID'] = $user->getID();
        
            return new Response(0, "User info", $user);
        }catch(Exception $e){
            //if the interrogation throws an exception 
            //return failure and a message associated
            return new Response(1, $e->getMessage());
        }
    }

    //takes three parameters with POST: username, password and email
    //if username and email are not already in use, adds the user to the database
    //returns the information about the user
    public function signup(){

        $username = $_POST['username'];
        $email    = $_POST['email'];
        $password = hash('sha512', $_POST['password']); //password hashing

        try{
            //check if username and email are available
            if(!$this->userModel->availableUsername($username) || 
                !$this->userModel->availableEmail($email)){
                    //if not return a failure response
                    return new Response(1, "Username or Email already in use");

            }   
            //add user to the database
            $user = $this->userModel->addUser($username, $password, $email);
            
            //start a session for the new user
            session_start();
            $_SESSION['name'] = $username;
            $_SESSION['ID'] = $user->getID();
                
            return new Response(0, "User info", $user);
        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
    }

    public function logout(){
        session_start();
        session_unset();
        session_destroy();

        return new Response(0, "Logout successful");
    }
}
?>