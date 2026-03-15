var gridMainIsland = [
    12, 18,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
];

var gridCave1 = [
    14, 10,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

var worldGrid = new Array(100);
for(var i=0; i<100; i++){
    worldGrid[i] = new Array(100).fill(null);
}
var gridSize = 32;

function retrieveNewGridPiece(coordinate){
    worldGrid[parseInt(coordinate[0])][parseInt(coordinate[1])] = window["gridPiece"+coordinate[0] + coordinate[1]];
    
    gatheredGrids++;
    if(gatheredGrids === gridsToGather)
        stitchGridFinisher();
}

function loadCorrectGridPiece(coordinate){
    var script = document.createElement("script");
    script.src = "gridPieces/gridPiece" + coordinate[0] + coordinate[1] + ".js";
    script.onerror = failedToLoadScript;
    document.getElementById("head").appendChild(script);
}

function loadGridPiece(filename){
    var script = document.createElement("script");
    script.src = "gridPieces/" + filename + ".js";
    script.onerror = failedToLoadScript;
    document.getElementById("head").appendChild(script);
}

function deloadCorrectGridPiece(coordinate){
    window["gridPiece" + coordinate[0] + coordinate[1]] = null;
    worldGrid[parseInt(coordinate[0])][parseInt(coordinate[1])] = null;
}

function failedToLoadScript(){
    console.log("failed to load script.....")
}


var translatorOfGrids = [
    1, "caveWall",
    2, "caveWallTop",
    3, "caveEntrance"
]

function formatGrid(){
    for(var i=0; i<grid.length; i++){
        for(var j=0; j<grid[0].length; j++){

        }
    }
}


//there is no center, it will draw from the top right
//there is a way to make a center, but i will not do it for now

var drawDistanceX = 10;
var drawDistanceY = 5;
function drawGrid(){
    /*

    var xEnd = (player.xOffset+(2*drawDistanceX)+1);
    var yEnd = (player.yOffset+(2*drawDistanceY)+1);

    c.beginPath();
    //the grid itself
    for(var i=0; i<(drawDistanceX*2)+2; i++){
        c.moveTo(gridSize*i, 0);
        c.lineTo(gridSize*i, gridSize*(drawDistanceY*2 + 1));
    }
    for(var j=0; j<(drawDistanceY*2)+2; j++){
        c.moveTo(0, gridSize*j);
        c.lineTo(gridSize*(drawDistanceX*2 + 1), gridSize*j);
    }
    c.closePath();
    c.stroke();
    */

    /*
    //the grid contents
    for(var x=player.xOffset; x<xEnd; x++){
        for(var y=player.yOffset; y<yEnd; y++){
            if(x >= gridLength || y >= gridHeight || x < 0 || y < 0)
                c.drawImage(bilder.badOcean,
                    (x-player.xOffset)*gridSize, (y-player.yOffset)*gridSize);

            else if(grid[x][y] !== 0)
                c.drawImage(grid[x][y].image,
                    (x-player.xOffset)*gridSize, (y-player.yOffset)*gridSize);

            (worldGrid[Math.floor(x/32)][Math.floor(y/32)][x%32][y%32] !== 0)
                c.drawImage(bilder.badOcean,
                    (x-player.xOffset)*gridSize, (y-player.yOffset)*gridSize);
        }
    }
    */
}

//takes worldGrid pieces and stiches them into a grid piece
var gatheredGrids = 0;
var gridsToGather = 0;
function stitchGridSetup(){
    gatheredGrids = 0;
    gridsToGather = 0;
    for(var i=-1; i<2; i++){
        for(var j=-1; j<2; j++){
            //checking if the tiles are legal
            if(i+player.worldX < 100 && i+player.worldX > -1){
                if(j+player.worldY < 100 && j+player.worldY > -1){
                    //piece already loaded
                    if(worldGrid[i+player.worldX][j+player.worldY] !== null)
                        continue;
                    
                    gridsToGather++;

                    var cord1 = (i+player.worldX).toString();
                    var cord2 = (j+player.worldY).toString();
                    if(cord1.length === 1)
                        cord1 = "0" + cord1;
                    if(cord2.length === 1)
                        cord2 = "0" + cord2;
                    loadCorrectGridPiece([cord1, cord2]);
                }
            }
        }
    }
}

//TODO: make the grid array in the beginning, and shift values instead of replacing them
function stitchGridFinisher(){
    var newArr = new Array(32*3);
    //do NOT do .fill(new Array)
    //it makes the same array be in multiple places
    for(var i=0; i<newArr.length; i++){
        newArr[i] = new Array(32*3).fill(0);
    }

    for(var i=-1; i<2; i++){
        for(var j=-1; j<2; j++){
            if(i+player.worldX < 100 && i+player.worldX > -1 && j+player.worldY < 100
                && j+player.worldY > -1 && worldGrid[i+player.worldX][j+player.worldY] !== null){
                
                fillGridArrSection(newArr, i, j);
            }
        }
    }
    grid = newArr;
    gridLength = 96;
    gridHeight = 96;
    if(!started){
        started = true;
        playerOppstart();
    }

    for(var i=0; i<npcs.length; i++){
        grid[npcs[i].x + 32*(npcs[i].worldX - player.worldX)][npcs[i].y + 32*(npcs[i].worldY - player.worldY)] = npcs[i];
    }
}

function fillGridArrSection(arr, x, y){
    for(var i=0; i<32; i++){
        for(var j=0; j<32; j++){
            arr[32*(x+1) + i][32*(y+1) + j] = worldGrid[x+player.worldX][y+player.worldY][i + j*32];
        }
    }
}