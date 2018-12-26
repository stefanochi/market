var Profile = (function(){

    var profileID;
    var user;
    
    function init(requestedProfile){
        //empty the content of the page to be replaced
        $('.content').html("");
        profileID = requestedProfile;
        loadProfile();
    }

    //request the profile information
    function loadProfile(){
        //if we request the profile of the logged user we already have the information
        if(profileID == loggedUser.info.ID){
            user = loggedUser.info;
            showProfile();
        }else{
            var payload  = profileID ? {id: profileID} : {};
            $.get('ajax/profile', payload, function(res){
                if(res.state == 0){
                    //if the request was successful, show the profile
                    user = res.data;
                    showProfile();
                }else{
                    //otherwise return to login page
                    Router.navigate('#login');
                }
            });
        }
        
    }

    //show the profile page
    function showProfile(){
        console.log('showing profile');
        var source = $('#home_template').html();
        var template = Handlebars.compile(source);
        var context = {username: user.username, email: user.email};
        var html = template(context);
        $('.content').html(html);

        setProfileListeners();
    }

    //set the listeners for the profile
    function setProfileListeners(){
    
        $('#products_button').click(function(){
            Router.navigate('#products/' + profileID);
        });
    }

    //only the init function can be called from the outside
    return {
        init: init
    }

}());