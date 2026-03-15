var can = document.createElement("canvas");
can.id = "mainCanvas";
can.width = 1200;
can.height = 900;
var c = can.getContext("2d");
//c.mozImageSmoothingEnabled = false;
//remove anti aliasing so that seams don't appear between textures
c.imageSmoothingEnabled = false;
document.getElementsByTagName("body")[0].appendChild(can);

var now = performance.now();
var then = 0;
var fpsAverage = 0;
var fpsCounting = 0;

//it takes this many milliseconds before an update is done
var tickLength = 50;
var previousTick = now;
var ticksSinceLastFrame = 0;

var timeToExecuteFrame = 0;

var interrupt = false;
var showDebugStuff = false;
var timeDelta = 0;
function run(){
    timeToExecuteFrame = performance.now();
    timeDelta = now-then;
    then = now;
    now = performance.now();
    
    //fps counting
    if(fpsCounting < 1000){
        getFps();
    }
    updateCooldowns();
    updateResourceTimers();
    updateTicks();
    updatePlayerStats(timeDelta);

    //clear screen
    c.clearRect(0, 0, can.width, can.height);

    drawGrid();
    drawEntities();
    drawAttacks();
    calculateAttacks();
    updateHud();

    if(moving.length > 0){
        for(var i=0; i<moving.length; i++){
            tryMove(moving[i]);
        }
    }

    if(ticksSinceLastFrame > 0){
        for(var i=0; i<spawners.length; i++){
            spawners[i].update(ticksSinceLastFrame);
        }
    }

    if(weather !== null){
        weather.updateSelf();
    }

    //why am i doing this in the main loop? idk, but having a central place where things happen feels nice
    if(interrupt){
        interrupt = false;
        interruptActions(player);
    }

    if(player.action !== null){
        if(ticksSinceLastFrame > 0)
            progressBars(ticksSinceLastFrame);
    }

    timeToExecuteFrame = performance.now() - timeToExecuteFrame;
    //drawExecutionTime(timeToExecuteFrame);

    window.requestAnimationFrame(run);
}


function getFps(){

}

function updateTicks(){
    if(now - previousTick > tickLength){
        //just in case of frameratedropping or something
        var numberOfTicks = Math.floor((now - previousTick)/tickLength);
        var remainingTickTime = (now - previousTick)%tickLength;
        previousTick = now - remainingTickTime;
        ticksSinceLastFrame = numberOfTicks;
    }
    else
        ticksSinceLastFrame = 0;
}

function interruptActions(player){
    if(player.action !== null){
        abortAction(player);
        player.action = null;
    }
}

function abortAction(){
    player.resourcing = null;
}

function progressBars(ticks){
    player.progressBar += player.progressPerTick * ticks;
    if(player.progressBar >= player.progressBarMax)
        progressFinish();
}

function progressFinish(){
    //if(player.action === "mine")
    //    mineFinish(player.progressPosition[0], player.progressPosition[1], player);
}

function calculateAttacks(){
    var attack;
    var entities;
    for(var i=0; i<activeAttacks.length; i++){
        attack = activeAttacks[i];
        entities = listCheckCollision(activeAttacks[i], tree.retrieve(attack));
        for(var j=0; j<entities.length; j++){
            if(Object.hasOwn(entities[j], "health")){
                attack.attemptHit(entities[j]);
                if(entities[j].health <= 0){
                    murder(entities[j], [entities[j].x, entities[j].y]);
                }
            }
        }

        attack.duration--;
        
        if(attack.duration === 0){
            activeAttacks.splice(i, 1);
            i--;
            continue;
        }
        
        for(var i=0; j<attack.length; j++){
            attack.timers[j] -= (now-then);
            if(attack.timers[j] <= 0){
                attack.timers.splice(j, 1);
                attack.hasHit.splice(j, 1)
            }
        }
    }
}

