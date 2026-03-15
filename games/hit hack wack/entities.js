//this is just an array, which is slow...
//TODO: replace this with a quadtree
var entities = [];

var entityReturn = 0;
var ent;
function renderEntities(c){
    for(var i = 0; i<entities.length; i++){
        ent = entities[i];
        c.drawImage(images[ent.texture], ent.x - player.xOffset, ent.y - player.yOffset - ent.size*16);
    }
}

function updateEntities(){
    for(var i=0; i<entities.length; i++){
        entityReturn = entities[i].update();
        if(entityReturn === 100){
            entities.splice(i, 1);
            i--;
        }
    }
}


//TODO: implement hotkey for placing down entities in creative mode

//TODO: implement "spawn" area hotkey for creating spawning areas for entities, and a configuration menu for editing it

//javascript is just magic sometimes
//it just eats the code and spits out entities with an arbitrary amount of arguments just like that
function classFromName(name, ...args){
    var glass = eval(name);
    return new glass(...args)
}

//generic entity that just contains the methods and values that an extension probably needs, like position
class entity{
    //positions in worldspace
    constructor(x,y, texture, update){
        this.x = x;
        this.y = y;
        this.texture = texture;
        this.update = update;
        this.size = 1;
    }
}

//stuff that can be picked up. includes a pickup method for when the collectible is picked up
class collectible extends entity{
    constructor(x, y, texture, range, pickup){

        var update = function(){
            if(Math.abs(player.x -this.x) < this.range && Math.abs(player.y -8 -this.y) < this.range)
                return this.pickup();
        }
        super(x, y, texture, update);
        this.pickup = pickup;
        this.range = range;
    }
}

class yellowCoin extends collectible{
    constructor(x, y, texture = imageNumberFinder.yellowCoin){
        var pickup = function(){
            player.inventory.yellowCoins++;
            return 100;
        }
        super(x, y, texture, 16, pickup)
    }
}

class greenCoin extends collectible{
    constructor(x, y, texture = imageNumberFinder.greenCoin){
        var pickup = function(){
            player.inventory.greenCoins++;
            return 100;
        }
        super(x, y, texture, 25, pickup)
    }
}

class redCoin extends collectible{
    constructor(x, y, texture = imageNumberFinder.redCoin){
        var pickup = function(){
            player.inventory.redCoins++;
            return 100;
        }
        super(x, y, texture, 25, pickup)
    }
}

class creature extends entity{
    constructor(x, y, texture, update, health, hunt, attackrange, size, sightrange){
        super(x, y, texture, update);
        this.x2 = x+size*16; //left edge
        this.y2 = y-size*16; //top

        this.size = size;
        this.attackrange = attackrange;
        this.sightrange = sightrange;
        this.health = health;
        this.hunt = hunt;

        this.falling = true;
        this.lastUpdate = Date.now();
        this.yVelocity = 0;
        this.speed = 1;

    }
    //both contact and spot use square boxes as outer ranges, not circles
    contact = function(target){
        if(target.x > this.x - this.attackrange && target.x < this.x2 + this.attackrange)
            if(target.y < this.y + this.attackrange && target.y > this.y2 - this.attackrange)
                return true;
        return false;
    }

    spot = function(target){
        if(target.x > this.x - this.sightrange && target.x < this.x2 + this.sightrange)
            if(target.y < this.y + this.sightrange && target.y > this.y2 - this.sightrange)
                return true;
        return false;
    }

    jump = function(){
        this.yVelocity = -8;
        this.y -= 4;
        this.falling = true;
        console.log("trying...");
    }

}

class greenSlime extends creature{
    constructor(x, y, texture = imageNumberFinder.greenSlime){
        var update = function(){
            if(this.attackCooldown > 0)
                this.attackCooldown--;

            if(this.spot(player))
                this.hunt(player);
            
            else
                basicMovePhysics(this);

            this.lastUpdate = Date.now();
        }

        var hunt = function(target){
            basicMoveTowards(this, target);
            if(this.contact(player) && this.attackCooldown === 0){
                console.log("how");
                target.health -= 5;
                this.attackCooldown = 60;
            }
        }

        super(x, y, texture, update, 20, hunt, 16, 1, 256);

        this.attackCooldown = 60;
    }
}

//the creature will slide over the ground towards the target, and jump if it encounters an obstacle
var moveConstants = {
    timedistance: 0,
    airconstant: 0.024,
    airSpeed: 0.9,
    wall1: 0,
    wall2: 0,
    normalY: 0,
    normalYOffsetUp: 0,
    edgeLeft: 0,
    edgeRight: 0,
    now: 0,
    wallList: [],
}

//when an enemy wants to spot the player, a sightray has to hit 0 obstacles
function sightRay(creature, target){
    var xChecks = Math.ceil((creature.x - target.x)/blocksize)
    var yChecks = Math.ceil((creature.y - target.y)/blocksize)

    for(var i=0; i<xChecks; i++){

    }

}

