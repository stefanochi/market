<?php

class Response implements JsonSerializable{

    private $state;
    private $message;
    private $data;

    public function __construct($state, $message, $data = NULL){
        $this->state = $state;
        $this->message = $message;
        $this->data = $data;
    }

    public function jsonSerialize(){
        return [
            'state' => $this->state,
            'message' => $this->message,
            'data' => $this->data
        ];
    }

    public function sendResponse(){
        header('Content-Type: application/json');
        echo json_encode($this);
    }
}

?>