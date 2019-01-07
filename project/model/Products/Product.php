<?php

class Product implements JsonSerializable{
    
    private $id;
    private $title;
    private $ownerID;
    private $ownerName;
    private $price;
    private $offers;
    private $description;
    private $image;
    private $sold;

    public function __construct($id, $title, $description, $price, $ownerID, $ownerName, $image="", $sold=false){
        $this->id = $id;
        $this->title = $title;
        $this->price = $price;
        $this->description = $description;
        $this->ownerID = $ownerID;
        $this->ownerName = $ownerName;
        $this->image = $image;
        $this->sold = (bool)$sold;
    }

    public function jsonSerialize(){
        return [
            'ID' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'ownerID' => $this->ownerID,
            'ownerName' => $this->ownerName,
            'image' => $this->image,
            'sold' => $this->sold
        ];
    }

    public function getID(){
        return $this->id;
    }

    public function setTitle($title){
        $this->title = $title;
    }

    public function getTitle(){
        return $this->title;
    }

    public function getDescription(){
        return $this->description;
    }

    public function getImage(){
        return $this->image;
    }

    //change the price of the product, can't be less than zero
    public function setPrice($price){
        $this->price = $price;
    }

    public function getPrice(){
        return $this->price;
    }

    //add an offer to the list of offers
    public function addOffer($offer){
        array_push($offers, $offer);
    }

    public function getOwnerID(){
        return $this->ownerID;
    }

    public function setOwner($ownerID){
        $this->ownerID = $ownerID;
    }

    public function setImage($image){
        $this->image = $image;
    }

    public function getSold(){
        return $this->sold;
    }

}

?>