function murder(entity, position){
    addExperience(player, entity.experience);
    var items = entity.whenDefeated();
    for(var i=0; i<items.length; i++){
        tree.insert(items[i]);
    }

    for(var i=0; i<enemies.length; i++){
        if(enemies[i].id === entity.id){
            enemies.splice(i, 1);
            tree.remove(entity.id);
            return;
        }
    }        
}

function updateCooldowns(){
    if(player.cooldowns.length > 0){
        for(var i=0; i<player.cooldowns.length; i++){
            player.cooldowns[i].currentCooldown -= 50* ticksSinceLastFrame;
            if(player.cooldowns[i].currentCooldown < 0){
                player.cooldowns[i].currentCooldown = 0;
                player.cooldowns.splice(i, 1);
                i--;
            }
        }
    }

    for(var i=0; i<enemies.length; i++){
        if(enemies[i].currentMovementTimer > 0){
            enemies[i].currentMovementTimer -= 50 * ticksSinceLastFrame;
            if(enemies[i].currentMovementTimer <= 0){
                enemies[i].currentMovementTimer = 0;
                enemies[i].movementAi();
            }
        }
    }
}

var enemies = [];


var resourcesOnWatch = [];
function updateResourceTimers(){
    for(var i=0; i<resourcesOnWatch.length; i++){
        resourcesOnWatch[i].unavailableTime -= (now-then);
        if(resourcesOnWatch[i].unavailableTime < 0){
            resourcesOnWatch[i].unavailableTime = 0;
            resourcesOnWatch[i].replenish();
            resourcesOnWatch.splice(i, 1);
            i--;0
        }
    }
}


var id = 0;
var tree = null;
function oppstart(){
    var resourcesToAdd = 0;
    for(var i=0; i<resourcesToAdd; i++){
        var x = Math.floor(Math.random()*gridLength);
        var y = Math.floor(Math.random()*gridHeight);
    
        if(grid[x][y] === 0){
            var resourceType = mineralNames[Math.floor(Math.random()*mineralNames.length)]
            r = new Resource(x, y, true, bilder[resourceType], resourceType, resourceDensities[resourceType]);
            resources.push(r);
            grid[x][y] = r;
        }
    }

    //stitchGridSetup();

    treeBecomesSelectionmenu();

    setupHud();

    addBasicAttacks();

    addPlayerButtons();

    player.image = bilder["stickman"];
    player.id = id++;
    player.backpacks.push(new Backpack(5, 5));

    tree = new Quadtree({x:0,y:0,width:6400,height:3200}, 1000, 4, 0);
    tree.insert(player);

    loadGridPiece("starterForest");
    loadGridPiece("woastyn")

    run();
}


function drawEntities(){
    var entitiesToDraw = tree.retrieve(new pRect(player.x - drawDistanceX, player.y - drawDistanceY, drawDistanceX*2, drawDistanceY*2));
    var e;
    //back-background stuff
    //var back = c.createPattern(bilder.grass1, "repeat");
    //c.fillStyle = back;
    //c.fillRect(-64 + player.x%64, -64 + player.y%64, gridSize*20, gridSize*12)
    for(var i=0; i<240; i++){
        c.drawImage(bilder.grass1, (i*64)%1280 - (player.xOffset*64)%64,
                                    Math.floor(i/20)*gridSize - (player.yOffset*64)%64)
    }

    //background stuff
    for(var i=0; i<entitiesToDraw.length; i++){
        e = entitiesToDraw[i];
        if(e instanceof Wall || e instanceof Floor || e instanceof Interactible){
            if(e.tiledraw)
                for(var j=0; j<e.height*e.width; j++)
                    c.drawImage(e.image, (e.x+(j%e.width) - player.xOffset + e.xOffset)*gridSize,
                                         (e.y + (Math.floor(j/e.width)) - player.yOffset + e.yOffset)*gridSize)
                
            else
                c.drawImage(e.image, (e.x - player.xOffset + e.xOffset)*gridSize,
                                     (e.y - player.yOffset + e.yOffset)*gridSize)
        }
    }

    //foreground stuff
    for(var i=0; i<entitiesToDraw.length; i++){
        e = entitiesToDraw[i];
        if(!(e instanceof Wall || e instanceof Floor || e instanceof Interactible)){
            c.drawImage(e.image, (e.x - player.xOffset)*gridSize, (e.y - player.yOffset)*gridSize);
        }
    }
}


