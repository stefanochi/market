<?php
include_once('model/Users/UserModel.php');
class ProfileController{
    public $userModel;

    public function __construct(){
        $this->userModel = new UserModel();
    }

    public function updateProfile(){
        session_start();
        //check if user is logged in
        if(!isset($_SESSION['ID'])){
            return new Response(1, "You must be logged in");
        }
        //check if user is modifying his own profile
        if($_POST['userID'] != $_SESSION['ID']){
            return new Response(1, "You don't have the permissions");
        }

        try{
            $profile = $this->userModel->editUser(
                $_POST['userID'],
                $_POST['username'],
                $_POST['email'],
                $_POST['image']
            );

            return new Response(0, "Successfully updated profile", $profile);
        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
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