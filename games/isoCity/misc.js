var heldKeys = [];
var keyChange = false;

window.addEventListener("keydown", function(e){
   for(var i=0; i<heldKeys.length; i++){
      if(heldKeys[i] === e.code){
         return 0;
      }
   }
   heldKeys.push(e.code);
   keyChange = true;
});

window.addEventListener("keyup", function(e){
   for(var i=0; i<heldKeys.length; i++){
      if(heldKeys[i] === e.code){
         heldKeys.splice(i,1);
         return 0;
      }
   }
});

window.addEventListener("mousedown", function(e){
   if(e.target === canvas){
      var x = (e.clientX-32)/tileSize;
      var y = (e.clientY-32)/tileSize
      console.log(x-x%1 + offsetX, y-y%1 + offsetY);
   }
})
