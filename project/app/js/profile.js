function showProfile(user){
    console.log('showing profile');
    var source = $('#home_template').html();
    var template = Handlebars.compile(source);
    var context = {username: user.name, email: user.email};
    var html = template(context);
    $('.content').html(html);

    setProfileListeners();
}

function loadProfile(ctx){
    $.get('ajax/profile.php', {id: ctx.params.id}, function(res){
        if(res.state == 'Success'){
            //if the user is logged in, return the information
            console.log('user is logged in, showing profile');
            showProfile(res.data);
        }else{
            //the user is not logged in, or something else went wrong
            //go to login page
            console.log("not logged in, redirect to login");
            page('/login');
        }
    });
}

function setProfileListeners(){
    $('#logout_button').click(function(){
        $.get('ajax/logout.php', function(res){
            document.cookie =  'PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            page('/login');
        });
    });
}