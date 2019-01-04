<?php

class UserReviewModel{

    private $db;

    public function __construct(){
        global $database;
        $this->db = $database;
    }

    //add a review for one user
    //a user can review the same user only once (database key)
    //TOTO
    //a user can review another only they have purchased someting from them
    public function addReview($writerID, $reviewedID, $rating, $text=""){
        if($writerID === NULL || $reviewedID === NULL || $rating === NULL){
            throw new Exception("data not valid");
        }
        //rating must be an integer between 0 and 5
        if($rating > 5 || $rating < 0){
            throw new Exception("Rating must be a number between 0 and 5");
        }

        $stmt = $this->db->prepare(
            'INSERT INTO userReviews (writerID, reviewedID, rating, pub_date, text)
            VALUES (?, ?, ?, ?, ?)'
        );
        $res = $stmt->execute([$writerID, $reviewedID, $rating, date('Y-m-d'), $text]);

        if(!$res){
            throw new Exception("error adding review");
        }
        //if the addition was successful return all the reviews
        return $this->getUserReviews($reviewedID);
    }

    //remove a review
    //throws an exceptin if fail
    public function removeReview($writerID, $reviewedID){
        if($writerID === NULL || $reviewedID === NULL){
            throw new Exception("data not valid");
        }

        $stmt = $this->db->prepare(
            'DELETE FROM userReviews
             WHERE writerID = ? AND reviewedID = ?'
        );
        $res = $stmt->execute([$writerID, $reviewedID]);

        if(!$res){
            throw new Exception("error removing review");
        }

        //if the removal is successful, return all the reviews of that user
        return $this->getUserReviews($reviewedID);

    }

    //get all the reviews that one user received
    public function getUserReviews($reviewedID){
        if($reviewedID === NULL){
            throw new Exception("data not valid");
        }
        $stmt = $this->db->prepare(
            'SELECT writerID, username, reviewedID, userReviews.rating, pub_date, text
             FROM userReviews JOIN Users ON writerID = ID
             WHERE reviewedID = ?'
        );
        $res = $stmt->execute([$reviewedID]);

        if(!$res){
            throw new Exception("no reviews");
        }

        //return an array of reviews
        $reviews = $stmt->fetchAll();
        $result = array();
        foreach($reviews as $review){
            array_push($result, new UserReview(
                $review['writerID'],
                $review['username'],
                $review['reviewedID'],
                $review['rating'],
                $review['pub_date'],
                $review['text']
            ));
        }
        return $result;
        
    }
}

?>