var creativeMode = false;
var creativeDrawTypes = ["area", "single", "triangle"];
var creativeDrawNumber = 0;
var creativeHasClicked = false;
var creativeSelected1 = [-1, -1];
var creativeSelected2 = [-1, -1];
var creativeSelectedMaterial = 1;
var creativeSpeed = 10;
var currentlyFilling = false;

//0 is drawing, 1 is entities
var creativeFillType = 0;

var cx = 0;
var cxBlock = 0;
var cy = 0;
var cyBlock = 0;
var cblock = 0;

var previouscX = 0;
var previouscY = 0;

var mouseX = 0;
var mouseY = 0;


function creativeFill2Point(source, mouseFrom, mouseTo){
    fromx = 0;
    tox = 0;
    fromy = 0;
    toy = 0;
    arr = [];
    if(source === "creative")
        arr = creativeArr;
    else
        arr = worldArr;

    if(mouseFrom[0] > mouseTo[0]){
        fromx = mouseTo[0];
        tox = mouseFrom[0];
        if(source === "creative"){
            tox = tox - fromx;
            fromx = 0;
        }
    }
    else{
        fromx = mouseFrom[0];
        tox = mouseTo[0];
        if(source === "creative"){
            tox = tox - fromx;
            fromx = 0;
        }
    }

    if(mouseFrom[1] > mouseTo[1]){
        fromy = mouseTo[1];
        toy = mouseFrom[1];
        if(source === "creative"){
            toy = toy-fromy;
            fromy = 0;
        }
    }
    else{
        fromy = mouseFrom[1];
        toy = mouseTo[1];
        if(source === "creative"){
            toy = toy-fromy;
            fromy = 0;
        }
    }

    var previousContent = [];

    if(source === "creative"){
        for(i = 0; i<=tox; i++){
            for(j = 0; j<=toy; j++){
                arr[j][i] = imageNames.length;
            }
        }
    }

    else{
        //TODO: få den til å heller bruke arrayet horisontalt og ikke vertikalt. har med caching å gjøre
        //OBS: dette gjelder også undo greia og muligens alt som gjør det samme

        //is it a block that is being filled?
        if(creativeSelectedMaterial < amountOfTiles+1){
            for(i = fromx; i<=tox; i++){
                for(j = fromy; j<=toy; j++){
                    previousContent.push(arr[j*worldWidth + i]);
                    arr[j*worldWidth + i] = creativeSelectedMaterial;
                }
            }
        }
        //is it an entity?
        else if(creativeSelectedMaterial < amountOfTiles+amountOfEntities+1){
            var entitiesBefore = entities.length;
            for(var i=fromx; i<tox+1; i++){
                for(var j=fromy; j<toy+1; j++){
                    entities.push(classFromName(imageNames[creativeSelectedMaterial-1],
                    i*blocksize,
                    (j+1)*blocksize));
                }
            }
            var entitiesAfter = entities.length;

        }

        //is it the entity remover?
        else if(creativeSelectedMaterial === imageNames.length){
            fromx = fromx * blocksize -1;
            tox = tox * blocksize +1;
            fromy = fromy * blocksize -1;
            toy = toy * blocksize +1;
            for(var i=0; i<entities.length; i++){
                if(entities[i].x > fromx && entities[i].x < tox && entities[i].y > fromy && entities[i].y < toy){
                    entities.splice(i,1)
                    i--;
                }
            }
        }
    }
    return previousContent;
}

function creativeFillSingle(x, y, material){
    var prevMaterial = worldArr[x + y*worldWidth]
    worldArr[x + y*worldWidth] = material;
    return prevMaterial;
}

