$('docuemnt').ready(function(){
   setRouter();
});

var user = null;

var setRouter = function(){
   //set up the router for the single page app
   Router.add(/home/, function(){
      console.log("Home page");
   });
   Router.add(/login/, function(){
      console.log("showing login");
      loginStart();
   });
   Router.add(/signup/, function(){
      console.log("showing signup");
      signupStart();
   });   
   Router.add(/profile\/(.*)/, function(){
      loadProfile(arguments[0]);
   });
   Router.add(/products\/([0-9]*)/, function(){
      loadProducts(arguments[0]);
   });

   Router.hashChanged();
}

var showError = function(){
   var source = "<p>Error {{Error}}</p>";
   var template = Handlebars.compile(source);
   var context = {Error: "404"};
   var html = template(context);
   $('.content').html(html);
}