//store tiles in an array
//89 = p+h+i+l+i+p+s
var number = 64;
var tileSize = 12;
var noiseMapSize = 512;
var canvas = document.getElementById("worldCanvas");
var c = canvas.getContext("2d");
canvas.width = number*tileSize;
canvas.height = number*tileSize;
canvas.id = "worldCanvas";

var noiseMap = perlin2D(1.1);

function exaggerateMap(noiseMap){
   for(var i=0; i<noiseMap.length; i++){
      for(var j=0; j<noiseMap[i].length; j++){
         noiseMap[i][j] = noiseMap[i][j]*2 - 0.9;
         if(noiseMap[i][j] < 0) {
            noiseMap[i][j] = 0;
         }
         else if(noiseMap[i][j] > 1){
            noiseMap[i][j] = 1;
         }
      }
   }
}
exaggerateMap(noiseMap);

var usemap = [];
var featuremap = [];
for(var i=0; i<noiseMapSize; i++){
   usemap[i] = [];
   featuremap[i] = [];
   for(var j=0; j<noiseMapSize; j++){
      usemap[i][j] = 0;
      featuremap[i][j] = 0;
   }
}

var offsetX = 0;
var offsetY = 0;
function updateUsemap(){
   for(var i=0; i<noiseMapSize; i++){
      for(var j=0; j<noiseMapSize; j++){
         usemap[i][j] = noiseMap[i][j]*100 - noiseMap[i][j]*100%1;
      }
   }
}
updateUsemap();

updateTimer = 0;
//draw stuff isometrically
function update(){
   updateTimer++;
   if(updateTimer === 60)
      updateTimer = 0;

   //update the things
   if(updateTimer%2 == 0 && (heldKeys.includes("KeyW") || heldKeys.includes("KeyA") ||
         heldKeys.includes("KeyS") || heldKeys.includes("KeyD"))){
      keyChange = false;
      if(heldKeys.includes("KeyW") && offsetY !== 0){
         offsetY--;
      }
      if(heldKeys.includes("KeyA") && offsetX !== 0){
         offsetX--;
      }
      if(heldKeys.includes("KeyS") && offsetY !== (512-number)){
         offsetY++;
      }
      if(heldKeys.includes("KeyD") && offsetX !== (512-number)){
         offsetX++;
      }
   }

   //draw the things
   draw();
   requestAnimationFrame(update);
}
function draw(){
   c.clearRect(0, 0, number*tileSize, number*tileSize);
   for(var i=0; i<number; i++){
      for(var j=0; j<number; j++){
         c.fillStyle = "#"+terrainHeightTable(usemap[i+offsetX][j+offsetY]).colour;
         c.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
      }
   }
}



function terrainHeightTable(number){
   if(number < 15){
      return waterDark;
   }
   else if(number < 20){
      return waterNormal;
   }
   else if(number < 25){
      return waterDark;
   }
   else if(number < 35){
      return grassDark;
   }
   else if(number < 50){
      return grassNormal;
   }
   else if(number < 65){
      return grassLight;
   }
   else if(number < 90){
      return mountainSlope;
   }
   else{
      return mountainTop;
   }
}

update();

//make the tiles interactables

//make the simcity thing

//add tile-features

//add cross-tile interactions

//make a player be able to play

//make it FanCy
