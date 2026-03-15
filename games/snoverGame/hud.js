//aggregate function for a bunch of hud sub-updates
function updateHud(){
    updateBars();
    drawHud();
    drawPlayerInfo();

    drawSkillIcons();

    if(dialogueText !== null){
        displayDialogue();
    }

    if(treeOpen)
        openTree();

    if(charStatOpen)
        openCharacterStats();

    if(inventoryOpen)
        openInventory();

    if(needToHandleMapAnimation)
        handleMapAnimation();
    if(mapInfo.startOffset !== mapInfo.maxStartOffset)
        drawMap();

    if(showDebugStuff)
        drawDebugStuff();
}

var dialogueText = null;
var dialogueOwner = null;

function drawPlayerInfo(){

}

function drawExecutionTime(time){
    c.fillText(time + "ms", 1100, 20);
}

function setupHud(){
    //bars for player
    //TODO: make thing that keeps track of bars with name, so a hashmap or something?
    activeBars.push(new StatBar(20, 70, 300, 25, player, "health", "maxHealth", "#EE0000", "#550000"));
    activeBars.push(new StatBar(20, 100, 300, 25, player, "mana", "maxMana", "#0000EE", "#000055"));
    activeBars.push(new StatBar(128, 64*(drawDistanceY*2 + 1), 64*(drawDistanceX*2 - 3)-3, 25, player, "experience", "experienceRequirement", "#AAAA00", "#555500"));

    //player info shape
    staticDrawings.push(new Shape(20, 20, 200, 40, "#333333"));
    staticTexts.push(new TextDisplay(25, 50, "#cccccc", "Player level:", "15px 'Comic Sans'"))
    staticTexts.push(new TextDisplay(102, 50, "#cccc00", "0", "25px 'Comic Sans'", true, player, "characterLevel"));

    staticDrawings.push(new Shape(20, 800, 160, 40, "#333333"));
    staticTexts.push(new TextDisplay(25, 830, "#cccccc", "Pesos:", "15px 'Comic Sans'"))
    staticTexts.push(new TextDisplay(62, 830, "#cccc00", "0", "25px 'Comic Sans'", true, player, "pesos"));
}


function displayDialogue(){
    c.fillStyle = "rgba(200, 180, 180, 0.8)";
    c.fillRect(250, 150, 400, 200);
    c.fillStyle = "#000000";
    c.font = "16px 'Comic Sans'"
    for(var i=0; i<dialogueText.length; i++){
        c.fillText(dialogueText[i], 260, 170 + i*20);
    }
}


var activeBars = [];
var staticDrawings = [];
var staticTexts = [];

function drawHud(){
    c.fillStyle = "#652800";
    c.fillRect(0, 11*gridSize, 1200, 200);

    var b = null;
    var ratio = 0;
    var fillAmount = 0;
    for(var i=0; i<activeBars.length; i++){
        b = activeBars[i];
        if(b instanceof StatBar){
            c.fillStyle = "#444444";
            c.fillRect(b.x, b.y, b.width, b.height);

            ratio = b.statShow / b.statMax;
            fillAmount = Math.floor(ratio * (b.width-20));

            //interior hollow
            c.fillStyle = b.colourBackground;
            c.fillRect(b.x+10, b.y+5, b.width-20, b.height-10);

            //interior actual amount
            c.fillStyle = b.colour;
            c.fillRect(b.x+10, b.y+5, fillAmount, b.height-10);

            //current / max of stat
            var statText = Math.floor(b.statShow).toString() + " / " + Math.floor(b.statMax).toString();
            c.font = "13px 'Comic Sans'";
            c.fillStyle = "#ffffff";
            c.fillText(statText, b.x+15, b.y+17);
        }

        if(b instanceof Progressbar){
            drawProgressBar(player.resourcing);
        }
    }

    if(player.resourcing !== null){
        drawProgressBar(player.resourcing);
    }

    for(var i=0; i<staticDrawings.length; i++){
        b = staticDrawings[i];
        c.fillStyle = b.colour;
        c.fillRect(b.x, b.y, b.width, b.height);
    }

    for(var i=0; i<staticTexts.length; i++){
        b = staticTexts[i];
        b.updateText();
        c.fillStyle = b.colour;
        c.font = b.font;
        c.fillText(b.text, b.x, b.y);
    }
}

