var activeBars = [];
function createBar(x, y, width, height, outerSize, colour){
    var bar = {};
    bar.x = x;
    bar.y = y;
    bar.width = width;
    bar.height = height;
    bar.outerSize = outerSize;
    bar.fill = 0; //out of 100

    bar.outerColour = "#BBBBBB";
    bar.innerFillColour = "#FF0000";
    bar.innerEmptyColour = "#888888";

    activeBars.push(bar);
}

function drawBars(){
    var bar;
    for(var i=0; i<activeBars.length; i++){
        bar = activeBars[i];
        
        //test
        bar.fill++;
        if(bar.fill === 101)
            bar.fill = 0;

        //outer
        //c.fillStyle = bar.outerColour;
        c.fillRect(bar.x, bar.y, bar.width, bar.height);

        //inner emptiness
        //c.fillStyle = bar.innerEmptyColour;
        c.fillRect(bar.x + bar.outerSize, bar.y + bar.outerSize,
                   bar.width - bar.outerSize*2, bar.height - bar.outerSize*2);
        
        //inner fill
        //c.fillStyle = bar.innerFillColour;
        c.fillRect(bar.x + bar.outerSize, bar.y + bar.outerSize,
                   (bar.width - bar.outerSize*2) * bar.fill/100, bar.height - bar.outerSize*2);
    }
}