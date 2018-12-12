<?php
include_once('model/Model.php');

class userController{

    public $model;

    public function __construct(){
        $this->model = new Model();
    }

    public function login(){

        if(isset($_SESSION['name'])){
            $data = ['state' => 'Success'];
            
            header('Content-Type: application/json');
            echo json_encode($data);
            
            return true;
        }

        $username = $_POST['username'];
        $password = $_POST['password'];

        if(!isset($username) || !isset($password)){
            $data = ['state' => 'Fail'];
            
            header('Content-Type: application/json');
            echo json_encode($data);

            return true;
        }

        $user = $this->model->getUser($username, $password);

        if(isset($user)){
            session_start();
            $_SESSION['name'] = $username;

            $data = ['state' => 'Success',
                     'name' => $user->name,
                     'email' => $user->email];
            
            header('Content-Type: application/json');
            echo json_encode($data);

            return true;
        }

        $data = ['state' => 'Fail'];

        header('Content-Type: application/json');
        echo json_encode($data);
        
        return false;
    }

    public function signup(){
        $username = $_POST['username'];
        $email    = $_POST['email'];
        $password = $_POST['password'];

        if($this->model->userExists($username, $email)){
            //if a user with the same username exists
            //return failure
            $data = ['state' => 'Fail',
                     'message'=> 'The username is already in use'];
        }elseif($this->model->addUser($username, $password, $email)){
            //otherwise add the user to the database and send success
            session_start();
            $_SESSION['name'] = $username;
            $data = ['state' => 'Success'];
        }else{
            $data = ['state' => 'Fail',
                     'message' => 'Something went wrong when adding the user'];
        }

        header('Content-Type: application/json');
        echo json_encode($data);
    }
}
?>