<?php
include_once('model/Users/UserModel.php');
class ProfileController{
    public $userModel;

    public function __construct(){
        $this->userModel = new UserModel();
    }

    public function sendProfile(){
        if(isset($_GET['id'])){
            try{
                $user = $this->userModel->getUserByID($_GET['id']);
            }catch(Exception $e){
                $response = ['state' => 'Fail',
                             'message' => $e->getMessage()];
            }
            if(isset($user)){
                $response = ['state' => 'Success',
                            'data' => [
                                'name' => $user->getUsername(),
                                'email' => $user->getEmail(),
                                'ID' => $user->getID()]];
            }
        }else{
            $response = ['state' => 'Fail',
                         'message' => 'You must specify an user id'];
        }


        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
?>