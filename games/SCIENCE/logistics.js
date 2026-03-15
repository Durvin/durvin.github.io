var logisticsUnlocked = {};

function logisticsCanBuy(){
   var arr = Object.keys(logisticsUnlocked);
   for(var i=0; i<arr.length; i++){
      if(logisticsUnlocked[arr[i]].current < logisticsUnlocked[arr[i]].max){
         showBuybutton(logisticsUnlocked[arr[i]].name);
      }
   }
}

function logisticsUnlock(){
   for(var i=0; i<logisticsList.length; i++){
      for(var j=0; j<logisticsList[i].prerequisites.length; j++){
         var unlocks = logisticsList[i].prerequisites.length;
         if(unlockedTechs[truncateName(logisticsList[i].prerequisites[j])]){
            unlocks--;
         }
      }
      if(!unlocks){
         logisticsUnlocked[truncateName(logisticsList[i].name)] = logisticsList[i];
         createLogisticsDiv(logisticsList[i]);
         logisticsList.splice(i,1);
         i--;
      }
   }
}

function truncateName(name){
   for(var i=0; i<name.length; i++){
      if(name[i] === " "){
         name = name.substring(0,i) + name.substring(i+1,name.length);
         i--;
      }
   }
   return name;
}
