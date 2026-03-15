class Entity{
    constructor(x, y, image, xOffset, yOffset, tiledraw){
        this.x = x;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.y = y;
        this.image = bilder[image];
        this.width = 1;
        this.height = 1;
        this.id = id++;
        this.team = teamClassifier.enemy;
        this.direction = 0;
        this.directionVector = [0,0];
        this.tiledraw = tiledraw;
    }

    //onuse(){return null};
}

class Wall extends Entity{
    constructor(x, y, width, height, image, multiDraw = false, xOffset = 0, yOffset = 0, tiledraw = true){
        super(x, y, image, xOffset, yOffset, tiledraw);
        this.width = width;
        this.height = height;
        this.multiDraw = multiDraw;
    }
}

class Floor extends Entity{
    constructor(x, y, width, height, image, speedboost = 0, xOffset = 0, yOffset = 0, tiledraw = true){
        super(x, y, image, xOffset, yOffset, tiledraw);
        this.width = width;
        this.height = height;
        this.speedboost = speedboost;
    }
}

class Interactible extends Entity{
    constructor(x, y, width, height, image, passable, xOffset = 0, yOffset = 0, tiledraw = true, onUse = function(){}){
        super(x, y, image, xOffset, yOffset, tiledraw);
        this.width = width;
        this.height = height;
        this.passable = passable;
        this.onUse = onUse;
    }
}

class Tree extends Interactible{
    constructor(x, y, width, height, image, passable, treetype){
        super(x, y, width, height, image, passable, 0, 0, false, null);
        this.treetype = treetype;

    }

    onUse = function(){
        useSkill("woodcutting", this, this.treetype);
    }

    mined = function(){
        return [new Item(null, null, "mapleLog", this.treetype, this.treetype, 1)];
    }
}

class Door extends Interactible{
    constructor(x, y, width, height, imageClosed, imageOpen, open, openCriteria, soundOpen, soundClose){
        super(x, y, width, height, imageClosed, open, 0, 0, false, null);
        this.imageOpen = imageOpen;
        this.imageClosed = imageClosed;
        this.open = open;
        this.openCriteria = openCriteria;
        this.soundOpen = soundOpen;
        this.soundClose = soundClose;
        if(this.open)
            this.image = imageOpen;
        
        this.onUse = function(){
            if(this.checkCriteria){
                this.open = !this.open;
                if(this.open){
                    this.image = bilder[this.imageOpen];
                    playMusic(this.soundOpen);
                }
                else{
                    this.image = bilder[this.imageClosed];
                    playMusic(this.soundClose);
                }
            }
        }
    }



    checkCriteria(){
        if(this.openCriteria === null)
            return true;
        //if(this.openCriteria.substring(0, 3) === "key")
        //    return checkHasItemName(player, this.openCriteria);
    }


}

var teamClassifier = {
    enemy: 0,
    allies: 1,
    npc: 2,
    pvpOpponent: 3,
}

class Item extends Entity{
    constructor(x, y, image, name, contentName, amount, unique = false){
        super(x, y, image);
        this.name = name;
        this.contentName = contentName;
        this.amount = amount;
        this.maxAmount = 64;
        this.width = 1;
        this.height = 1;
        this.unique = unique;
    }
    onPickup(){}
}

var npcs = [];

class NPC extends Entity{
    constructor(x, y, image, name, dialogueTree, enemy){
        super(x, y, image);
        this.name = name;
        this.dialogueTree = dialogueTree;
        this.enemy = enemy;

        this.dialogueTree.owner = this;
    }

    //some NPCs are immune to damage
    //some will get angry
    //some will be NPCs before they become an enemy (boss dialogue)
    onAttacked(){

    }

    onUse(){
        dialogueText = this.dialogueTree.stateProcessor();
        if(dialogueText[0] === "becomeEnemy")
            turnNPCIntoEnemy(this);
        else if(dialogueText[0] === "becomeAir")
            turnNPCIntoAir(this);

        dialogueOwner = this;
        if(this.useSound !== null)
            playMusic(this.useSound);
    }


}

function turnNPCIntoEnemy(npc){
    dialogueText = null;
    tree.remove(npc.id);
    var enemy = new Enemy(  npc.x, npc.y, npc.image, npc.enemy.health, npc.enemy.atk,
                            npc.enemy.def, npc.enemy.whenDefeated, npc.enemy.movementAi, npc.enemy.attacks);
    enemies.push(enemy);
    tree.insert(enemy);
}

function turnNPCIntoAir(npc){
    dialogueText = null;
    tree.remove(npc.id);
}

class DialogueTree{
    constructor(greeting, repeatGreeting){
        this.greeting = greeting;
        this.repeatGreeting = repeatGreeting;
        this.currentDialogue = "greeting";
    }

    owner = null;
    greeted = false;
    textPosition = -1;
    currentText = "";

