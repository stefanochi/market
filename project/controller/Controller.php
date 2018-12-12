<?php

include 'controller/userAccess.php';

class Controller{
    public function __construct(){

    }

    public function invoke(){
        $request = $_SERVER['REQUEST_URI'];

        switch($request){
            case '/project/ajax/login.php':
                $userController = new userController();
                $userController->login();
                break;
            case '/project/ajax/signup.php':
                $userController = new userController();
                $userController->signup();
                break;
            default:
                include 'app/index.html';
                break;
        }
    }
}

?>