var Router = (function(){

$(window).on('hashchange', function(){
    Router.hashChanged();
});
    

return {
    routes : [],
    add: function(path, handler){
        this.routes.push({pathRe: path, handler: handler});
        return this;
    },
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
    navigate: function(path){
        window.location.hash = path;
    },
    init: function(){
        Router.add(/login/, function(){
           Login.initLogin();
        });
        Router.add(/signup/, function(){
           Login.initSignup();
        });   
        Router.add(/profile\/(.*)/, function(){
           Profile.init(arguments[0]);
        });
        Router.add(/products\/user\/([0-9]+)/, function(){
           Products.loadProductsByUserID(arguments[0]);
        });
        Router.add(/products\/search\/([a-z0-9_]*)/i, function(){
            Products.loadProductsBySearch(arguments);
        });
     
        Router.hashChanged();
    }
}
}());