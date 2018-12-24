$('docuemnt').ready(function(){
   Router.init();
});

var loggedUser = null;

var showError = function(){
   var source = "<p>Error {{Error}}</p>";
   var template = Handlebars.compile(source);
   var context = {Error: "404"};
   var html = template(context);
   $('.content').html(html);
}