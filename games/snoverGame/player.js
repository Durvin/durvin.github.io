var player = {
    xOffset: 2262,
    yOffset: 1194,
    width: 0.4,
    height: 0.7,
    x: 2268,
    y: 1200,
    image: null,
    imageBase: "player",

    resources: {stone: 0, iron: 0, maple: 0},
    resourcesMinedTotal: {stone: 0, iron: 0},
    resourcing: null,
    resourceTarget: null,
    progressPosition: [null, null],
    progressFinish: null,
    action: null,
    skills: {mining: 1, woodcutting: 1},
    selectedEnemy: null,

    team: teamClassifier.allies,

    name: "Henry",
    direction: "Down",
    directionVector: [0,1],

    backpacks: [],

    attack: 1,
    defence: 1,
    characterLevel: 1,
    mana: 20,
    maxMana: 20,
    manaRegen: 1,
    manaRegenPercent: 0.01,
    health: 20,
    maxHealth: 20,
    healthRegen: 1,
    healthRegenPercent: 0.01,
    experience: 0,
    experienceRequirement: 25,

    strength: 5,
    dexterity: 5,
    vitality: 5,
    intelligence: 5,
    wisdom: 5,
    willpower: 5,
    luck: 5,
    speed: 5,
    speedboost: 0,

    globalCooldown: 0,
    basicCooldown: 0,

    pesos: 200,

    equipment: {
        mainHand: testWeapon
    },

    inventory: {
        slot0: testWeapon
    },

    attacks: {},

    hudBar1: {
    },

    cooldowns: [],

    levelUp(){
        this.characterLevel++;
        this.experience -= this.experienceRequirement;
        this.experienceRequirement = characterExperienceRequirements[this.characterLevel-1];
        
        this.maxHealth = Math.floor(this.maxHealth * 1.07 +10);

        playMusic(audios.levelup);

        if(this.experience >= this.experienceRequirement)
            this.levelUp();
    },

    whenDefeated(){
        console.log("you are LOSER");
        return player;
    }
}

function pickup(x, y, item, player){
    item.onPickup();
    if(item.contentName === "pesos"){
        player.pesos += item.amount;
        playMusic(audios.coindropquick);
        tree.remove(item.id);
    }
}

function addExperience(player, experience){
    player.experience += experience;
    if(player.experience >= player.experienceRequirement)
        player.levelUp();
}

function updatePlayerStats(timeInMillis){
    ratio = timeInMillis / 1000;
    player.health += player.healthRegen * ratio;
    player.health += player.healthRegenPercent * player.maxHealth * ratio;

    if(player.health > player.maxHealth)
        player.health = player.maxHealth;

    player.mana += player.manaRegen * ratio;
    player.mana += player.manaRegenPercent * player.maxMana * ratio;

    if(player.mana > player.maxMana)
        player.mana = player.maxMana;
}

function addBasicAttacks(){
                                                    //name, range, damage, cooldown, chargeup, duration, resetTimer
    player.attacks["basic_attack"] = new Attack("Basic Attack", 1, attackKernels.single, 1, 1000, 0, 10, 10);
    player.attacks["basic_attack"].onUse = function(){
        var numb = Math.floor(Math.random()*5)+1;
        playMusic(audios["basicattack"+numb]);
    };
    player.attacks["overpowered"]  = new Attack("overpowered", 6, attackKernels.lineten, 1000, 1000, 0, 810, 50);
    player.attacks["overpowered"].onUse = function(){playMusic(audios.fan)};
    
    player.attacks["fireball"]  = new Attack("fireball", 3, attackKernels.plusfive, 1000, 1000, 0, 810, 50);
    player.attacks["fireball"].onUse = function(){playMusic(audios.death)};
}

function addPlayerButtons(){
    var slotAmount = 10;
    var skillIconStartX = 128;
    var skillIconStartY = 740;
    var button;
    for(var i=0; i<slotAmount; i++){
        button = new Button(skillIconStartX + i*85, skillIconStartY, 64, 64, function(){}, null, null);
        player.hudBar1["slot"+i] = button;
    }

    basicAttackIcon = new Icon(bilder["basic attack"], player.attacks.basic_attack);
    button = new Button(skillIconStartX, skillIconStartY, 64, 64, playerPerformAttack, player.attacks["basic_attack"], basicAttackIcon);
    player.hudBar1.slot0 = button
    buttons.push(button);

    player.hudBar1.slot1.onclick = playerPerformAttack;
    player.hudBar1.slot1.content = player.attacks["overpowered"];
    player.hudBar1.slot1.icon = basicAttackIcon;
    buttons.push(player.hudBar1.slot1);

    player.hudBar1.slot2.onclick = playerPerformAttack;
    player.hudBar1.slot2.content = player.attacks["fireball"];
    player.hudBar1.slot2.icon = basicAttackIcon;
    buttons.push(player.hudBar1.slot2);

}

