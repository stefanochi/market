<?php
include_once('model/Users/UserModel.php');

class loginController{

    public $userModel;

    public function __construct(){
        $this->userModel = new UserModel();
    }

    public function login(){

        if(isset($_SESSION['name'])){
            $data = ['state' => 'Success'];
            
            header('Content-Type: application/json');
            echo json_encode($data);
        }

        $username = $_POST['username'];
        $password = hash('sha512', $_POST['password']);

        try{
            $user = $this->userModel->usernamePasswordExists($username, $password);
            if(isset($user)){
                session_start();
                $_SESSION['name'] = $username;
    
                $data = ['state' => 'Success',
                         'data' => [
                            'name' => $user->getUsername(),
                            'email' => $user->getEmail(),
                            'date' => $user->getDate(),
                            'ID' => $user->getID()
                            ]
                         ];
            }else{
                $data = ['state' => 'Fail',
                        'message' => 'something went wrong'];
            }
        }catch(Exception $e){
            $data = [
                'state' => 'Fail',
                'message' => $e->getMessage()
            ];
        }

        header('Content-Type: application/json');
        echo json_encode($data);
    }

    public function signup(){
        $username = $_POST['username'];
        $email    = $_POST['email'];
        $password = hash('sha512', $_POST['password']);

        try{
            //check if username and email are available
            if($this->userModel->availableUsername($username) && 
                $this->userModel->availableEmail($email)){
                    
                $user = $this->userModel->addUser($username, $password, $email);
                session_start();
                $_SESSION['name'] = $username;
                $data = ['state' => 'Success',
                        'data' => [
                            'name' => $user->getUsername(),
                            'email' => $user->getEmail(),
                            'date' => $user->getDate(),
                            'ID' => $user->getID()
                        ]];
            }else{
                $data = ['state' => 'Fail',
                         'message' => 'Username or email already in use'];
            }
        }catch(Exception $e){
            $data = ['state' => 'Fail',
                     'message' => $e->getMessage()];
        }
        
        header('Content-Type: application/json');
        echo json_encode($data);
    }

    public function logout(){
        session_start();
        session_unset();
        session_destroy();

        echo 'Deleted';
    }
}
?>