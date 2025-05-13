var bilderSomSkalLastes = [
    "coins", "ku",
    "gårdshus", "solcellepanel", "solcellepanel2", "strømboks", "strømpåle",
    "røyk1", "røyk2", "røyk3", "røyk4",
    "propanvarmer", "propanvarmerAktiv", "varmepumpe", "fliskjel"
];
var bildeLastet = 0;
var bilder = {};

var directionImages = [];

function loadImages(){
    //loads images with 4 directions
    var directions = ["Up", "Down", "Left", "Right"];
    for(var i=0; i<directionImages.length; i++){
        for(var j=0; j<4; j++){
            bilderSomSkalLastes.push(directionImages[i] + directions[j]);
        }
    }
    
    //loads all standalone images
    for(var i=0; i<bilderSomSkalLastes.length; i++){
        bilder[bilderSomSkalLastes[i]] = new Image();
        bilder[bilderSomSkalLastes[i]].onload = function(){
           bildeLastet++;
           if(bildeLastet === bilderSomSkalLastes.length){
              main();
           }
        }
        bilder[bilderSomSkalLastes[i]].src = "images/"+bilderSomSkalLastes[i]+".png";
    }
}