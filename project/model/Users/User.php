<?php

class User{

    private $id;
    private $username;
    private $email;
    private $date;
    private $rating;
    private $image;
    private $info;

    public function __construct($id, $username, $email, $date){
        $this->id = $id;
        $this->username = $username;
        $this->email = $email;
        $this->date = $date;
    }

    public function getID(){
        return $this->id;
    }

    public function getUsername(){
        return $this->username;
    }
    public function setUsername($username){
        $this->username = $username;
    }

    public function getEmail(){
        return $this->email;
    }
    public function setEmail($email){
        $this->email = $email;
    }

    public function getRating(){
        return $this->rating;
    }
    public function setRating($rating){
        $this->rating = $rating;
    }

    public function getInfo(){
        return $this->info;
    }
    public function setInfo($info){
        $this->info = $info;
    }

    public function getDate(){
        return $this->date;
    }
}

?>