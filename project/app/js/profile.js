function showProfile(profileUser){
    console.log('showing profile');
    var source = $('#home_template').html();
    var template = Handlebars.compile(source);
    var context = {username: profileUser.username, email: profileUser.email};
    var html = template(context);
    $('.content').html(html);

    if(user && user.ID == profileUser.ID){
        $('#logout_button').removeClass("hidden");
    }

    setProfileListeners(profileUser.ID);
}

function loadProfile(profileID){
    var payload  = profileID ? {id: profileID} : {};
    $.get('ajax/profile', payload, function(res){
        if(res.state == 0){
            //if the user is logged in, return the information
            console.log('user is logged in, showing profile');
            showProfile(res.data);
        }else{
            //the user is not logged in, or something else went wrong
            //go to login page
            console.log("not logged in, redirect to login");
            Router.navigate('#login');
        }
    });
}

function setProfileListeners(id){
    $('#logout_button').click(function(){
        $.get('ajax/logout', function(res){
            document.cookie =  'PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            Router.navigate('#login');
        });
        user = null;
    });

    $('#products_button').click(function(){
        Router.navigate('#products/' + id);
    });
}