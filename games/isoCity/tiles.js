function translateToHex(number){
   var result = "";
   while(number > 0){
      if(number > 16){
         //second value
         switch((number-number%16)/16){
            case 10:
            result += "A";
            break;
            case 11:
            result += "B";
            break;
            case 12:
            result += "C";
            break;
            case 13:
            result += "D";
            break;
            case 14:
            result += "E";
            break;
            case 15:
            result += "F";
            break;
            default:
            result += ((number-number%16)/16).toString();
         }
         number -= (number-number%16);

         if(number === 0)
            result += "0";
      }
      else{
         if(result === ""){
            result += "0";
         }
         //first value
         switch(number){
            case 10:
            result += "A";
            break;
            case 11:
            result += "B";
            break;
            case 12:
            result += "C";
            break;
            case 13:
            result += "D";
            break;
            case 14:
            result += "E";
            break;
            case 15:
            result += "F";
            break;
            default:
            result += number.toString();
         }
         number = 0;
      }
   }
   return result;
}
var tiles = [
waterLight = {
   r: 10,
   g: 10,
   b: 190,
},
waterNormal = {
   r: 10,
   g: 10,
   b: 140,
},
waterDark = {
   r: 10,
   g: 10,
   b: 90,
},
grassLight = {
   r: 10,
   g: 190,
   b: 10,
},
grassNormal = {
   r: 10,
   g: 140,
   b: 10,
},
grassDark = {
   r: 10,
   g: 90,
   b: 10,
},
mountainSlope = {
   r: 150,
   g: 150,
   b: 150,
},
mountainTop = {
   r: 230,
   g: 230,
   b: 230,
},
errorTile = {
   r: 100,
   g: 0,
   b: 255,
}
];

//adding the colour property to the tiles
for(var i=0; i<tiles.length; i++){
   tiles[i].colour = translateToHex(tiles[i].r)+translateToHex(tiles[i].g)+translateToHex(tiles[i].b);
}
