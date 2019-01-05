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
            Cart.init();
            profileID = requestedProfile;
            loadProfile(function(){
                showProfile();
                Products.loadProductsByUserID(profileID);
                Review.init(profileID);
            });
        }
        
    }

    //request the profile information
    function loadProfile(callback){
        //if we request the profile of the logged user we already have the information
        if(profileID == loggedUser.info.ID){
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
                    //otherwise return to login page
                    Router.navigate('#login');
                }
            });
        }
        
    }

    //show the profile page
    function showProfile(){
        console.log('showing profile');
        var source = $('#profile_template').html();
        var template = Handlebars.compile(source);
        var context = user;
        var html = template(context);
        $('.main').html(html);

        setProfileListeners();
    }

    //set the listeners for the profile
    function setProfileListeners(){
    
        $('#products_button').click(function(){
            Router.navigate('#products/user/' + profileID);
        });
    }

    //only the init function can be called from the outside
    return {
        init: init
    }

}());