//make a line between the three points, and fill in everything that would be inside
function fillTriangle(source, p1, p2, pfinal){
    fromx = 0;
    tox = 0;
    fromy = 0;
    toy = 0;
    arr = [];
    if(source === "creative")
        arr = creativeArr;
    else
        arr = worldArr;

    if(mouseFrom[0] > mouseTo[0]){
        fromx = mouseTo[0];
        tox = mouseFrom[0];
        if(source === "creative"){
            tox = tox - fromx;
            fromx = 0;
        }
    }
    else{
        fromx = mouseFrom[0];
        tox = mouseTo[0];
        if(source === "creative"){
            tox = tox - fromx;
            fromx = 0;
        }
    }

    if(mouseFrom[1] > mouseTo[1]){
        fromy = mouseTo[1];
        toy = mouseFrom[1];
        if(source === "creative"){
            toy = toy-fromy;
            fromy = 0;
        }
    }
    else{
        fromy = mouseFrom[1];
        toy = mouseTo[1];
        if(source === "creative"){
            toy = toy-fromy;
            fromy = 0;
        }
    }

    var previousContent = [];

    if(source === "creative"){
        for(i = 0; i<=tox; i++){
            for(j = 0; j<=toy; j++){
                arr[j][i] = imageNames.length;
            }
        }
    }

    else{
        //TODO: få den til å heller bruke arrayet horisontalt og ikke vertikalt. har med caching å gjøre
        //OBS: dette gjelder også undo greia og muligens alt som gjør det samme

        //is it a block that is being filled?
        if(creativeSelectedMaterial < amountOfTiles+1){
            for(i = fromx; i<=tox; i++){
                for(j = fromy; j<=toy; j++){
                    previousContent.push(arr[j*worldWidth + i]);
                    arr[j*worldWidth + i] = creativeSelectedMaterial;
                }
            }
        }
        //is it an entity?
        else if(creativeSelectedMaterial < amountOfTiles+amountOfEntities+1){
            var entitiesBefore = entities.length;
            for(var i=fromx; i<tox+1; i++){
                for(var j=fromy; j<toy+1; j++){
                    entities.push(classFromName(imageNames[creativeSelectedMaterial-1],
                    i*blocksize,
                    (j+1)*blocksize));
                }
            }
            var entitiesAfter = entities.length;

        }

        //is it the entity remover?
        else if(creativeSelectedMaterial === imageNames.length){
            fromx = fromx * blocksize -1;
            tox = tox * blocksize +1;
            fromy = fromy * blocksize -1;
            toy = toy * blocksize +1;
            for(var i=0; i<entities.length; i++){
                if(entities[i].x > fromx && entities[i].x < tox && entities[i].y > fromy && entities[i].y < toy){
                    entities.splice(i,1)
                    i--;
                }
            }
        }
    }
    return previousContent;
}

creativeArr = [[0]];

function simulateFilling(c){
    //firstly make the array large enough to hold the data
    //this doesn't need to be as large as the world (usually), so i just allocate more space dynamically
    if(creativeSelected1[0] != -1){     //in other words: is the first point set?

        makeCreativeFillArrayBigEnough();
        //clearArr(creativeArr);
        //fill inn highlighing material
    }
}

function makeCreativeFillArrayBigEnough(){
    xSize = Math.abs(creativeSelected1[0] - cxBlock) +1;
    if(creativeArr[0].length < xSize){
        //fill inn the missing lengths in each subarray
        for(var j=0; j<creativeArr.length; j++){
            for(var i=creativeArr[j].length; i<xSize; i++){
                creativeArr[j].push(0);
            }
        }
    }
    ySize = Math.abs(creativeSelected1[1] - cyBlock) +1;
    if(creativeArr.length < ySize){
        for(var i=creativeArr.length; i<=ySize; i++){
            creativeArr.push(creativeArr[0]);
        }
    }
}

//draw the images where the fill would happen
function creativeDrawing(c){
    drawyEnd = Math.abs(creativeSelected1[1] - cyBlock+1);
    drawxEnd = Math.abs(creativeSelected1[0] - cxBlock+1);

    xBlockOffset = 0;
    yBlockOffset = 0;

    //special cases to make the area fill for all directions from the starting point
    if(creativeSelected1[1] < cyBlock){
        yBlockOffset = drawyEnd+1;
        drawyEnd += 2;
    }

    if(creativeSelected1[0] < cxBlock){
        xBlockOffset = drawxEnd+1;
        drawxEnd += 2;
    }

    //image to draw
    var imageToDraw = images[creativeSelectedMaterial]
    if(creativeSelectedMaterial === 0)
        imageToDraw = images[imageNames.length]


    for(var i=0; i<drawyEnd; i++){
        for(var j=0; j<drawxEnd; j++){
            c.drawImage(imageToDraw,
                (j+cxBlock-xBlockOffset)*blocksize - player.xOffset,
                (i+cyBlock-yBlockOffset)*blocksize - player.yOffset);
        }
    }

}
stopDrawing = false;


//basically an undo
var lastActions = [];
function undoLastDraw(){
    if(lastActions.length === 0)
        return;

    last = lastActions[lastActions.length-1];

    if(last[0] === "single"){
        for(var i=1; i<last.length; i += 3){
            creativeFillSingle(last[i], last[i+1], last[i+2]);
        }
        lastActions.splice(lastActions.length-1);
    }

    else if(last[0] === "area"){
        for(var i=0; i<last[3]; i++){
            for(var j=0; j<last[4]; j++){
                creativeFillSingle(i+last[1], j+last[2], last[5][j+i*last[4]]);
            }
        }
        lastActions.splice(lastActions.length-1);
    }

}

