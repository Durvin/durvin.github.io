window.addEventListener("mousemove", function(e){
    if(mapInfo.state === mapStates.open){
        mapInfo.mouseX = e.clientX;
        mapInfo.mouseY = e.clientY;

        //mouse moving the map when dragging
        if(!mapMousedragging)
            return;
        mapInfo.offsetX -= (e.movementX*4) / mapZoomMultiplier;
        mapInfo.offsetY -= (e.movementY*4) / mapZoomMultiplier;
    }

    else if(inventoryOpen){
        //TODO: show name of item when hovering over in backpack
    }
});