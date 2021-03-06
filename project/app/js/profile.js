//code for showing and editing the profile

var Profile = (function(){

    var profileID;
    var user;
    
    function init(requestedProfile){
        //empty the content of the page to be replaced
        $('.main').html("");
        if(!requestedProfile){
            if(loggedUser.info){
                //if no user is specified and the user is logged in
                //go to the profile of the logged user
                Router.navigate('#profile/'+loggedUser.info.ID);
            }else{
                //otherwise go to hte login page
                Router.navigate('#login');
            }
        }else{
            //the user requested a specific profile
            //Cart.init();
            profileID = requestedProfile;
            loadProfile(function(){
                showProfile();
                Products.init(profileID);
                Review.init(profileID);
            });
        }
        
    }

    //request the profile information
    function loadProfile(callback){
        //if we request the profile of the logged user we already have the information
        if(loggedUser.info && profileID == loggedUser.info.ID){
            user = loggedUser.info;
            callback();
        }else{
            var payload  = profileID ? {id: profileID} : {};
            $.get('ajax/profile', payload, function(res){
                if(res.state == 0){
                    //if the request was successful, show the profile
                    user = res.data;
                    callback();
                }else{
                    //show an error to the user
                    showError(res.message);
                    //otherwise return to login page
                    Router.navigate('#login');
                }
            });
        }
        
    }

    //show the profile page
    function showProfile(){
        //compile the html for the profile with handlebars
        var source = $('#profile_template').html();
        var template = Handlebars.compile(source);
        var context = user;
        var html = template(context);
        $('.main').html(html);

        //hide the advanced search div
        $('#advancedSearch_div').addClass('hidden');

        if(loggedUser.info && profileID == loggedUser.info.ID){
            enableEditProfile();
        }
    }

    //if the user is viewing his own profile, allow him to edit the information
    function enableEditProfile(){
        //show the button to edit the profile
        $('#editProfile_button').removeClass('hidden');
        //set the listener for the button
        $('#editProfile_button').click(function(){
            showEditProfileForm();
        });

        $('#editProfile_modal *').off();

        //listener for closing the new review window
        $('#editProfile_modal .close').click(function(){
            removeEditProfileForm();
        });
        $('#editProfile_modal .cancel').click(function(){
            removeEditProfileForm();
        });
        //listener for save
        $('#editProfile_save').click(function(e){
            e.preventDefault();

            var username = $('#editProfile_username').val();
            var email = $('#editProfile_email').val();
            var image = $('#editProfile_image').val();
            var info = $('#editProfile_info').val();

            updateProfileInfo(username, email, image, info);

            removeEditProfileForm();
        })
    }

    function showEditProfileForm(){
        $('#editProfile_modal').removeClass('hidden');

        //ensure that the text fields are empty
        $('#editProfile_username').val("");
        $('#editProfile_email').val("");
        $('#editProfile_image').val("");
        $('#editProfile_info').val("");
    }

    function removeEditProfileForm(){
        $('#editProfile_modal').addClass('hidden');
    }

    //send request to the server to update the user information with the new ones
    function updateProfileInfo(username, email, image, info){
        var payload = {
            userID: loggedUser.info.ID,
            username: username,
            email: email,
            image: image,
            info: info
        }
        $.post('ajax/profile/update', payload, function(res){
            if(res.state == 0){
                loggedUser.info = res.data;
                showMessage("Profile updated successfully");
                init(loggedUser.info.ID);
            }else{
                //show an error to the user
                showError("Could not update the profile");
            }
        });
    }

    //only the init function can be called from the outside
    return {
        init: init
    }

}());