/*
examples
lightdense: weather = new Rain(5, 25, 15, 25, 2, 6, 0.6, "#0000aa")
semidense: weather = new Rain(5, 25, 15, 25, 2, 6, 2.5, "#0000aa")
dense: weather = new Rain(5, 25, 15, 25, 2, 6, 5.5, "#0000aa")

*/

class Rain{
    constructor(minSpeed, maxSpeed, minLength, maxLength, minThickness, maxThickness, dropletSpawn, colour){
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.minThickness = minThickness;
        this.maxThickness = maxThickness
        this.colour = colour;
        this.dropletSpawn = dropletSpawn;
    }
    minX = -5;
    maxX = 1600;
    minY = -200;
    maxY = 1000;
    rainDrops = [];

    updateRain(){
        var droplet = null;
        for(var i=0; i<this.rainDrops.length; i++){
            droplet = this.rainDrops[i]
            droplet[1] += droplet[2];
            if(droplet[1] > this.maxY){
                this.rainDrops.splice(i, 1);
                i--;
            }

        }
    }

    drawRain(){
        c.fillStyle = this.colour;
        for(var i=0; i<this.rainDrops.length; i++){
            c.fillRect(this.rainDrops[i][0], this.rainDrops[i][1], this.rainDrops[i][4], this.rainDrops[i][3]);
        }
    }

    updateSelf(){
        var currentDrops = this.dropletSpawn;
        for(var i=0; i<Math.ceil(this.dropletSpawn); i++){
            if(currentDrops > 1){
                this.createDroplet();
                this.currentDrops--;
            }

            else if(currentDrops > 0)
                if(Math.random() < currentDrops)
                    this.createDroplet();

        }

        this.updateRain();
        this.drawRain(this.rainDrops);
    }

    createDroplet(){
        this.rainDrops.push([Math.random()*(this.maxX - this.minX) + this.minX, this.minY, Math.random()*(this.maxSpeed - this.minSpeed) + this.minSpeed,
            Math.random()*(this.maxSpeed - this.minSpeed) + this.minSpeed, Math.random()*(this.maxThickness - this.minThickness) + this.minThickness]);
    }
}

var weather = null;