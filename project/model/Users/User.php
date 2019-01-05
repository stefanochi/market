<?php

class User implements JsonSerializable{

    private $id;
    private $username;
    private $email;
    private $date;
    private $rating;
    private $image;
    private $info;

    public function __construct($id, $username, $email, $date, $rating=0, $image="", $info=""){
        $this->id = $id;
        $this->username = $username;
        $this->email = $email;
        $this->date = $date;
        $this->rating = $rating;
        $this->image = $image;
        $this->info = $info;
    }

    public function jsonSerialize(){
        return [
            'ID' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'date' => $this->date,
            'rating' => $this->rating,
            'image' => $this->image,
            'info' => $this->info
        ];
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