    stateProcessor(){
        if(!this.greeted){
            this.textPosition++;
            this.owner.useSound = this[this.currentDialogue][this[this.currentDialogue].length-1];
            
            var toReturn = this[this.currentDialogue][this.textPosition].split("\n");

            if(this.textPosition === this[this.currentDialogue].length - 2){
                this.currentDialogue = "repeatGreeting";
                this.textPosition = -1;
                this.greeted = true;
            }

            return toReturn;
        }

        else{
            this.textPosition++;
            if(this.textPosition > this[this.currentDialogue].length -2)
                this.textPosition = 0;
            this.owner.useSound = this[this.currentDialogue][this[this.currentDialogue].length-1];
            
            if(this[this.currentDialogue][this.textPosition] === "becomeEnemy")
                return ["becomeEnemy"];
            
            return this[this.currentDialogue][this.textPosition].split("\n");
        }
    }
}

//TODO: implement elemental attacks, resistances, shields and hp bars (phases for bosses?)
class Enemy extends Entity{
    constructor(x, y, image, health, atk, def, whenDefeated = null, movementAi = null, attacks = []){
        super(x, y, image);
        this.health = health;
        this.atk = atk;
        this.def = def;
        this.sightRange = 10;
        this.attackRange = 1;
        this.aggressive = false;
        this.experience = 10000;
        this.speed = 5;
        
        //
        this.target = player;
        if(whenDefeated !== null)
            this.whenDefeated = whenDefeated;
        if(movementAi !== null)
            this.movementAi = movementAi;
        this.attacks = attacks;
    }

    movementTimer = 4000;
    currentMovementTimer = 2000;
    aggressiveMovementTimer = 20;

    whenDefeated(){
        return [];
    }

    movementAi(){
        basicMovement(this);
    }

    attack(){
        if(this.attacks.length === 0)
            return;

        //find all attacks that are not on cooldown and can be performed
        //roll on which one to do
        //do it
        var pickedAttack = null;
        var max = 0;
        var potentialAttacks = [[]];

        for(var i=0; i<this.attacks.length-1; i++){
            if(this.attacks[i+1].cooldown === 0){
                potentialAttacks.push(this.attacks[i+1]);
                potentialAttacks[0].push(this.attacks[0][i]);
                max += this.attacks[0][i];
            }
        }

        var atkPicker = Math.random()*max;
        for(var i=0; i<this.attacks[0].length; i++){
            if(atkPicker < potentialAttacks[0][i]){
                pickedAttack = potentialAttacks[i+1];
                break;
            }
            else{
                pickedAttack -= potentialAttacks[0][i];
            }
        }

        this.currentMovementTimer = pickedAttack.selfStop;
        setupAttack(this.x, this.y, findAttackDirection(this, this.target), pickedAttack, this);
    }
}

var directionVectors = [[0, 1], [0, -1], [1, 0], [-1, 0]];

function updateDirection(direction, mover){
    if(direction[0] === 1){
        mover.direction = "Right";
        mover.directionVector = [1,0];
    }
    if(direction[0] === -1){
        mover.direction = "Left";
        mover.directionVector = [-1,0];
    }
    if(direction[1] === 1){
        mover.direction = "Down";
        mover.directionVector = [0,1];
    }
    if(direction[1] === -1){
        mover.direction = "Up";
        mover.directionVector = [0,-1];
    }
}

function findAttackDirection(dealer, target){
    var num = 0;
    if(dealer.x < target.x){
        //if(dealer.y < )
        num = 0;
    }
}


function getAttackVectorAngle(enemy, target){
    return Math.atan(enemy.y - target.y)/(enemy.x - target.x)*180/Math.PI;
}


var spawners = [];
class Spawner{
    constructor(x, y, gridX, gridY, width, height, enemy, level, spawnMax){
        this.x = x;
        this.y = y;
        this.gridX = gridX;
        this.gridY = gridY;
        this.width = width;
        this.height = height;
        this.enemy = enemy;
        this.enemyLevel = level;
        this.spawnMax = spawnMax;
    }
    ticksToWait = 10;
    ticksToWaitMax = 25;
    currentSpawn = 0;


    update(ticks){
        for(var i=0; i<ticks; i++){
            this.ticksToWait--;
            if(this.ticksToWait === 0){
                this.ticksToWait = this.ticksToWaitMax;
                this.tryToSpawnEnemy();
            }
        }
    }

    maxAttempts = 5;
    tryToSpawnEnemy(){
        if(this.currentSpawn === this.spawnMax)
            return;
        
        var x;
        var y;
        for(var i=0; i<this.maxAttempts; i++){
            x = Math.floor(Math.random()*this.width) + this.x;
            y = Math.floor(Math.random()*this.height) + this.y;

            if(grid[x][y] === 0){
                var enemy = new this.enemy(x, y, this);
                grid[x][y] = enemy;
                enemies.push(enemy);
                this.currentSpawn++;
                return;
            }
        }
    }
}

function spawnEnemy(enemy, number=1){
    number = 1;
    for(var i=0; i<number; i++){
        enemies.push(enemy);
        tree.insert(enemy);
    }
}

class BlueSlime extends Enemy{
    name = "Blue Slime";
    constructor(x, y, spawner){
        super(x, y, bilder.blueSlime, 5, 1, 0);
        this.experience = 2;
        this.spawner = spawner;
    }


    movementAi(){
        basicMovement(this);
    }

