<?php
include_once('model/Users/UserModel.php');
class ProfileController{
    public $userModel;

    public function __construct(){
        $this->userModel = new UserModel();
    }

    public function sendProfile(){
        session_start();
        if(isset($_GET['id'])){
            try{
                $user = $this->userModel->getUserByID($_GET['id']);
                return new Response(0, 'User info', $user);
            }catch(Exception $e){
                return new Response(1, $e->getMessage());
            }
        }

        if(isset($_SESSION['ID'])){
            try{
                $user = $this->userModel->getUserByID($_SESSION['ID']);
                return new Response(0, 'User info', $user);
            }catch(Exception $e){
                return new Response(1, $e->getMessage());
            }
        }
        return new Response(1, "user id not specified");
    }
}
?>