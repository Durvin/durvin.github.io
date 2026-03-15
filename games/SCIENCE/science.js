var sciencePending = [];
var scienceInProgress = [];

function scienceUnlock(){
   for(var i=0; i<scienceList.length; i++){
      var unlocks = scienceList[i].resource.length;
      for(var j=0; j<scienceList[i].resource.length; j++){
         if(player[scienceList[i].resource[j]] > scienceList[i].show[j])
            unlocks--;
      }
      if(!unlocks){
         sciencePending.push(scienceList[i]);
         createScienceDiv(scienceList[i]);
         scienceList.splice(i,1);
         i--;
      }
   }
}

//progress bar and such
var counter = 0;
function scienceProgress(science){
   for(var i=0; i<sciencePending.length; i++){
      if(sciencePending[i].name === science){
         //sjekker om spilleren har råd
         for(var j=0; j<sciencePending[i].resource.length; j++){
            if(sciencePending[i].cost[j] > player[sciencePending[i].resource[j]])
               return;
         }
         for(var j=0; j<sciencePending[i].resource.length; j++){
            player[sciencePending[i].resource[j]] -= sciencePending[i].cost[j];
         }

         scienceInProgress.push(sciencePending[i]);
         sciencePending.splice(i,1);
         break;
      }
   }
}

//actually learning the science
function addScience(science){
   unlockedTechs[science.name] = true;
   techDisplay.innerHTML += "<br>" + science.name;
   unlocks(science.name);
   removeScienceDiv(science.name);
}
