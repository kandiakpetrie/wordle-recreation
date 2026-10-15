
var height = 6;
var width = 5;

var row = 0;
var col = 0;

var gameOver = false;
var word = "LOVED";

window.onload = function(){
    initialize();
}

function initialize(){
    for(let r = 0; r < height; r++){
        for (let c = 0; c < width; c++){
            // <span id="0-0" class=tile>P</span>
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    document.addEventListener("keyup", (e) => {
        if (gameOver) return;

        //alert(e.code);
        if("KeyA" <= e.code && e.code <= "KeyZ"){
            if(col < width){
                let currTile = document.getElementById(row.toString() + "-" + col.toString());
                if (currTile.innerTile == ""){
                    currTile.innerTile = e.code[3];
                    col += 1;
                }
            }
        }
    })
}

