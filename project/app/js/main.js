var loggedUser = {
   info: null,
   getUser: function(){
       var payload  = loggedUser.info ? {id: loggedUser.info.ID} : {};
       $.get('ajax/profile', payload, function(res){
           if(res.state == 0){
               //if the request was successful, save the user info
               loggedUser.info = res.data;
           }
       });
   },
   logout: function(){
      $.get('ajax/logout', function(res){
         console.log(res.message);
      });
      loggedUser.info = null;
   }
}

var showError = function(){
   var source = "<p>Error {{Error}}</p>";
   var template = Handlebars.compile(source);
   var context = {Error: "404"};
   var html = template(context);
   $('.content').html(html);
}

$('docuemnt').ready(function(){
   loggedUser.getUser();
   Router.init();
   Navbar.init();
});