var started = false;
function playerOppstart(){
    grid[5][5] = player;
    player.image = bilder.stickman;
    player.id = id++;
}

var resourceDensities = {
    stone: 10,
    iron: 20
}

var grid = [];
var gridLength = 11;
var gridHeight = 11;
var gridSize = 64;
for(var i=0; i<gridLength; i++){
    grid[i] = new Array(gridHeight).fill(0);
}
//grid[x][y] is the format

var mineralNames = ["iron", "stone"];
var resources = [];

//movement
var movementKeys = ["w", "a", "s", "d", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];


var heldKeys = [];
var moving = [];

document.addEventListener("keydown", function(e){
    if(!heldKeys.includes(e.key)){
        heldKeys.push(e.key);
        keyHandler(e.key, "down");

        //remove movementkey
        if(movementKeys.includes(e.key)){
            moving.push(e.key);
        }
    }
});

document.addEventListener("keyup", function(e){
    for(var i=0; i<heldKeys.length; i++){
        if(heldKeys[i] === e.key){
            heldKeys.splice(i, 1);
            i--;
            keyHandler(e.key, "up");
            
            //remove movementkey
            if(moving.includes(e.key)){
                for(var j=0; j<moving.length; j++){
                    if(moving[j] === e.key){
                        moving.splice(j, 1);
                        return;
                    }
                }
            }
        }
    }
});


function keyHandler(key, way){
    if(key === "1" && way === "down"){
        clickedButton = player.hudBar1.slot0;
        player.hudBar1.slot0.onclick();
    }

    else if(key === "2" && way === "down"){
        clickedButton = player.hudBar1.slot1;
        player.hudBar1.slot1.onclick();
    }

    else if(key === "3" && way === "down"){
        clickedButton = player.hudBar1.slot2;
        player.hudBar1.slot2.onclick();
    }

    else if(key === "t" && way === "down"){
        treeOpen = !treeOpen;
    }
    
    else if(key === "i" && way === "down"){
        inventoryOpen = !inventoryOpen;
        if(inventoryOpen)
            playMusic(audios.inventory)
    }

    else if(key === "m" && way === "down"){
        mapOpen = !mapOpen;
        if(mapMousedragging)
            mapMousedragging = false;
        needToHandleMapAnimation = true;
        
        switch(mapInfo.state){
            case mapStates.closed:
            case mapStates.closing:
                mapInfo.state = mapStates.opening;
                break;
            case mapStates.opening:
            case mapStates.open:
                mapInfo.state = mapStates.closing;
                break;
            default:
                console.log("Error changing mapstate. Current mapstate is: " + mapInfo.state);  
        }

        if(mapOpen)
            playMusic(audios.mapOpen);
        else
            playMusic(audios.mapClose);
    }

    else if(key === "c" && way === "down"){
        charStatOpen = !charStatOpen;
        if(charStatOpen)
            playMusic(audios.pop);
        else
            playMusic(audios.pop2);
    }
    

    else if(key === "e" && way === "down"){
        var checkArea = new pRect(player.x+player.directionVector[0], player.y+player.directionVector[1])
        var entitiesToCheck = tree.retrieve(checkArea);
        var entitiesCollides = listCheckCollision(checkArea, entitiesToCheck)
        for(var j=0; j<entitiesCollides.length; j++){
            if("onUse" in entitiesCollides[j]){
                entitiesCollides[j].onUse();
            }
        }
    }


    else if(key === "|" && way === "down"){
        showDebugStuff = !showDebugStuff;
    }
}

var mapOpen = false;


