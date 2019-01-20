//code for the router
var Router = (function(){

//listeners for hash changes in the url
$(window).on('hashchange', function(){
    Router.hashChanged();
});
    

return {
    routes : [],
    //a route is composed by a path (regEX) and a callback function
    add: function(path, handler){
        this.routes.push({pathRe: path, handler: handler});
        return this;
    },
    //chose the route that match the current path
    hashChanged: function(){
        var hash = window.location.hash;
        var matched = false;
        for(var i=0; i<this.routes.length; i++){
            var match = hash.match(this.routes[i].pathRe);
            if(match){
                matched = true;
                match.shift();
                this.routes[i].handler.apply({}, match);
            }
        }
        if(!matched){
            this.navigate('#profile/');
        }
    },
    //got to soecified path
    navigate: function(path){
        window.location.hash = path;
    },
    //add the routes
    init: function(){
        Router.add(/login/, function(){
           Login.initLogin();
        });
        Router.add(/signup/, function(){
           Login.initSignup();
        });   
        Router.add(/profile\/(.*)/, function(){ 
            //the url has the form: #profile/[profile id], where the profile indicates the id of the profile to show
            Profile.init(arguments[0]); //the id of the user is passed to this function
        });
        Router.add(/products\/search\/([a-z0-9_]*)$/i, function(){
            //has the form: #products/search/[search string], where search string indicates the search argument
            Products.loadProductsBySearch(arguments); //the string is passed to the function
        });
     
        Router.hashChanged();
    }
}
}());