<?php

include_once('model/userReviews/UserReview.php');
include_once('model/userReviews/UserReviewModel.php');

class UserReviewController{

    public $userReviewModel;

    public function __construct(){
        $this->userReviewModel = new UserReviewModel();
    }

    //if the user is logged in, add a review
    public function addReview(){
        session_start();

        //check if the user is logged in
        if(!isset($_SESSION['ID'])){
            return new Response(1, "You must be logged in");
        }
        //check if the user if modifying his own cart
        if($_POST['writerID'] != $_SESSION['ID']){
            return new Response(1, "You don't have the permissions");
        }

        //insert the review in the database
        try{
            $reviews = $this->userReviewModel->addReview(
                $_POST['writerID'],
                $_POST['reviewedID'],
                $_POST['rating'],
                $_POST['text']
            );

            return new Response(0, "Successfully added review", $reviews);
        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
    }

    //if the user is logged in remove the review
    public function removeReview(){
        session_start();

        //check if the user is logged in
        if(!isset($_SESSION['ID'])){
            return new Response(1, "You must be logged in");
        }
        //check if the user if modifying his own cart
        if($_POST['writerID'] != $_SESSION['ID']){
            return new Response(1, "You don't have the permissions");
        }

        //remove the review in the database
        try{
            $reviews = $this->userReviewModel->removeReview(
                $_POST['writerID'],
                $_POST['reviewedID']
            );

            return new Response(0, "Successfully removed review", $reviews);
        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
    }

    //get all the review of the specified user
    //don't need to be logged in to see the reviews
    public function getUserReviews(){
        try{
            $reviews = $this->userReviewModel->getUserReviews($_GET['reviewedID']);
            return new Response(0, "User reviews", $reviews);
        }catch(Exception $e){
            return new Response(1, $e->getMessage());
        }
    }
}

?>