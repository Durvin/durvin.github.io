var bilderSomSkalLastes = [
    "stickman", "stone", "iron", "debug", "air", "emptyResource",
    "badOcean", "caveWall", "caveWallTop", "grass1",


    //trees
    "treeTemperate1", "treeTemperate2", "treeTemperate3", 
    "mapleLog",


    //roads
    "dirtroadH", "dirtroadV", "dirtroad1", "dirtroad2", "dirtroad3", "dirtroad4",

    //house stuff
    "woodenFloor", "caveDoorRed", "caveDoorRedOpen",

    //map
    "worldmap", "mapPointer", "mapStar",

    "anmao", "redMao", "rat",
    
    "coins",

    "basic attack",

    "blueSlime"
];
var bildeLastet = 0;
var bilder = {};

//bulk add to bilderSomSkalLastes
//format is the main file name, followed by the max image number. 
var bulkImages = ["StoneSkillTree", 12];

var directionImages = ["player"];

function loadImages(){
    for(var i=0; i<bulkImages.length/2; i++){
        for(var j=1; j<bulkImages[(i*2)+1]+1; j++){
            bilderSomSkalLastes.push((bulkImages[i*2]+j).toString());
        }
    }

    var directions = ["Up", "Down", "Left", "Right"];
    for(var i=0; i<directionImages.length; i++){
        for(var j=0; j<4; j++){
            bilderSomSkalLastes.push(directionImages[i] + directions[j]);
        }
    }
    
    for(var i=0; i<bilderSomSkalLastes.length; i++){
        bilder[bilderSomSkalLastes[i]] = new Image();
        bilder[bilderSomSkalLastes[i]].onload = function(){
           bildeLastet++;
           if(bildeLastet === bilderSomSkalLastes.length-1){
              oppstart();
           }
        }
        bilder[bilderSomSkalLastes[i]].src = "bilder/"+bilderSomSkalLastes[i]+".png";
    }
}

var audioToLoad = [
    "death", "death2", "fan", "basicattack1", "basicattack2", "basicattack3", "basicattack4", "basicattack5",
    "levelup", "coindrop", "coindropquick", "inventory", "dog", "pop", "pop2", "ghostdog", "ghostdog2",
    "ratdeath1", "ratdeath2", "rathit1", "rathit2", "rathit3", "ratidle1", "ratidle2",
    "doorOpen", "doorClose",

    "mapOpen", "mapClose",
];

var audios = {};

function loadAudio(){
    var audioDiv = document.createElement("div");

    for(var i=0; i<audioToLoad.length; i++){
        var audioToAdd = new Audio("audio/" + audioToLoad[i] + ".mp3");
        audios[audioToLoad[i]] = audioToAdd;
        audioDiv.appendChild(audioToAdd);
    }

    document.getElementsByTagName("body")[0].appendChild(audioDiv);
}

function playMusic(music){
    var a = new Audio(music.src);
    a.volume = 0.2;
    var promise = a.play();
    if(promise){
        promise.catch(function(error) { console.error(error); });
    }
}