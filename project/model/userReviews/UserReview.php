<?php 

class UserReview implements JsonSerializable{

    private $writerID;
    private $reviewedID;
    private $text;
    private $rating;
    private $pub_date;
    
    public function __construct($writerID, $reviewedID, $rating, $pub_date, $text=""){
        $this->writerID = $writerID;
        $this->reviewedID = $reviewedID;
        $this->rating = $rating;
        $this->pub_date = $pub_date;
        $this->text = $text;
    }

    public function jsonSerialize(){
        return [
            'writerID' => $this->writerID,
            'reviewedID' => $this->reviewedID,
            'rating' => $this->rating,
            'pub_date' => $this->pub_date,
            'text' => $this->text
        ];
    }

    public function getReviewedID(){
        return $this->reviewedID;
    }
    public function getWriterID(){
        return $this->writerID;
    }
    public function getPubDate(){
        return $this->pub_date;
    }
}
?>