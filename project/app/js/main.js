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
         console.log(res.message);
      });
      loggedUser.info = null;
   }
}

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

function resizeHandler(){
   
   if($(window).width() < 767){
      $('.left').prependTo('.cl-2');
      $('.right').appendTo('.cl-2');

      //sidebar
      Navbar.hideSideMenu();

   }else if($(window).width() < 1200){

      $('.left').prependTo('.cl-2');
      $('.right').appendTo('.cl-3');

      //sidebar
      Navbar.showSideMenu();
   
   }else{
      
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

   $(window).resize(resizeHandler);
});