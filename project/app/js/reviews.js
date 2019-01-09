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

    function enableAddReview(){
        //show the button to add the review
        $('#addReview_button').removeClass('hidden');
        //set the listener for the button
        $('#addReview_button').click(function(){
            showAddReviewForm();
        });
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

    function showAddReviewForm(){
        //show the form
        $('#addReview_modal').removeClass('hidden');

        //ensure that the text fields are empty
        $('#addReview_text').val("");
        $('#addReview_rating').val("");
    }

    function removeAddReviewForm(){
        $('#addReview_modal').addClass('hidden');
    }

    function sendReview(text, rating){
        if(loggedUser.info){
            var payload = {
                writerID: loggedUser.info.ID,
                reviewedID: reviewedID,
                rating: rating,
                text: text
            }
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

    function loadReviews(reviewedID){
        $.get('ajax/reviews', {reviewedID: reviewedID}, function(res){
            if(res.state == 0){
                reviews = res.data;
                //TOTO organize better
                showReviews();
            }else{
                //show an error to the user
                showError("Could not load the reviews");
            }
        });
    }

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
                        var writerID = $(e.target).parent().attr('id').split('_')[1];
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