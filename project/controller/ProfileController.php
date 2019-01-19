<?php
include_once('model/Users/UserModel.php');
class ProfileController{
    public $userModel;

    public function __construct(){
        $this->userModel = new UserModel();
    }

    //POST parameters: userID, username, email, image, info
    //if the user has the permission, modify the user's information
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
        //update information in the database
        try{
            $profile = $this->userModel->editUser(
                $_POST['userID'],
                $_POST['username'],
                $_POST['email'],
                $_POST['image'],
                $_POST['info']
            );

            return new Response(0, "Successfully updated profile", $profile);
        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
    }

    //if the request specifies an id with GET returns the information 
    //about the corresponding user, if it exists
    //if no id is specified, but the a session is open, returns the information
    //about the logged user
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
        //no user specified
        if(isset($_SESSION['ID'])){
            try{
                $user = $this->userModel->getUserByID($_SESSION['ID']);
                return new Response(0, 'User info', $user);
            }catch(Exception $e){
                return new Response(1, $e->getMessage());
            }
        }
        //if no user is specified and no session is open, return error
        return new Response(1, "user id not specified");
    }
}
?>