function drawSkillIcons(){
    var slotAmount = Object.keys(player.hudBar1).length;
    var slot;
    c.fillStyle = "#444444";
    for(var i=0; i<slotAmount; i++){
        slot = player.hudBar1["slot"+i];
        c.fillRect(slot.x, slot.y, slot.width, slot.height);

        if(slot.icon !== null)
            c.drawImage(slot.icon.image, slot.x, slot.y)
    }
}

function drawProgressBar(b){
    if(b === null)

    c.fillStyle = "#444444";
    c.fillRect(b.x, b.y, b.width, b.height);

    ratio = b.filledAmount / b.progressMax;
    fillAmount = Math.floor(ratio * (b.width-20));

    //interior hollow
    c.fillStyle = b.colourBackground;
    c.fillRect(b.x+10, b.y+5, b.width-20, b.height-10);

    //interior actual amount
    c.fillStyle = b.colour;
    c.fillRect(b.x+10, b.y+5, fillAmount, b.height-10);
}

function updateBars(){
    for(var i=0; i<activeBars.length; i++){
        if(activeBars[i] instanceof StatBar){
            activeBars[i].statMax = activeBars[i].recipient[activeBars[i].statMaxName];
            activeBars[i].statShow = activeBars[i].recipient[activeBars[i].statShowName];
        }

        if(activeBars[i] instanceof Progressbar){
            activeBars[i].updateProgress();
            if(activeBars[i].finished){
                activeBars[i].onfinish(player);
                activeBars.splice(i, 1);
            }
        }
    }

    if(player.resourcing !== null){
        player.resourcing.updateProgress();
        if(player.resourcing.finished){
            player.resourcing.onfinish(player);
            player.resourcing = null;
        }
    }
}


class Icon{
    constructor(image, skillAssociation){
        this.image = image;
        this.skillAssociation = skillAssociation;
        this.overlay = 0;
    }
}

class Button{
    constructor(x, y, width, height, onclick, content, icon){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.onclick = onclick;
        this.content = content;
        this.icon = icon;
    }
}




function openInventory(){
    var start = 600;
    var collectiveSize = 70;
    for(var i=0; i<player.backpacks.length; i++){
        c.fillStyle = "#333333";
        c.fillRect(start-10, collectiveSize-10, (player.backpacks[i].width*68)+20, (player.backpacks[i].height*68)+20);

        c.fillStyle = "#330033";
        for(var j=0; j<player.backpacks[i].size; j++){
            //draw item box
            c.fillRect(start + 68*(j%player.backpacks[i].width), collectiveSize + 68*Math.floor(j/player.backpacks[i].width), 64, 64);

            //draw item if it exists
            if(player.backpacks[i].slots[j] !== null){
                c.drawImage(player.backpacks[i].slots[j].image,
                            start+2 + 68*(j%player.backpacks[i].width), collectiveSize+2 + 68*Math.floor(j/player.backpacks[i].width))
                
                //draw number of items if the item is not unique
                if(!player.backpacks[i].slots[j].unique){
                    c.fillStyle = "#dddddd";
                    c.fillText(player.backpacks[i].slots[j].amount, start+44 + 68*(j%player.backpacks[i].width),
                                collectiveSize+62 + 68*Math.floor(j/player.backpacks[i].width));            
                    c.fillStyle = "#330033";

                }
            }
        }
        collectiveSize += player.backpacks[i].height*68 + 20;
    }
}


var boundaryToDraw = {x: 0, y: 0, width: 1, height: 1};
function drawDebugStuff(){
    var boundaries = tree.retrieve(new pRect(player.x-10, player.y-10, 20, 20));
    c.strokeStyle = "#8888BB";
    c.beginPath();
    for(var i=0; i<boundaries.length; i++){
        c.rect((boundaries[i].x - player.xOffset)*gridSize, (boundaries[i].y - player.yOffset)*gridSize, boundaries[i].width*gridSize, boundaries[i].height*gridSize);
    }
    c.closePath();
    c.stroke();

    c.fillStyle = "#448844";
    c.fillRect((boundaryToDraw.x - player.xOffset)*gridSize, (boundaryToDraw.y - player.yOffset)*gridSize,
                boundaryToDraw.width*gridSize, boundaryToDraw.height*gridSize);
}