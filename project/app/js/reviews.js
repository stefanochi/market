//code for showing and managing user reviews

var Review = (function(){

    var reviews;
    var reviewedID;

    function init(ID){
        reviewedID = ID;
        if(loggedUser.info && loggedUser.info.ID != reviewedID){
            //if the user is watching someone else reviews
            //add the possibility to leave a review
            enableAddReview();
        }
        loadReviews(reviewedID);
    }

    //add the button to leave a review and set the needed listeners
    function enableAddReview(){
        //show the button to add the review
        $('#addReview_button').removeClass('hidden');
        //set the listener for the button
        $('#addReview_button').click(function(){
            showAddReviewForm();
        });

        $("#addReview_modal *").off();
        //listener for closing the new review window
        $('#addReview_modal .close').click(function(){
            removeAddReviewForm();
        });
        //listener for form submit
        $('#addReview_form').submit(function(e){
            e.preventDefault();
            //add the review
            var text = $('#addReview_text').val();
            var rating = $('#addReview_rating').val();
            sendReview(text, rating);

            removeAddReviewForm();
        });
    }

    //show the form to write a review
    function showAddReviewForm(){
        //show the form
        $('#addReview_modal').removeClass('hidden');

        //ensure that the text fields are empty
        $('#addReview_text').val("");
        $('#addReview_rating').val("");
    }

    //hide the form to write a review
    function removeAddReviewForm(){
        $('#addReview_modal').addClass('hidden');
    }

    //send the request to the server to add the review
    function sendReview(text, rating){
        if(loggedUser.info){
            var payload = {
                writerID: loggedUser.info.ID,
                reviewedID: reviewedID,
                rating: rating,
                text: text
            }
            if(rating < 0 || rating > 5){
                showError("Rating must be between 0 and 5");
            }else{
                $.post('ajax/reviews/add', payload, function(res){
                    if(res.state == 0){
                        reviews = res.data;
                        showMessage("Review added successfully");
                        showReviews();
                    }else{
                        //show an error to the user
                        showError("Could not add the review");
                    }
                });
            }
        }
        
    }

    //send the request to the server to remove the review
    function removeReview(reviewedID, writerID){
        var payload = {
            reviewedID: reviewedID,
            writerID: writerID
        }
        //send the request to the server
        $.post('ajax/reviews/remove', payload, function(res){
            if(res.state == 0){
                //if the request was successful it returns the new  lits of reviews
                reviews = res.data;
                //reprint the reviews
                showReviews();
                showMessage("Review removed successfully");
            }else{
                //show an error to the user
                showError("Could not remove the review: " + res.message);
            }
        });
    }

    //request to the server all the reviews of the specified user
    function loadReviews(reviewedID){
        $.get('ajax/reviews', {reviewedID: reviewedID}, function(res){
            if(res.state == 0){
                reviews = res.data;
                showReviews();
            }else{
                //show an error to the user
                showError("Could not load the reviews");
            }
        });
    }

    //render the reviews on the page
    function showReviews(){
        //remnove already present reviews
        $('#reviewList_div').html("");

        //show the reviews
        if(reviews){
            //compile the template
            var source = $('#review_template').html();
            var template = Handlebars.compile(source);

            for(var i=0; i<reviews.length; i++){
                var content = reviews[i];
                var html = template(content);

                $('#reviewList_div').append(html);

                if(loggedUser.info && loggedUser.info.ID == reviews[i].writerID){
                    //if the current logged user wrote the review
                    //show the button to remove the review
                    $("#review_" + reviews[i].writerID + " .remove_review").removeClass('hidden');
                    //set the listener for the button
                    $("#review_" + reviews[i].writerID + " .remove_review").click(function(e){
                        //retrive the writerID from the the div id
                        //notice: it should be the same as loggedUser.info.ID
                        var writerID = $(e.target).parent().parent().attr('id').split('_')[1];
                        removeReview(reviewedID, writerID);
                    });
                }
            }
        }
    }

    return{
        init: init
    }
}());