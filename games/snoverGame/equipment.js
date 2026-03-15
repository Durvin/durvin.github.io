class Equipment{
    constructor(name, owner){
        this.name = name;
        this.owner = owner;
    }
}

class Weapon extends Equipment{
    constructor(name, owner, attack, range, speed){
        super(name, owner);
        this.attack = attack;
        this.range = range;
        this.speed = speed;
    }
}

var testWeapon = new Weapon("super knife", null, 2, 2, 5);