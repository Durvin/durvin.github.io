var canvas = document.createElement("canvas");
canvas.width = 1200;
canvas.height = 600;
var player = {
    x: 32,
    y: 64,
    yVelocity: 0,
    falling: true,
    xOffset: 0,
    yOffset: 0,
    health: 100,
    speed: 4,
    jumpHeight: 7,
    jumps: 2,
    jumpsLeft: 2,
    jumpCooldown: 0,
    jumpCooldownTotal: 200,
    experience: 0,
    inventory: {
        yellowCoins: 0,
        greenCoins: 0,
        redCoins: 0,
    },
};

//fast and steady, or rapidly increasing demands? not sure yet, but i feel like more leveling = more fun
var experiencePerLevel = [
    10, 20, 50, 90, 150, 250, 300, 350, 400, 450, 500, 550, 600, 700, 800, 900, 1000
]

//the start
function main(){
    var c = canvas.getContext("2d");
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);

    var resolution = [window.outerWidth, window.outerHeight];

    var enemies = [];
    var inactiveEnemies = []; //if too far away


    var count = 0;

    var box = {
        velocity: 10,
        width: 50,
        height: 0
    };
    box.height = box.width;

    var now = Date.now();
    var then = Date.now();
    var timeDiff = 0;
    var keypress = 0;
    var stop = false;

    //what happens if there is not texture on imageslot 56, yet there is a 56 in the worldArray?
    //this function just applies a bandaid fix for it, by setting the known number to be the error image;
    function applyErrorTexture(){
        //heh, maybe one day
        //TODO: make this
    }

    //spawn the player at the location specified in the level
    player.x = selectedLevel.spawn[0]*blocksize;
    player.y = selectedLevel.spawn[1]*blocksize;

    //spawn in all the entities in the level
    var ent;
    for(var i=0; i<selectedLevel.entityArr.length; i++){
        ent = selectedLevel.entityArr[i];
        entities.push(classFromName(ent[0], ent[1], ent[2]));
    }

    function loop(){
        //the stop condition
        if(stop === true){
            return;
        }

        //count++;
        now = Date.now();

        timeDiff = now - then;
        if(timeDiff > 50)
            timediff = 0;


        //creative mode
        if(creativeMode){
            updatePositionsCreative();
        }

        //normal mode
        else{
            updatePositions();
            updateCamera();
        }

        //clear the canvas
        c.clearRect(0,0, canvas.width, canvas.height);

        //background / air drawing
        c.fillStyle = selectedLevel.airColour;
        c.fillRect(0, 0, canvas.width, canvas.height);

        //draw terrain
        terrainFill();


        if(creativeMode){
            //text for mode
            c.font = "20px Bahnscrift"
            c.fillStyle = "#000";
            txt = "Mode: " + creativeDrawTypes[creativeDrawNumber];
            c.fillText(txt, canvas.width - 250, 20);

            //text for material
            if(creativeSelectedMaterial === 0)
                txt = "Material: air";
            else
                txt = "Material: " + imageNames[creativeSelectedMaterial-1];

            c.fillText(txt, canvas.width - 250, 60);

            c.fillText("Scroll to change material", canvas.width - 250, 100);

            //draw creative terrain (highlighting)
            if(!stopDrawing && creativeSelected1[0] !== -1){
                c.globalAlpha = 0.5
                creativeDrawing(c);
                c.globalAlpha = 1;
            }

            //highlight for current block hovering over
            if(cblock > -1 && cblock < worldArr.length && cxBlock < worldWidth && cx > -1){
                var imageToDraw = images[creativeSelectedMaterial]
                if(creativeSelectedMaterial === 0)
                imageToDraw = images[imageNames.length];

                c.globalAlpha = 0.7;
                c.drawImage(imageToDraw, cxBlock*blocksize - player.xOffset, cyBlock*blocksize - player.yOffset);
                c.globalAlpha = 1;
            }
        }

        //draw player debug surroundings
        if(false){
            c.fillStyle = "rgba(200,0,0,0.5)"
            c.fillRect((player.x-16 - (player.x-16)%16) - player.xOffset, player.y - player.yOffset -32, 16, 32);

            c.fillStyle = "rgba(0,0,200,0.5)"
            c.fillRect((player.x+16 - (player.x+16)%16) - player.xOffset, player.y - player.yOffset -32, 16, 32);
        }

        //draw misc entities
        renderEntities(c);
        if(!creativeMode){
            updateEntities();
        }

        //draw all the enemies

        //draw player
        c.fillStyle = "rgba(0,0,0,0.4)";
        c.fillRect(player.x - player.xOffset, player.y - player.yOffset -32, 16, 32);


        then = Date.now();
        window.requestAnimationFrame(loop);
    }
    //instead of forcing the browser to run at around 60fps, i can just make it so that every motion depends on time and not frames
    window.requestAnimationFrame(loop);

    //c.fillRect(count, 0, box.width, 20);

    window.addEventListener("keydown", function(e){
        //TODO: change system so that it checks what key it is, and record what type of key
        //it is associated with in userKeys instead of the key itself.
        //This will prevent using both the primary and secondary key at the same time for speed buffs
        for(var i=0; i < keysHeld.length; i++){
            if(keysHeld[i][0] === e.key)
                return;
        }
        keysHeld.push([e.key, Date.now()]);

        //p for creative mode, for printint out the level so it can be copy pasted in where it belongs
        if(creativeMode){
            if(e.key === userkeys.stop){
                creativePrintWorld();
            }

            else if(e.key === userkeys.switchMaterial){
                //using a touchpad form of a mousewheel precisely is... not feasible
                creativeSelectedMaterial++;
                if(creativeSelectedMaterial === imageNames.length+1){
                    creativeSelectedMaterial = 0;
                }
            }

            else if(e.key === userkeys.undo){
                if(e.ctrlKey)
                    undoLastDraw();
            }

        }
    })

    window.addEventListener("keyup", function(e){
        //finds and removes the associated key from the keysHeld state
        keysHeld.splice(keysHeld.findIndex((data) => data[0] === e.key),1);
    });

    //all the button clicks
    //i have to do this all in mousedown, because i could not find a listener for the middle mouse button (scroll wheel down)
    window.addEventListener("mousedown", function(e){
        if(e.button === 0)
            leftClick(e);
        else if(e.button === 1)
            middleClick(e);
        else if(e.button === 2){
            rightClick(e);
        }
    });

    function leftClick(e){
        if(creativeMode && e.target === canvas){
            creativeClick(e);
        }
    }

    document.addEventListener("mouseup", function(e){
        if(creativeDrawTypes[creativeDrawNumber] === "single")
            currentlyFilling = false;
    })

    //because this is a separate thing
    document.addEventListener("contextmenu", function(e){
        if(e.target === canvas)
            e.preventDefault();
    });

    //cancel the creative placement
    function rightClick(e){
        creativeSelected1[0] = -1;
        creativeSelected1[1] = -1;
    }

    //change the creative selected mode
    function middleClick(e){
        creativeDrawNumber++;
        if(creativeDrawNumber === creativeDrawTypes.length)
            creativeDrawNumber = 0;
    }

    window.addEventListener("wheel", function(e){
        if(creativeMode){
            add = e.wheelDelta > 0 ? 1 : -1;
            creativeSelectedMaterial = add;
            //bound checks
            if(creativeSelectedMaterial === -1)
                creativeSelectedMaterial++;
            else if(creativeSelectedMaterial === imageNames.length+1)
                creativeSelectedMaterial = imageNames.length;
        }

    });

    window.addEventListener("wheeldown", function(e){
        console.log("clock");
    });

    window.addEventListener("mousemove", function(e){
        mouseX = e.clientX;
        mouseY = e.clientY
        if(creativeMode){
            cx = mouseX - blocksize/2 + player.xOffset;
            cxBlock = (cx - (cx%blocksize))/blocksize;
            cy = mouseY - blocksize/2 + player.yOffset;
            cyBlock = (cy - (cy%blocksize))/blocksize;
            cblock = cyBlock*worldWidth + cxBlock;

            if(previouscX != cxBlock || previouscY != cyBlock){
                simulateFilling(c);
                if(currentlyFilling){
                    if(creativeDrawTypes[creativeDrawNumber] === "single"){
                        var prevMaterial = creativeFillSingle(cxBlock, cyBlock, creativeSelectedMaterial);
                        lastActions[lastActions.length-1].push(cxBlock, cyBlock, prevMaterial)
                    }
                }
            }

            previouscX = cxBlock;
            previouscY = cyBlock;
        }
    })

    function updatePositions(){
        //if key is held, increase position, and check for falling and walls and stuff
        var timedistance = 0;
        var addedSpeed = 0;
        var wall1, wall2;

        //TODO: check player.x and player.x + 15, to get the outer edges of player instead of whatever i do now

        //the player is 16x32, so i must check three blocks to the left and right, and two blocks under and over
        //i check a bit off center, so that the character doesn't fall off while half the charcter is still on something
        var playerNormalY = (player.y - (player.y%16))/16;
        //offsetUp exists because the character won't jump otherwise, for some reason
        var playerNormalYOffsetUp = (player.y-2 - ((player.y-2)%16))/16;

        var playerEdgeLeft = (player.x - player.x%16)/16;
        var playerEdgeRight = (player.x + 15 - (player.x + 15)%16)/16;

        var jumpModifier = 1;

        //player is currently falling
        var airconstant = 0.024;
        if(player.falling){
            player.y += player.yVelocity * (now-then) * 0.07;
            player.yVelocity += (now-then) * airconstant;
        }

        if(player.jumpCooldown > 0){
            player.jumpCooldown -= (now-then);
            if(player.jumpCooldown < 0)
                player.jumpCooldown = 0;
        }

        //make the character be level with the ground
        if(worldArr[playerEdgeLeft + (playerNormalYOffsetUp)*worldWidth] !== 0
        || worldArr [(playerEdgeRight) + (playerNormalYOffsetUp)*worldWidth] !== 0){

            player.falling = false;
            player.jumpsLeft = player.jumps;
            player.yVelocity = 0;
            player.y = playerNormalY*16;
        }

        //stop yVelocity if there is a roof above (and y-velocity is negative)
        if((worldArr[playerEdgeLeft + (playerNormalY-2)*worldWidth] !== 0
            || worldArr[(playerEdgeRight) + (playerNormalY-2)*worldWidth] !== 0)
            && player.yVelocity < 0){

            player.yVelocity = -player.yVelocity;
            //sets the player one pixel below the roof, so that horizontal velocity is not affected much
            player.y = player.y - player.y%16 + 17;
            player.falling = true;
        }

        //falls if no block is under the character
        if(worldArr[playerEdgeLeft + (playerNormalY)*worldWidth] === 0
            && worldArr[playerEdgeRight + (playerNormalY)*worldWidth] === 0){

            player.falling = true;
        }

        for(var i=0; i<keysHeld.length; i++){
            if(keysHeld[i][0] === userkeys.stop){
                console.log("main stopped");
                stop = true;
                return;
            }


            timedistance = (now - keysHeld[i][1]) * 0.09;
            airSpeed = 0.9;
            //TODO: replace all 16s with blocksize
            //this is hardcoded in, and although the pictures are also hardcoded 16x16, leaving the option for change is better

            //if this loop breaks, it means the event listener for keyup triggers before the loop finished
            //shouldn't be happening in Javascript, but who knows
            if(keysHeld[i][0] === userkeys.left || keysHeld[i][0] === userkeys.leftSecondary){

                if(player.falling)
                    addedSpeed = player.speed * airSpeed * timedistance;
                else
                    addedSpeed = player.speed * timedistance;

                player.x -= addedSpeed
                wall1 = worldArr[(player.x - (player.x%16))/16 + ((player.y-16 - (player.y%16))/16)*worldWidth] !== 0;
                wall2 = worldArr[(player.x - (player.x%16))/16 + ((player.y-32 - (player.y%16))/16)*worldWidth] !== 0;

                //checks if there is a lower wall, not a higher wall, and the character is not falling down, and applies uphill-stepassist if so
                if(wall1 && !wall2 && !player.falling)
                    player.y = player.y-16 - player.y%16;
                //wall? stop.
                else if(wall1 || wall2)
                    player.x = player.x - player.x%16 + 16;
            }

            else if(keysHeld[i][0] === userkeys.right || keysHeld[i][0] === userkeys.rightSecondary){

                if(player.falling)
                    addedSpeed = player.speed * airSpeed * timedistance;
                else
                    addedSpeed = player.speed * timedistance;

                player.x += addedSpeed;
                wall1 = worldArr[(player.x+16 - (player.x%16))/16 + ((player.y-16 - (player.y%16))/16)*worldWidth] !== 0;
                wall2 = worldArr[(player.x+16 - (player.x%16))/16 + ((player.y-32 - (player.y%16))/16)*worldWidth] !== 0;

                if(wall1 && !wall2 && !player.falling)
                    player.y = player.y-16 - player.y%16;
                else if(wall1 || wall2)
                    player.x = player.x - player.x%16;
            }

            else if(keysHeld[i][0] === userkeys.up || keysHeld[i][0] === userkeys.upSecondary){
                if(player.jumpCooldown === 0){
                    if(player.jumpsLeft > 0){

                        //jumping in the air doesn't give as much height
                        if(player.falling)
                            jumpModifier *= 0.8;

                        //due to the way this is coded, the way to get the most height is to hold the jump key down
                        if(player.yVelocity > 0)
                            player.yVelocity = -player.jumpHeight*jumpModifier;
                        else
                            player.yVelocity += -player.jumpHeight*jumpModifier;

                        player.jumpsLeft--;
                        player.jumpCooldown = player.jumpCooldownTotal;
                        player.falling = true;
                    }
                }
            }

            //i really don't need this, but until i find a better use for the button, this is going to stay
            else if(keysHeld[i][0] === userkeys.down || keysHeld[i][0] === userkeys.downSecondary)
                player.y += player.speed * timedistance;

            keysHeld[i][1] = now;

        }

        //update enemies
    }

    function updatePositionsCreative(){
        var timedistance = 0;

        for(var i=0; i<keysHeld.length; i++){
            timedistance = (now - keysHeld[i][1]) * 0.1;

            if(keysHeld[i][0] === userkeys.left || keysHeld[i][0] === userkeys.leftSecondary){
                player.xOffset -= creativeSpeed * timedistance
            }

            if(keysHeld[i][0] === userkeys.right || keysHeld[i][0] === userkeys.rightSecondary){
                player.xOffset += creativeSpeed * timedistance
            }

            if(keysHeld[i][0] === userkeys.up || keysHeld[i][0] === userkeys.upSecondary){
                player.yOffset -= creativeSpeed * timedistance
            }

            if(keysHeld[i][0] === userkeys.down || keysHeld[i][0] === userkeys.downSecondary){
                player.yOffset += creativeSpeed * timedistance
            }

            keysHeld[i][1] = now;
        }

        cx = mouseX - blocksize/2 + player.xOffset;
        cxBlock = (cx - (cx%blocksize))/blocksize;
        cy = mouseY - blocksize/2 + player.yOffset;
        cyBlock = (cy - (cy%blocksize))/blocksize;
        cblock = cyBlock*worldWidth + cxBlock;
    }

    var xOffsetLimit = canvas.width *(3/4);
    var yOffsetLimit = canvas.height *(5/7);
    function updateCamera(){
        //down
        if(player.y - yOffsetLimit > player.yOffset)
            player.yOffset = player.y - yOffsetLimit;

        //to the right
        if(player.x - xOffsetLimit > player.xOffset)
            player.xOffset = player.x - xOffsetLimit;

        //to the left
        if(player.x - (canvas.width - xOffsetLimit) < player.xOffset)
            player.xOffset = player.x - (canvas.width - xOffsetLimit);

        //up
        if(player.y - (canvas.height - yOffsetLimit) < player.yOffset)
            player.yOffset = player.y - (canvas.height - yOffsetLimit);
    }

    function terrainFill(){
        //these parameters allows for something akin to frustum culling, i.e. only drawing what can be viewed on the screen
        //(this is 2D, so no occlusion culling)
        drawyStart = Math.max(Math.floor(player.yOffset / blocksize), 0);
        drawyEnd = Math.min(Math.ceil((player.yOffset + canvas.height) / blocksize), worldHeight);

        drawxStart = Math.max(Math.floor(player.xOffset / blocksize), 0);
        drawxEnd = Math.min(Math.ceil((player.xOffset + canvas.width) / blocksize), worldWidth);

        for(var i=drawyStart; i<drawyEnd; i++)
            for(var j=drawxStart; j<drawxEnd; j++)
                if(worldArr[i*worldWidth + j] !== 0)
                    c.drawImage(images[worldArr[i*worldWidth + j]],
                                Math.round(j*blocksize - player.xOffset),
                                Math.round(i*blocksize - player.yOffset));


        /*
        //why did i use math.floor... it made horrible seams at times
        for(var i=0; i<totalWorldSize; i++){
            if(worldArr[i] !== 0)
                c.drawImage(images[worldArr[i]],
                            (i%worldWidth)*blocksize - player.xOffset,
                            Math.floor(i/worldWidth)*blocksize - player.yOffset);

        }
        */
    }
}

var selectedLevel = window["level1"];
var blocksize = 16;
var worldWidth = selectedLevel.worldWidth;
var worldHeight = selectedLevel.worldHeight;
var totalWorldSize = worldWidth*worldHeight;
var worldArr = selectedLevel.worldArr;

var keysHeld = [];

var userkeys = {
    left: "a",
    leftSecondary: "ArrowLeft",
    right: "d",
    rightSecondary: "ArrowRight",
    up: "w",
    upSecondary: "ArrowUp",
    down: "s",
    downSecondary: "ArrowDown",
    stop: "p",
    switchMaterial: "o",
    undo: "z",
    switchType: "l",
}

//log the hotkeys
console.log(
    userkeys.left + ": go left\n" +
    userkeys.up + ": jump\n" +
    userkeys.down + ": unused\n" +
    userkeys.right + ": go right\n" +
    userkeys.stop + ": stop the program. Also copies the worldstring to the clipboard \n" +
    "left click: when in creative mode, place down the selected material\n" +
    "right click: when in creative mode, cancel the current selection\n" +
    "mousewheel: change the currently selected material\n" +
    "mousewheeldown: change the draw mode\n" +
    userkeys.switchMaterial + ": change the currently selected material (for trackpad users)\n"


);
