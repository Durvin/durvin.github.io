class Shape{
    constructor(x, y, width, height, colour){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = colour;
    }
}

class Progressbar extends Shape{
    constructor(x, y, width, height, updatePerTick, progressMax, colour, colourBackground, onfinish){
        super(x, y, width, height, colour);
        this.updatePerTick = updatePerTick;
        this.progressMax = progressMax;
        this.colourBackground = colourBackground;
        this.onfinish = onfinish;
    }
    filledAmount = 0;
    finished = false;

    updateProgress(){
        this.filledAmount += this.updatePerTick;
        if(this.filledAmount > this.progressMax){
            this.filledAmount = this.progressMax;
            this.finished = true;
        }
    }
}

class StatBar extends Shape{
    constructor(x, y, width, height, recipient, statShowName, statMaxName, colour, colourBackground){
        super(x, y, width, height, null);
        this.statShowName = statShowName;
        this.statMaxName = statMaxName;
        this.colour = colour;
        this.recipient = recipient;
        this.colourBackground = colourBackground;
    }
    statShow = 0;
    statMax = 0;
}

class TextDisplay{
    constructor(x, y, colour, text, font, canUpdate = false, recipient = null, source = null){
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.text = text;
        this.font = font;
        this.canUpdate = canUpdate;
        this.recipient = recipient;
        this.source = source;
    }

    updateText(){
        if(this.canUpdate)
            this.text = this.recipient[this.source];
    }
}


class FloatingTextMessage extends TextDisplay{
    
}