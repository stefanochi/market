var Router = {
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
            this.navigate('#home');
        }
    },
    navigate: function(path){
        window.location.hash = path;
    }
}

$(window).on('hashchange', function(){
    Router.hashChanged();
});