var mapStates = {
    opening: 0,
    open: 1,
    closing: 2,
    closed: 3
}

var mapInfo = {
    speedMultiplier: 5,
    mouseX: 0,
    mouseY: 0,
    maxStartOffset: 1500,
    startOffset: 1500,
    state: mapStates.closed,
    zoom: 0,
    width: 1000,
    height: 500,
    zoomMin: 0,
    zoomMax: 10,
    offsetY: 0,
    offsetX: 0,
    outerEdge: 100,
    tacks: []
}

class mapTack{
    constructor(x, y, name, icon){
        this.x = x;
        this.y = y;
        this.name = name;
        this.icon = icon;
    }
}

var needToHandleMapAnimation = false;
function handleMapAnimation(){
    if(mapInfo.state === mapStates.opening){
        mapInfo.startOffset -= timeDelta*mapInfo.speedMultiplier;
        if(mapInfo.startOffset <= 0){
            mapInfo.startOffset = 0;
            mapInfo.state = mapStates.open;
            needToHandleMapAnimation = false;
        }
    }
    else if(mapInfo.state === mapStates.closing){
        mapInfo.startOffset += timeDelta*mapInfo.speedMultiplier;
        if(mapInfo.startOffset >= mapInfo.maxStartOffset){
            mapInfo.startOffset = mapInfo.maxStartOffset;
            mapInfo.state = mapStates.closed;
            needToHandleMapAnimation = false;
        }
    }
}
var mapDrawingRatio = 0;
var mapZoomMultiplier = 1;
var mapDrawOffsetX = 100;
var mapDrawOffsetY = 100;
function drawMap(){
    var drawX, drawY;
    mapDrawingRatio = 1000/tree.bounds.width;
    
    //the map itself
    c.drawImage(bilder.worldmap, mapInfo.offsetX, mapInfo.offsetY, 4000/mapZoomMultiplier, 2000/mapZoomMultiplier,
                100 + mapInfo.startOffset, 100, 1000, 500);

    if(mapInfo.state !== mapStates.open)
        return;
                
    //the player pointer
    drawX = player.x*mapDrawingRatio*mapZoomMultiplier + mapDrawOffsetX - 16 - mapInfo.offsetX*mapZoomMultiplier*0.25;
    drawY = player.y*mapDrawingRatio*mapZoomMultiplier + mapDrawOffsetY - 32 - mapInfo.offsetY*mapZoomMultiplier*0.25
    if(drawX > 84 && drawY > 84 && drawX < 1084 && drawY < 568)
        c.drawImage(bilder.mapPointer, drawX, drawY);

    //stars
    for(var i=0; i<mapInfo.tacks.length; i++){
        drawX = mapInfo.tacks[i].x * mapDrawingRatio * mapZoomMultiplier + mapDrawOffsetX -
                16 - mapInfo.offsetX*mapZoomMultiplier*0.25;

        drawY = mapInfo.tacks[i].y * mapDrawingRatio * mapZoomMultiplier + mapDrawOffsetY -
                16 - mapInfo.offsetY*mapZoomMultiplier*0.25;
        if(drawX < 84 || drawY < 84 || drawX > 1084 || drawY > 584)
            continue;
        c.drawImage(mapInfo.tacks[i].icon, drawX, drawY);

        if(Math.abs(drawX + 16 - mapInfo.mouseX) < 16 && Math.abs(drawY + 16 - mapInfo.mouseY) < 16){
            c.fillStyle = "rgba(50, 50, 50, 0.9)";
            c.fillRect(mapInfo.mouseX, mapInfo.mouseY-36, 250, 30);
            c.fillStyle = "#ee5522";
            c.fillText(mapInfo.tacks[i].name, mapInfo.mouseX+5, mapInfo.mouseY-14);
        }
    }

    if(mapHoveringOver !== null){
        drawX = mapInfo.tacks[i].x * mapDrawingRatio * mapZoomMultiplier + mapDrawOffsetX -
        16 - mapInfo.offsetX*mapZoomMultiplier*0.25;

        drawY = mapInfo.tacks[i].y * mapDrawingRatio * mapZoomMultiplier + mapDrawOffsetY -
            16 - mapInfo.offsetY*mapZoomMultiplier*0.25;

        c.drawImage(mapInfo.tacks[i].icon, drawX, drawY)
    }
        
}

window.addEventListener("wheel", function(e){
    if(!mapInfo.state === mapStates.open)
        return;
    
    if(e.wheelDelta < 0)
        mapInfo.zoom = Math.max(mapInfo.zoom-1, mapInfo.zoomMin);
    else
        mapInfo.zoom = Math.min(mapInfo.zoom+1, mapInfo.zoomMax);
    
    mapZoomMultiplier = 1.15**mapInfo.zoom;
    mapInfo.width = 1000/mapZoomMultiplier;
    mapInfo.height = 500/mapZoomMultiplier;
})

var mapMousedragging = false;
var mapHoveringOver = null;