    whenDefeated(){
        if(Math.random() > 0.5)
            playMusic(audios.death);
        else
            playMusic(audios.death2);

        if(this.spawner !== null)
            this.spawner.currentSpawn--;
        
        var amount = Math.floor(Math.random()*6 + 5);
        var item = new Item(this.x, this.y, bilder.coins, "Pesos", "pesos", amount);
        var returnArr = [];
        returnArr.push(item);
        return returnArr;
    }
}

class Rat extends Enemy{
    name = "Rat";
    constructor(x, y, spawner){
        super(x, y, bilder.rat, 5, 1, 0, null, null, [[1], new Attack("bite", 1, attackKernels.single, 1, 1000, 0, 10, 1000, 1000)]);
        this.experience = 2;
        this.spawner = spawner;
    }

    movementAi(){
        if(this.aggressive)
            this.currentMovementTimer = this.aggressiveMovementTimer*0.5 + this.aggressiveMovementTimer*Math.random()*0.5;
        else
            this.currentMovementTimer = this.movementTimer*0.5 + this.movementTimer*Math.random()*0.5;

        var didMove = false;
        if(getDistance(this, player) <= this.attackRange){
            this.attack(player);
        }
        else{
            didMove = basicAggressiveMovement(this, 10, player);
        }

        if(didMove && Math.random() > 0.9)
            playMusic(audios["ratidle"+(Math.floor(Math.random()*2)+1)]);
    }

    whenDefeated(){
        playMusic(audios["ratdeath"+(Math.floor(Math.random()*2)+1)]);

        return [];
    }
}


function basicMovement(enemy){
    enemy.currentMovementTimer = enemy.movementTimer*Math.random();

    //choose a direction
    var attempts = 4;
    for(var i=0; i<attempts; i++){
        var direction = directionVectors[Math.floor(Math.random()*4)];
        if(enemy.x + direction[0] > -1 && enemy.x + direction[0] < tree.bounds.width){
            if(enemy.y + direction[1] > -1 && enemy.y + direction[1] < tree.bounds.height){
                //ok movememnt is legal, but will it stack on something else?

                var checkArea = new pRect(enemy.x+direction[0], enemy.y+direction[1])
                var entitiesToCheck = tree.retrieve(checkArea);
                var entitiesCollides = listCheckCollision(checkArea, entitiesToCheck)

                if(entitiesCollides.length > 0)
                    continue;
                
                enemy.x = enemy.x + direction[0];
                enemy.y = enemy.y + direction[1];
                updateDirection(direction, enemy);
                return true;
            }
        }
    }
    return false;
}

function getDistance(t1, t2){
    var x = Math.min(Math.abs(t1.x - t2.x), Math.abs(t1.x+(t1.width) - t2.x), Math.abs(t2.x+(t2.width) - t1.x));
    var y = Math.min(Math.abs(t1.y - t2.y), Math.abs(t1.y+(t1.height) - t2.y), Math.abs(t2.y+(t2.height) - t1.y));
    return x + y;
}

function canMoveThatDirection(enemy, directionVector){

    var checkArea = new pRect(enemy.x-0.4+directionVector[0], enemy.y-0.4+directionVector[1], enemy.width+0.8, enemy.height+0.8)
    var entitiesToCheck = tree.retrieve(checkArea);
    var canWalk = true;

    for(var i=0; i<entitiesToCheck.length; i++){
        if(aabb(entitiesToCheck[i], checkArea) && entitiesToCheck[i].id !== enemy.id){
            //boundaryToDraw = entitiesToCheck[i];
            if(!(entitiesToCheck[i] instanceof Item || entitiesToCheck[i] instanceof Floor || entitiesToCheck[i] instanceof Interactible))
                return false;
            if(entitiesToCheck[i] instanceof Interactible && !entitiesToCheck[i].open)
                return false;
        }
    }
    return canWalk;
}

function aabb(a, b) {
    return (
        a.x <= b.x+b.width  &&
        a.x+a.width >= b.x  &&
        a.y <= b.y+b.height &&
        a.y+a.height >= b.y
    );
}
  

function basicAggressiveMovement(enemy, sightrange, target){
    var direction = [0,0];

    enemy.aggressive = true;
    if(getDistance(enemy, target) > sightrange){
        enemy.aggressive = false;
        return basicMovement(enemy);
    }

    else{
        if(     enemy.x+(enemy.width)       < target.x    && canMoveThatDirection(enemy, [enemy.speed/100,0]))
            direction[0]+= enemy.speed/100;
        else if(enemy.x                      > target.x+target.width    && canMoveThatDirection(enemy, [-enemy.speed/100,0]))
            direction[0]-= enemy.speed/100;
        else if(enemy.y+(enemy.height)      < target.y    && canMoveThatDirection(enemy, [0,enemy.speed/100]))
            direction[1]+= enemy.speed/100;
        else if(enemy.y                      > target.y+target.height    && canMoveThatDirection(enemy, [0,-enemy.speed/100]))
            direction[1]-= enemy.speed/100;
    }

    enemy.x += direction[0];
    enemy.y += direction[1];
    updateDirection(direction, enemy);
    return false;
}