function oob(min, max, thingToCheck){
    if(thingToCheck < min || thingToCheck > max)
        return true;
    return false;
}

var distanceFromBorder = 3;

function tryMove(key){
    var moved = false;
    var canWalkOn = true;
    var velocity = [0, 0];
    switch(key){
        case "w":
        case "ArrowUp":
            velocity[1] = (player.speed + player.speedboost)/(-1000)*timeDelta;
            break;
        case "a":
        case "ArrowLeft":
            velocity[0] = (player.speed + player.speedboost)/(-1000)*timeDelta;
            break;
        case "s":
        case "ArrowDown":
            velocity[1] = (player.speed + player.speedboost)/1000*timeDelta;
            break;
        case "d":
        case "ArrowRight":
            velocity[0] = (player.speed + player.speedboost)/1000*timeDelta;
            break;
    }
    updatePlayerDirection(velocity);

    var newPosition = [player.x + velocity[0], player.y + velocity[1]];

    //bad position
    if(newPosition[0] === -1 || newPosition[0] === gridLength || newPosition[1] === -1 || newPosition[1] === gridHeight)
        return;
    
    var checkArea = new pRect(player.x+velocity[0], player.y+velocity[1], player.width, player.height);
    var entitiesToCheck = tree.retrieve(checkArea);
    var entitiesCollides = listCheckCollision(checkArea, entitiesToCheck)

    //can move there
    if(entitiesCollides.length === 0 || (entitiesCollides.length === 1 && entitiesCollides[0].id === player.id)){
        interrupt = true;
        player.x = newPosition[0];
        player.y = newPosition[1];
        dialogueText = null;
        moved = true;
        canWalkOn = false;
    }

    player.speedboost = 0;
    for(var i=0; i<entitiesCollides.length; i++){
        if(entitiesCollides[i].id === player.id)
            continue;

        if(entitiesCollides[i] instanceof Interactible && entitiesCollides[i].open)
            continue;

        if(!(entitiesCollides[i] instanceof Item || entitiesCollides[i] instanceof Floor ||
            (entitiesCollides[i] instanceof Interactible && entitiesCollides[i].open)))

            canWalkOn = false;

        if(entitiesCollides[i] instanceof Floor && entitiesCollides[i].speedboost !== 0)
            player.speedboost = player.speed * entitiesCollides[i].speedboost;
    }
    
    
    if(canWalkOn){
        interrupt = true;
        player.x = newPosition[0];
        player.y = newPosition[1];
        dialogueText = null;
        moved = true;

        for(var i=0; i<entitiesCollides.length; i++){
            if(entitiesCollides[i] instanceof Item)
                pickup(player.x, player.y, entitiesCollides[i], player);
        }
    }

    //check if the board should "move"
    if(moved){
        if(player.x - player.xOffset > (drawDistanceX*2)-distanceFromBorder)
            player.xOffset+= velocity[0];
        if(player.y - player.yOffset > (drawDistanceY*2)-distanceFromBorder)
            player.yOffset+= velocity[1];
        
        if(player.x - player.xOffset < distanceFromBorder)
            player.xOffset+= velocity[0];
        if(player.y - player.yOffset < distanceFromBorder)
            player.yOffset+= velocity[1];
    }
    
}

function listCheckCollision(target, ents){
    var collides = [];
    for(var i=0; i<ents.length; i++){
        e = ents[i];
        if(target.id === e.id)
            continue;
        
        if( target.x < e.x + e.width &&
            target.x + target.width > e.x &&
            target.y < e.y + e.height &&
            target.height + target.y > e.y){
                collides.push(e);
        }
    }

    return collides;
}

function checkCollision(target, ent){
    if( target.x < ent.x + ent.width &&
        target.x + target.width > ent.x &&
        target.y < ent.y + ent.height &&
        target.height + target.y > ent.y){

        return true;
    }

    return false;
}

