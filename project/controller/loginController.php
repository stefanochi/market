<?php
include_once('model/Users/UserModel.php');

class loginController{

    public $userModel;

    public function __construct(){
        $this->userModel = new UserModel();
    }

    public function login(){

        if(isset($_SESSION['name'])){
            return new Response(
                0, 
                "Already logged in", 
                $this->userModel->getUserByUsername($_SESSION['name']));
        }
        $username = $_POST['username'];
        $password = hash('sha512', $_POST['password']);

        try{
            $user = $this->userModel->usernamePasswordExists($username, $password);
            session_start();
            $_SESSION['name'] = $username;
            $_SESSION['ID'] = $user->getID();
        
            return new Response(0, "User info", $user);
        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
    }


    public function signup(){

        $username = $_POST['username'];
        $email    = $_POST['email'];
        $password = hash('sha512', $_POST['password']);

        try{
            //check if username and email are available
            if(!$this->userModel->availableUsername($username) || 
                !$this->userModel->availableEmail($email)){
                    return new Response(1, "Username or Email already in use");

            }
                    
            $user = $this->userModel->addUser($username, $password, $email);
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

        return new Response(0, "Logouy successful");
    }
}
?>