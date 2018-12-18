<?php

include_once('controller/loginController.php');
include_once('controller/ProfileController.php');
include_once('controller/ProductController.php');

class Controller{

    public function __construct(){
    }

    public function invoke(){
        $fullRequest = $_SERVER['REQUEST_URI'];
        $request = strtok($fullRequest, '?');

        switch($request){
            case '/project/ajax/login.php':
                $loginController = new loginController();
                $loginController->login();
                break;
            case '/project/ajax/signup.php':
                $loginController = new loginController();
                $loginController->signup();
                break;
            case '/project/ajax/profile.php':
                $profileController = new ProfileController();
                $profileController->sendProfile();
                break;
            case '/project/ajax/logout.php':
                $loginController = new loginController();
                $loginController->logout();
                break;
            case '/project/ajax/products/':
                $produtController = new ProductController();
                $produtController->getAllProducts();
                break;
            default:
                include 'app/index.html';
                break;
        }
    }
}

?>