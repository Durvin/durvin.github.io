
var imagesLoaded = 0;
var amountOfTiles = 1;
var amountOfEntities = 3;
var imageNames = [
    //tiles
    "dirt",

    //collectibles
    "yellowCoin",
    "greenCoin",
    "redCoin",

    //player

    //enemies
    "greenSlime",

    //development textures
    "devFillTexture",
];

var imageNumberFinder = {};

//super javascript exclusive, but hey it works so why not
function fillImageNumberFinder(){
    imageNumberFinder.air = 0;
    for(var i=0; i<imageNames.length; i++){
        imageNumberFinder[imageNames[i]] = i+1;
    }
}
fillImageNumberFinder();

var images = new Array(imageNames.length+1);
images[0] = 0; //air

window.onload = loadImages;
function loadImages(){
    for(var i=0; i<imageNames.length; i++){
        var image = new Image();
        image.id = i+1;
        image.onload = finishImage(image);
        image.src = "bilder/"+imageNames[i]+".png";
    }
}

function finishImage(img){
    var imageId = Number(img.id);
    img.id = "";
    images[imageId] = img;

    imagesLoaded++;
    if(imagesLoaded === imageNames.length)
        main();
}
