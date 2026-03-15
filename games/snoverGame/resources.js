/**
* @param x.y positional values of the resource. The dot is not supposed to be there but oh well
* @available tells whether or not the resource can be mined or not
* @image image the resource currently uses
* @type type of resource, such as iron or stone
*/
class Resource{
    constructor(x, y, available, image, type, density){
        this.x = x;
        this.y = y;
        this.available = available;
        this.totalUnavailableTime = 2000; //milliseconds
        this.unavailableTime = 0;
        this.image = image;
        this.type = type;
        this.resourceCount = 1;
        this.density = density;
    }

    mined(player){
        this.resourceCount--;
        if(this.resourceCount === 0){
            this.setUnavailableTime(player);
            this.available = false;
            this.image = bilder.emptyResource;
            resourcesOnWatch.push(this);
        }
        return 1;
    }

    setUnavailableTime(){
        this.unavailableTime = this.totalUnavailableTime;
    }

    replenish(){
        this.resourceCount++;
        this.available = true;
        this.image = bilder[this.type];
    }
}