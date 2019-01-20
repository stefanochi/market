var loggedUser = {
   info: null,
   init: function(callback){
      var payload  = loggedUser.info ? {id: loggedUser.info.ID} : {};
      $.get('ajax/profile', payload, function(res){
         if(res.state == 0){
            //if the request was successful, save the user info
            loggedUser.info = res.data;
         }
         callback();
      });
   },
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
         if(res.state == 0){
            showMessage("Logout successful");
         }
      });
      loggedUser.info = null;
   }
}

//show a positive message to the user (green)
var showMessage = function(message){
   $('#alert_text').html(message);
   $('.alert_div').removeClass('negative');
   $('.alert_div').addClass('positive');
   $('.alert_div').removeClass('hidden');
   //remove the alert after 5 seconds
   setTimeout(function(){
      $('.alert_div').addClass('hidden');
   }, 5000);
}

//show an error message to the user (red)
var showError = function(message){
   $('#alert_text').html(message);
   $('.alert_div').removeClass('positive');
   $('.alert_div').addClass('negative');
   $('.alert_div').removeClass('hidden');
   //remove the alert after 5 seconds
   setTimeout(function(){
      $('.alert_div').addClass('hidden');
   }, 5000);
}

//actions to take when the window is resized
function resizeHandler(){
   
   if($(window).width() < 767){ //small screeb
      $('.left').prependTo('.cl-2');
      $('.right').appendTo('.cl-2');

      //sidebar
      Navbar.hideSideMenu();
   
   }else if($(window).width() < 1200){ //medium screeen

      $('.left').prependTo('.cl-2');
      $('.right').appendTo('.cl-3');

      //sidebar
      Navbar.showSideMenu();
   
   }else{ //large screen
      
      $('.left').appendTo('.cl-1');
      $('.right').appendTo('.cl-3');

      //sidebar
      Navbar.showSideMenu();
   }

}

$('docuemnt').ready(function(){
   loggedUser.init(function(){
      Router.init();
      Navbar.init();
      Cart.init();
   });

   //set the listener for resize
   $(window).resize(resizeHandler);
});