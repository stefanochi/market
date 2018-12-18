$('docuemnt').ready(function(){
   setRouter();
});

var setRouter = function(){
   //set up the router for the single page app

   //set the base url
   page.base("/project");

   //define all the possible routes

   page('/login', loginStart);
   page('/signup', signupStart);
   page('/profile/:id', loadProfile);
   page('*', loadProfile);

   //start the router
   page();
}

var showError = function(){
   var source = "<p>Error {{Error}}</p>";
   var template = Handlebars.compile(source);
   var context = {Error: "404"};
   var html = template(context);
   $('.content').html(html);
}