function checkCollisionTiles(target, ent, attack){
    if( target.x < attack.x + ent.x + ent.width &&
        target.x + target.width > attack.x + ent.x &&
        target.y < attack.y + ent.y + ent.height &&
        target.height + target.y > attack.y + ent.y){

        return true;
    }
    
    return false;
}


function mine(x, y, player){
    var resource = grid[x][y];
    //can't mine it yet
    if(!resource.available)
        return;
    
    //mining the same resource, so just continue doing so
    if(player.progressPosition[0] !== null)
        if(player.progressPosition[0] === x && player.progressPosition[1] === y)
            return;

    player.action = "mine";
    player.progressPosition[0] = x;
    player.progressPosition[1] = y;
    var progressBarMax = densityCalculation(player, resource.type, "mining");
    var progressPerTick = tickProgressCalculation(player, resource.type, "mining");
    player.resourcing = new Progressbar((x - player.xOffset)*64 - 32, (y - player.yOffset)*64 - 32, 128, 30,
                                         progressPerTick*0.2, progressBarMax, "#00cc00", "#005500", mineFinish)
}

var treetypes = {
    maple: {toughness: 20, xp: 10}
}

function useSkill(skilltype, target, targetType){
    player.target = target;
    switch(skilltype){
        case "woodcutting":
            player.action = "woodcut";
            var x = player.x, y = player.y;
            player.progressPosition[0] = x;
            player.progressPosition[1] = y;

            var progressBarMax = densityCalculation(player, treetypes[targetType], skilltype);
            var progressPerTick = tickProgressCalculation(player, treetypes[targetType].toughness, skilltype);

            player.resourcing = new Progressbar((x - player.xOffset)*64 - 32, (y - player.yOffset)*64 - 32, 128, 30,
                                            progressPerTick*0.2, progressBarMax, "#00cc00", "#005500", skillFinished)

            break;
        default:
            console.log("skilltype " + skilltype + " is unknown... what is the target?", target);
    }
}

function skillFinished(){
    if(player.target === null)
        return;
    var resourcesGet = player.target.mined();
    for(var i=0; i<resourcesGet.length; i++){
        if(resourcesGet[i].name === "pesos"){
            player.pesos += resourcesGet[i].amount;
            continue;
        }
        console.log(resourcesGet[i].name)
        addToPlayerBackpack(resourcesGet[i]);
    }
}


function mineFinish(player){
    var resource = grid[player.progressPosition[0]][player.progressPosition[1]];
    
    //reset the progress stuff and tell the game that the player is not mining
    player.action = null;
    player.progressBar = 0;
    player.progressPosition[0] = null;
    player.progressPosition[1] = null;

    if(resource.available){
        var resourcesGained = resource.mined(player);
        player.resources[resource.type] += resourcesGained;
        player.resourcesMinedTotal[resource.type] += resourcesGained;
        checkResourceMilestone(player, resource.type);
    }
}

//you can gain improvements from skilltrees, and from global bonuses
//skilltree could be the tree for stone spesifically, but global is for all mining
function densityCalculation(player, resource, jobType){
    var skillLevel = player.skills[jobType];
    //var skillTreeBonus1 = skillTree[resource].totalLoss;
    //var skillTreeBonus2 = globalBonuses[jobType].totalLoss;
    var density = resource.toughness;
    //density *= skillTree[resource]
    //density *= globalBonus[jobType]
    var finalValue = Math.ceil((density / (skillLevel/20)) * 1);
    return finalValue;
}

function tickProgressCalculation(player, resource, jobType){
    return 10;
}

//the cool stuff
function checkResourceMilestone(player, resource){
    console.log("nothing yet...");
}

var treeOpen = false;
var treeSelection = null;
var treeMenuSize = [700, 700]; //max width is canvas width
var treeMenuOffsets = [can.width/2 - treeMenuSize[0]/2, 50]
function openTree(){
    c.fillStyle = "#005500";
    c.fillRect(can.width/2 - treeMenuSize[0]/2, 50, treeMenuSize[0], treeMenuSize[1]);

    //tree to draw
    if(treeSelection === null)
        drawTreeSelectionmenu();
    else
        drawTree(treeSelection);
}