//TODO: consider whether or not a redo button is neccesary
//hmmm, not sure if it is neccesary. e litt vanskeli å si sekkert om d trengs

/*
function creativeSwitchType(){
    creativeFillType++;
    if(creativeFillType === 2)
        creativeFillType = 0;
}
*/

function creativePrintWorld(){
    printstring = "";
    //basic info


    //worldArr
    printstring += "worldArr:[";

    newlineCounter = 0;
    for(var i = 0; i<totalWorldSize; i++){
        printstring += worldArr[i];
        printstring += ",";

        newlineCounter++;
        if(newlineCounter === worldWidth){
            printstring += "\n";
            newlineCounter = 0;
        }
    }
    printstring += "],";

    //entities
    printstring += "entityArr:[";

    for(var i=0; i<entities.length; i++){
        printstring += "['" + entities[i].constructor.name + "'," +entities[i].x + "," + entities[i].y + "],\n";
    }

    printstring += "],";

    navigator.clipboard.writeText(printstring)
    console.log("copied to the clipboard");
}

function creativeClick(e){
    //block placement and such
    if(creativeFillType === 0){
        //no need to worry about yBlock OOB here
        if(creativeDrawTypes[creativeDrawNumber] === "area"){
            if(cblock > -1 && cblock < worldArr.length && cxBlock < worldWidth && cx > -1){
                //no point is set
                if(creativeSelected1[0] === -1 && creativeSelected1[1] === -1){
                    creativeSelected1[0] = cxBlock;
                    creativeSelected1[1] = cyBlock;
                }
                //point 1 is set
                else{
                    creativeSelected2[0] = cxBlock;
                    creativeSelected2[1] = cyBlock;

                    var previousContent = creativeFill2Point("normal", creativeSelected1, creativeSelected2);
                    var fromx = creativeSelected1[0] > creativeSelected2[0] ? creativeSelected2[0] : creativeSelected1[0];
                    var fromy = creativeSelected1[1] > creativeSelected2[1] ? creativeSelected2[1] : creativeSelected1[1];

                    //send in in this format to the undo array:
                    //["area", startx, starty, sizex, sizey, [all contents that was there earlier]]
                    lastActions.push(["area", fromx, fromy,
                                            Math.abs(creativeSelected1[0] - creativeSelected2[0])+1,
                                            Math.abs(creativeSelected1[1] - creativeSelected2[1])+1,
                                            previousContent]);

                    creativeSelected1 = [-1, -1];
                    creativeSelected2 = [-1, -1];
                }
            }
        }

        else if(creativeDrawTypes[creativeDrawNumber] === "single"){
            var prevMaterial = creativeFillSingle(cxBlock, cyBlock, creativeSelectedMaterial);
            lastActions.push(["single", cxBlock, cyBlock, prevMaterial]);
            currentlyFilling = true;
        }

        else if(creativeDrawTypes[creativeDrawNumber] === "triangle"){
            if(cblock > -1 && cblock < worldArr.length && cxBlock < worldWidth && cx > -1){
                //no point is set
                if(creativeSelected1[0] === -1 && creativeSelected1[1] === -1){
                    creativeSelected1[0] = cxBlock;
                    creativeSelected1[1] = cyBlock;
                }
                //point 1 is set
                else{
                    creativeSelected2[0] = cxBlock;
                    creativeSelected2[1] = cyBlock;

                    var previousContent = fillTriangle("normal", creativeSelected1, creativeSelected2);
                    var fromx = creativeSelected1[0] > creativeSelected2[0] ? creativeSelected2[0] : creativeSelected1[0];
                    var fromy = creativeSelected1[1] > creativeSelected2[1] ? creativeSelected2[1] : creativeSelected1[1];

                    //send in in this format to the undo array:
                    //["area", startx, starty, sizex, sizey, [all contents that was there earlier]]
                    lastActions.push(["area", fromx, fromy,
                                            Math.abs(creativeSelected1[0] - creativeSelected2[0])+1,
                                            Math.abs(creativeSelected1[1] - creativeSelected2[1])+1,
                                            previousContent]);

                    creativeSelected1 = [-1, -1];
                    creativeSelected2 = [-1, -1];
                }
            }
        }
    }
}