function basicMovePhysics(creature){
    //creature is currently falling
    if(creature.falling){
        creature.y += creature.yVelocity * (moveConstants.now-creature.lastUpdate) * 0.07;
        console.log(creature.yVelocity * (moveConstants.now-creature.lastUpdate) * 0.07);
        creature.yVelocity += (moveConstants.now - creature.lastUpdate) * moveConstants.airconstant;
    }

    //make the creature be level with the ground
    if(worldArr[moveConstants.edgeLeft + (moveConstants.normalY)*worldWidth] !== 0
    || worldArr [(moveConstants.edgeRight) + (moveConstants.normalY)*worldWidth] !== 0){

        creature.falling = false;
        creature.yVelocity = 0;
        creature.y = moveConstants.normalY*16;
    }

    //stop yVelocity if there is a roof above (and y-velocity is negative)
    if((worldArr[moveConstants.edgeLeft + (moveConstants.normalY-2)*worldWidth] !== 0
        || worldArr[(moveConstants.edgeRight) + (moveConstants.normalY-2)*worldWidth] !== 0)
        && creature.yVelocity < 0){

        creature.yVelocity = -creature.yVelocity;
        //sets the creature one pixel below the roof, so that horizontal velocity is not affected much
        creature.y = creature.y - creature.y%16 + 17;
        creature.falling = true;
    }

    //falls if no block is under the creature
    if(worldArr[moveConstants.edgeLeft + (moveConstants.normalY)*worldWidth] === 0
        && worldArr[moveConstants.edgeRight + (moveConstants.normalY)*worldWidth] === 0){

        creature.falling = true;
    }
}

function basicMoveTowards(creature, target){
    moveConstants.normalY = (creature.y - (creature.y%16))/16;
    moveConstants.normalYOffsetUp = (creature.y-4 - ((creature.y-4)%16))/16;
    moveConstants.edgeLeft = (creature.x - creature.x%16)/16;
    moveConstants.edgeRight = (creature.x + 15 - (creature.x + 15)%16)/16;
    //TODO: make sure that the edges consider the creatures size

    moveConstants.now = Date.now();
    moveConstants.timedistance = (moveConstants.now - creature.lastUpdate) * 0.1;

    basicMovePhysics(creature);

    //AI movement time!
    if(creature.falling)
        addedSpeed = creature.speed * moveConstants.airSpeed * moveConstants.timedistance;
    else
        addedSpeed = creature.speed * moveConstants.timedistance;


    //if the player is to the left, then move to the left
    if(target.x < creature.x){
        creature.x -= addedSpeed

        //construct the walls to check for collision
        for(var i=0; i<creature.size+1; i++){
            moveConstants.wallList.push(worldArr[(creature.x - (creature.x%16))/16 +
                ((creature.y- (i+1)*(creature.size*16) - (creature.y%16))/16)*worldWidth] !== 0);
        }

        //attempt uphill-step assist
        if(moveConstants.wallList[0] && !creature.falling && !moveConstants.wallList[1]){
            //if the creature has a size of 1, the uphill-step assist is easy
            if(creature.size === 1){
                creature.y = creature.y-16 - creature.y%16;
            }

            //checks if there is a lower wall and not a higher wall, and applies uphill-stepassist if so on creatures with size > 1
            else{
                var noWallsInTheWay = true;
                for(var i=1; i<moveConstants.wallList.length; i++){
                    if(moveConstants.wallList[i]){
                        noWallsInTheWay = false;
                        break;
                    }
                }
                if(noWallsInTheWay)
                    creature.y = creature.y-16 - creature.y%16;
            }
        }
        //wall? stop, and try to jump
        else{
            for(var i=0; i<moveConstants.wallList.length; i++){
                if(moveConstants.wallList[i]){
                    creature.x = creature.x - creature.x%16 + 16;
                    if(!creature.falling)
                        creature.jump();
                    break;
                }
            }
        }


    }

    //target is to the right
    else if(target.x > creature.x){
        creature.x += addedSpeed

        //construct the walls to check for collision
        for(var i=0; i<creature.size+1; i++){
            moveConstants.wallList.push(worldArr[(creature.x + creature.size*16 - (creature.x%16))/16 +
                ((creature.y- (i+1)*(creature.size*16) - (creature.y%16))/16)*worldWidth] !== 0);
        }

        //if the creature has a size of 1, the uphill-step assist is easy
        if(moveConstants.wallList[0] && !creature.falling && !moveConstants.wallList[1]){
            //if the creature has a size of 1, the uphill-step assist is easy
            if(creature.size === 1){
                creature.y = creature.y-16 - creature.y%16;
            }

            //checks if there is a lower wall and not a higher wall, and applies uphill-stepassist if so on creatures with size > 1
            else{
                var noWallsInTheWay = true;
                for(var i=0; i<moveConstants.wallList.length; i++){
                    if(moveConstants.wallList[i]){
                        noWallsInTheWay = false;
                        break;
                    }
                }
                if(noWallsInTheWay)
                    creature.y = creature.y-16 - creature.y%16;
            }
        }
        //wall? stop.
        else{
            for(var i=0; i<moveConstants.wallList.length; i++){
                if(moveConstants.wallList[i]){
                    creature.x = creature.x - creature.x%16;
                    if(!creature.falling)
                        creature.jump();
                    break;
                }
            }
        }
    }


    //update the targets x2 and y2 coordinates
    creature.x2 = creature.x + creature.size*16;
    creature.y2 = creature.y - creature.size*16;
    moveConstants.wallList = [];
}