var charStatOpen = false;
var charStatSize = [200, 600];
var charStatOffsets = [can.width/2 - charStatSize[0]/2, 50]
function openCharacterStats(){
    var start = charStatSize[0]/2;
    c.fillStyle = "#660066";
    c.fillRect(start, 50, charStatSize[0], charStatSize[1]);

    var statsToDisplay = ["Strength", "Dexterity", "Vitality", "Intelligence", "Wisdom", "Willpower", "Luck"];
    c.font = "20px Comic Sans";
    for(var i=0; i<statsToDisplay.length; i++){
        c.fillStyle = "#00aa44";
        c.fillRect(start + 10, 60 + 35*i, 110, 30);
        c.fillStyle = "#dd00aa";
        c.fillRect(start + 120, 60 + 35*i, 70, 30);

        c.fillStyle = "#222222";
        c.fillText(statsToDisplay[i], start + 10, 80 + 35*i);

        c.fillText(player[statsToDisplay[i].toLowerCase()], start + 125, 80 + 35*i)
    }
}


var inventoryOpen = false;
var inventorySize = [200, 600];
var inventoryOffsets = [can.width/2 - charStatSize[0]/2, 50]

var buttons = [];
var clickedButton = null;

can.addEventListener("mousedown", function(e){
    if(treeOpen)
        clickOnSkill(e.clientX, e.clientY);
    else if(mapOpen)
        mapMousedragging = true;
    
    else{
        for(var i=0; i<buttons.length; i++){
            if(e.clientX >= buttons[i].x && e.clientX <= buttons[i].x + buttons[i].width){
                if(e.clientY >= buttons[i].y && e.clientY <= buttons[i].y + buttons[i].height){
                    clickedButton = buttons[i];
                    buttons[i].onclick();
                    return;
                }   
            }
        }
    }
});

can.addEventListener("mouseup", function(e){
    if(mapOpen)
        mapMousedragging = false;

});

var treeSelectionButtons = [];
var treeSelectionmenuMaxButtonWidth = 6;
function treeBecomesSelectionmenu(){
    for(var i=0; i<mineralNames.length; i++){
        treeSelectionButtons.push({
            x: 40 + 70*(i%6) + (i%6)*20,
            width: 70,
            y: 40 + Math.floor(i/4),
            height: 70,
            treeName: mineralNames[i],
            image: bilder[mineralNames[i]]
        });
    }
}

//var treeSelectionNames = 
function drawTreeSelectionmenu(){
    var b;
    for(var i=0; i<treeSelectionButtons.length; i++){
        b = treeSelectionButtons[i];
        c.beginPath();
        c.rect(b.x+treeMenuOffsets[0], b.y+treeMenuOffsets[1], b.width, b.height);
        c.drawImage(b.image, b.x+3+treeMenuOffsets[0], b.y+3+treeMenuOffsets[1]);
        c.closePath();
        c.stroke();
    }
}

//get the nodes in tiers, and requirements become arrows that point downwards,
//away from the requirement to the thing that needs it
//the tree itself then gets created dynamically from this
function drawTree(){

}

function clickOnSkill(x, y){
    if(treeSelection === null){
        //ok so we're in the menu. did a button get clicked?
        var button;
        for(var i=0; i<treeSelectionButtons.length; i++){
            console.log(x, y)
            button = treeSelectionButtons[i];
            if(button.x+treeMenuOffsets[0] < x && button.x+70+treeMenuOffsets[0] > x){
                if(button.y+treeMenuOffsets[1] < y && button.y+70+treeMenuOffsets[1] > y){
                    //a button did indeed get clicked. go to the relevant tree
                    treeSelection = button.treeName;
                }
            }
        }
    }
}








loadAudio();
loadImages();