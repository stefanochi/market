<?php

include_once('controller/loginController.php');
include_once('controller/ProfileController.php');
include_once('controller/ProductController.php');
include_once('controller/Response.php');

class Controller{

    public function __construct(){
    }

    public function invoke(){
        $fullRequest = $_SERVER['REQUEST_URI'];
        $request = strtok($fullRequest, '?');

        switch($request){
            case '/project/ajax/login':
                $loginController = new loginController();
                $res = $loginController->login();
                $res->sendResponse();
                break;
            case '/project/ajax/signup':
                $loginController = new loginController();
                $res = $loginController->signup();
                $res->sendResponse();
                break;
            case '/project/ajax/profile':
                $profileController = new ProfileController();
                $res = $profileController->sendProfile();
                $res->sendResponse();
                break;
            case '/project/ajax/logout':
                $loginController = new loginController();
                $res = $loginController->logout();
                $res->sendResponse();
                break;
            case '/project/ajax/products':
                $produtController = new ProductController();
                $res = $produtController->getAllProducts();
                $res->sendResponse();
                break;
            case '/project/ajax/products/add':
                $produtController = new ProductController();
                $res = $produtController->addProduct();
                $res->sendResponse();
                break;
            case '/project/ajax/products/delete':
                $produtController = new ProductController();
                $res = $produtController->deleteProduct();
                $res->sendResponse();
                break;
            case '/project/ajax/products/update':
                $produtController = new ProductController();
                $res = $produtController->updateProduct();
                $res->sendResponse();
                break;
            default:
                include 'app/index.html';
                break;
        }
    }
}

?>