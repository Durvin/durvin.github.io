//var can = document.createElement("canvas");
var can = document.getElementById("visualiseringsCanvas");
can.width = 1600;
can.height = 900;

var c = can.getContext("2d");
//remove anti aliasing so that seams don't appear between textures
c.imageSmoothingEnabled = false;

var now = performance.now();
var then = 0;
var previousTick = now;
var timeDelta = 0;

var amassedTime = 0;
var timePerFrame = 100; //ms

var showDebugStuff = true;
var currentID;

var gameState = {
    state: "spill"
}

createCustomNumbers();
createAggregateNumbers();
baseAggregateNumbers.ts = getTSEmissions();
var basePowerHeat = {
    strøm: getStat("strøm"), 
    strømUtslipp: getStat("strømUtslipp"),
    oppvarming: getStat("oppvarming"),
    oppvarmingUtslipp: getStat("oppvarmingUtslipp")
}
createCards();
renderList();

//main gameloop for functions
function main(){
    timeDelta = now-then;
    then = now;
    now = performance.now();
    amassedTime += timeDelta;

    //calculations
    createCustomNumbers();
    createAggregateNumbers();

    //clear screen to redraw stuff
    c.clearRect(0, 0, can.width, can.height);

    //draw stuff
    rendering();
}

can.addEventListener("mouseup", function(e){
    checkClick(e);
});


//last in the last file, so that all depending .js files are loaded already.
loadImages();
establishCanvasCriterias();
//loadAudio();

var currentClass;
for(var i=0; i<document.getElementsByClassName("aa").length; i++){
    currentClass = document.getElementsByClassName("aa")[i];
    currentClass.addEventListener("mouseover", function(e){
        moveGridFocus(e.target);
    });
}
function moveGridFocus(target){
    if(hasParent(target, document.getElementById("statistikk")))
        document.getElementById("gridDiv").style.gridTemplateRows = "2fr 4fr 2fr";

    else if(hasParent(target, document.getElementById("kortHolder")))
        document.getElementById("gridDiv").style.gridTemplateRows = "4fr 2fr 2fr";

    else if(target.id=="visualiseringsCanvas")
        document.getElementById("gridDiv").style.gridTemplateRows = "2fr 2fr 4fr";

    else
        console.log("severe error in newStylePrioForTest", id);
}