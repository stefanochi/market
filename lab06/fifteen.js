//stores the position of the empty cell
var empty = {
    x: 3,
    y: 3
}

window.onload = function() {
    var tilesSel = '#puzzlearea div';
    setBackgroundandPosition(tilesSel);
    setOnClick(tilesSel, tileClicked);

    $("shufflebutton").onclick = shuffle;
    //call to setEmpty to initialize the movable cells
    setEmpty(3, 3);
};

function setTilePosition(tile, x, y){
    tile.setStyle({
        top: y*100 + "px",
        left: x*100 + "px"
    });
    //updates the id of the cell
    tile.id = "square_" + x + "_" + y;
}

function setBackgroundandPosition(selector){
    var tiles = $$(selector);
    var x = 0;
    var y = 0;
    tiles.forEach(function(tile){
        tile.setStyle({
            position: 'absolute',
            backgroundPosition: (-x*100) + "px " + (-y*100) + "px"
        });
        setTilePosition(tile, x, y);
        
        tile.addClassName("tile");
        tile.id = "square_" + x + "_" + y;
        
        //if the end of the row, reset x and increase y
        x++;
        if(x>=4){
            x = 0;
            y++;
        }
    });
}

function setOnClick(selector, fun){
    var tiles = $$(selector);
    tiles.forEach(function(tile){
        tile.onclick = fun;
    });
}

function setEmpty(x, y){
    empty['x'] = x;
    empty['y'] = y;

    $$(".movable").each(function(t){
        t.removeClassName("movable");
    });

    setMovable(x+1, y);
    setMovable(x-1, y);
    setMovable(x, y+1);
    setMovable(x, y-1);
}

function setMovable(x, y){
    $$("#square_"+x+"_"+y).each(function(t){
        t.addClassName("movable");
    })
}

function tileClicked(){
    //called when a tile is clicked
    if(this.hasClassName("movable")){
        move(this);
    }
}

function move(tile){
    //new position in the empty space
    var newX = empty['x'];
    var newY = empty['y'];

    var oldX = parseInt(tile.style.left)/100;
    var oldY = parseInt(tile.style.top)/100;
    
    //move the tile
    setTilePosition(tile, newX, newY);

    //the empty space becomes the previous position of the tile
    //and updates the movable tiles
    setEmpty(oldX, oldY);
}

function shuffle(){
    //randomly select the a tile from the movables ones
    for(var i=0; i<100; i++){
        var tiles = $$(".movable");
        move(tiles[parseInt(Math.random() * tiles.length)]);
    }
}