<?php 

class UserReview implements JsonSerializable{

    private $writerID;
    private $writerUsername;
    private $reviewedID;
    private $text;
    private $rating;
    private $pub_date;
    private $writer_image;
    
    public function __construct($writerID, $writerUsername, $reviewedID, $rating, $pub_date, $text="", $writer_image){
        $this->writerID = $writerID;
        $this->writerUsername = $writerUsername;
        $this->reviewedID = $reviewedID;
        $this->rating = $rating;
        $this->pub_date = $pub_date;
        $this->text = $text;
        $this->writer_image = $writer_image;
    }

    public function jsonSerialize(){
        return [
            'writerID' => $this->writerID,
            'writerUsername' => $this->writerUsername,
            'reviewedID' => $this->reviewedID,
            'rating' => $this->rating,
            'pub_date' => $this->pub_date,
            'text' => $this->text,
            'writer_image' => $this->writer_image
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