$('docuemnt').ready(function(){
   setRouter();
});

var user = {
   logged: false,
   data: {
      name: 'undefined',
      email: 'undefined'
   }
};

var setRouter = function(){
   //set up the router for the single page app

   //set the base url
   page.base("/project");

   //define all the possible routes

   //pages accessible even when not logged in
   page('/login', showLogin);
   page('/signup', function(ctx, next){
      if(user.logged){
         next();
      }else{
         showSignup();
      }
   });

   //if the user is not logged and tries to acces a page
   //different from login or signup he is redirected to login
   //this is checked both on the client and on the server
   page('*', function(ctx, next){
      if(user.logged == false){
         page('/login');
      }else{
         next();
      }
   });
   page('/user', showUser);

   //start the router
   page();
}

var showUser = function(ctx){
   var source = $('#home_template').html();
   var template = Handlebars.compile(source);
   var context = {username: user.data.name, email: user.data.email};
   var html = template(context);
   $('.content').html(html);
}

var showError = function(){
   var source = "<p>Error {{Error}}</p>";
   var template = Handlebars.compile(source);
   var context = {Error: "404"};
   var html = template(context);
   $('.content').html(html);
}
