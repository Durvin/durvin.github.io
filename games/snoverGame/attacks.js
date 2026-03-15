class Attack{
    constructor(name, range, kernel, damage, cooldown, chargeup, duration, resetTimer, selfStop = 0){
        this.name = name;
        this.range = range;
        this.kernel = kernel;
        this.damage = damage;
        this.cooldown = 0;
        this.maxCooldown = cooldown;
        this.chargeup = 0;
        this.maxChargeup = chargeup;
        this.duration = duration;
        this.resetTimer = resetTimer;
        this.selfStop = selfStop;
    }
    type = "attack";
    currentCooldown = 0;

    onUse(){}
}

class ActiveAttack{
    constructor(tiles, attack, x, y, team, attackDirection){
        this.attack = attack;
        this.name = attack.name;
        this.tiles = tiles;
        this.duration = attack.duration;
        this.resetTimer = attack.resetTimer;
        this.x = x;
        this.y = y;
        this.width = attackDirection%2 === 1 ? attack.kernel[1] : attack.kernel[0];
        this.height = attackDirection%2 === 1 ? attack.kernel[0] : attack.kernel[1];
        this.team = team;
    }
    hasHit = [];
    timers = [];

    attemptHit(target){
        //friendly fire off
        if(target.team === this.team)
            return;
        //cannot hit with the same attack every frame
        if(this.hasHit.includes(target.id))
            return;
        //check if the target is actually in the target area (rough pass)
        if(!checkCollision(this, target))
            return;

        //check each of the attacks tiles and see if the player is in it (fine pass)
        var willHit = false;
        for(var i=0; i<this.tiles.length; i++){
            if(checkCollisionTiles(target, this.tiles[i], this)){
                willHit = true;
                break;
            }
        }

        if(willHit){
            hitAttack(target, this.attack.damage);
            this.hasHit.push(target.id);
            this.timers.push(this.resetTimer);
        }
    }
}

function setupAttack(x, y, direction, attack, dealer){
    var attackTiles = [];
    var attackVector = [0,0];
    var attackDirection = 0;

    switch(direction){
        case 0:
            attackVector[0] = 1;
            attackDirection = 0;
            break;
        case 1:
            break;
        case 2:
            attackVector[1] = 1;
            attackDirection = 1;
            break;
        case 3:
            break;
        case 4:
            attackVector[0] = -1;
            attackDirection = 2;
            break;
        case 5:
            break;
        case 6:
            attackVector[1] = -1;
            attackDirection = 3;
            break;
        case 7:
            break;
        

    }
    
    //add kernel tiles
    for(var i=2; i<attack.kernel.length; i++){
        var k = attack.kernel[i];
        if(attackDirection%2 === 1){
            attackTiles.push(new AttackTile(
                k.y - attack.kernel[1]/2 + 0.5,
                k.x - (attackDirection > 1 ? attack.kernel[1]-1 : 0),
                k.height, k.width));
        }
        else{
            attackTiles.push(new AttackTile(
                k.x - (attackDirection > 1 ? attack.kernel[0]-1 : 0),
                k.y - attack.kernel[1]/2 + 0.5, 
                k.width, k.height));
        }
    }
    
    activeAttacks.push(new ActiveAttack(attackTiles, attack, x+attackVector[0], y+attackVector[1], dealer.team, attackDirection));
    attack.onUse();
}

function drawAttacks(){
    var t;
    var a;
    c.fillStyle = "rgba(150, 40, 40, 0.4)"
    for(var i=0; i<activeAttacks.length; i++){
        a = activeAttacks[i];
        for(var j=0; j<activeAttacks[i].tiles.length; j++){
            t = activeAttacks[i].tiles[j];
            c.fillRect((a.x + t.x - player.xOffset)*gridSize, (a.y + t.y - player.yOffset)*gridSize, t.width*gridSize, t.height*gridSize);
        }
    }
}

class AttackTile{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

//TODO: implement resistances and defence stuff
//TODO: implement attackmodifiers, like typing and whatnot
function hitAttack(target, damage){
    target.health -= damage;
}


var attackKernels = {
    single:     [1, 1, new AttackTile(0, 0, 1, 1)],

    plusfive:   [5, 5,
                    new AttackTile(1, 1, 3, 3),
                    new AttackTile(2, 0, 1, 1),
                    new AttackTile(0, 2, 1, 1),
                    new AttackTile(4, 2, 1, 1),
                    new AttackTile(2, 4, 1, 1),
                    /*
                    0,0,1,0,0,
                    0,1,1,1,0,
                    1,1,1,1,1,
                    0,1,1,1,0,
                    0,0,1,0,0
                    */
                ],

    lineten:    [10, 1, new AttackTile(0, 0, 10, 1)],
}