var characterExperienceRequirements = [
    25, 63, 113, 180, 260, 350, 460, 590, 740, 910, 1110, 1340, 1600, 1900, 2240, 2630, 3070, 3560, 4120, 4750, 5450, 6240, 7120, 8110, 9210, 10440, 11800, 13300, 15000, 16900, 19000, 21300, 23900, 26800, 30000, 33500, 37400, 41700, 46400, 51600, 57400, 63800, 70800, 78600, 87100, 96500, 106900, 118300, 130800, 144600, 159800, 176500, 194800, 214900, 237000, 261200, 287800, 316900, 348900, 383900, 422300, 464400, 510500, 561000, 616300, 676800, 743000, 815400, 894600, 981300, 1076100, 1180000, 1293000, 1417000, 1552000, 1700000, 1861000, 2037000, 2229000, 2439000, 2668000, 2918000, 3191000, 3489000, 3814000, 4168000, 4555000, 4977000, 5437000, 5938000, 6484000, 7079000, 7728000, 8435000, 9205000, 10044000, 10958000, 11953000, 13037000, 14217000, 15502000, 16901000, 18424000, 20082000, 21886000, 23849000, 25986000, 28311000, 30840000, 33591000, 36584000, 39839000, 43379000, 47229000, 51415000, 55966000, 60914000, 66293000, 72140000, 78496000, 85404000, 92911000, 101069000, 109930000, 119560000, 130020000, 141390000, 153740000, 167150000, 181720000, 197540000, 214720000, 233380000, 253640000, 275640000, 299530000, 325470000, 353630000, 384200000, 417380000, 453390000, 492480000, 534900000, 580940000, 630900000, 685110000, 743940000, 807770000, 877020000, 952150000, 1033650000, 1122060000, 1217970000, 1322000000, 1434830000, 1557210000, 1689930000, 1833860000, 1989950000, 2159210000, 2342740000, 2541740000, 2757510000, 2991440000, 3245060000, 3520010000, 3818070000, 4141170000, 4491390000, 4871010000, 5282470000, 5728420000, 6211740000, 6735540000, 7303180000, 7918320000, 8584900000, 9307200000, 10089840000, 10937800000, 11856600000, 12852000000, 13930400000, 15098700000, 16364400000, 17735500000, 19220700000, 20829500000, 22572100000, 24459600000, 26503900000, 28718000000, 31116000000, 33713000000, 36525400000, 39571100000, 42869200000, 46440600000, 50307800000
];

function playerPerformAttack(){
    if(player.action !== null)
        return;
    
    var button = clickedButton;
    var attack = button.content;

    if(attack.currentCooldown !== 0)
        return;
    
    player.action = attack;
    attack.currentCooldown = attack.cooldown / (1+(player.dexterity/100));
    player.cooldowns.push(attack);
    player.resourcing = new Progressbar(200, 200, 300, 40, 10, attack.chargeup, "#ee0000", "#440000", attackFinished);
}

function attackFinished(){
    player.action.cooldown = player.action.maxCooldown;
    if(player.action.type === "attack"){
        playerSetupAttack(player.x, player.y, player.direction, player.action);
    }
    player.action = null;
}

function playerSetupAttack(x, y, direction, attack){
    var attackTiles = [];
    var attackVector = [0,0];
    var attackDirection = 0;
    if(direction === "Right"){
        attackVector[0] = 1;
        attackDirection = 0;
    }
    
    else if(direction === "Down"){
        attackVector[1] = 1;
        attackDirection = 1;
    }
    
    else if(direction === "Left"){
        attackVector[0] = -1;
        attackDirection = 2;
    }
    
    else if(direction === "Up"){
        attackVector[1] = -1;
        attackDirection = 3;
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
    
    activeAttacks.push(new ActiveAttack(attackTiles, attack, x+attackVector[0], y+attackVector[1], player.team, attackDirection));
    attack.onUse();
}

var activeAttacks = [];

function updatePlayerDirection(direction){
    if(direction[0] > 0){
        player.image = bilder[player.imageBase + "Right"];
        player.direction = 0;
        player.directionVector = [1,0];
    }
    if(direction[0] < 0){
        player.image = bilder[player.imageBase + "Left"];
        player.direction = 4;
        player.directionVector = [-1,0];
    }
    if(direction[1] > 0){
        player.image = bilder[player.imageBase + "Down"];
        player.direction = 2;
        player.directionVector = [0,1];
    }
    if(direction[1] < 0){
        player.image = bilder[player.imageBase + "Up"];
        player.direction = 6;
        player.directionVector = [0,-1];
    }
}

function addToPlayerBackpack(item){
    for(var i=0; i<player.backpacks.length; i++){
        player.backpacks[i].put(item);
    }
}

class Backpack{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.isfull = false;
        this.size = width*height;

        this.slots = new Array(this.size).fill(null);
    }

    get = function(slot){
        return this.slots[slot-1]; //so yes, using get means starting at slot 1
    }

    put(item){
        if(this.full)
            return false;
        
        var slot = this.searchForItem(item);
        if(slot !== -1){
            this.slots[slot].amount += item.amount;
            return;
        }
            


        for(var i=0; i<this.size; i++){
            if(this.slots[i] === null){
                this.slots[i] = item;
                if(i === this.size-1)
                    this.full = true;
                
                return true;
            }
        }
    }

    searchForItem(item){
        for(var i=0; i<this.slots.length; i++){
            if(this.slots[i] === null)
                continue;
            if(this.slots[i].name === item.name && !this.slots[i].unique && this.slots[i].amount < this.slots[i].maxAmount);
                return i;
        }
        return -1;
    }
}