var listOfResources = ["money", "rock", "flint", "copper", "iron", "tin", "bronze"];


var player = {
   techBasic: 0
}

for(var i=0; i<listOfResources.length; i++){
   player[listOfResources[i]] = 0;
   player[listOfResources[i]+"Max"] = 0;
   player[listOfResources[i]+"Income"] = 0;
}

var unlockedResources = [];

function attemptToUnlock(name){
   for(var i=0; i<unlockedResources.length; i++){
      if(unlockedResources[i] === name)
         return;
   }
   unlockedResources.push(name);
   createResource(name);
}
attemptToUnlock("money");
player.moneyMax = 10;
player.moneyIncome = 1;

var unlockedTechs = {
   Rocks: false,
   RockGatherer: false,
   RockTools: false,
   Iron: false,
   Tin: false,
   Copper: false,
   Bronze: false
}

var updateSlowMax = 10;
var updateSlowCounter = 1;
function update(){
   incrementResources();
   updateScienceProgress();

   updateSlowCounter--;
   if(!updateSlowCounter){
      updateSlowCounter = updateSlowMax;
      scienceUnlock();
      logisticsUnlock();
      logisticsCanBuy();
   }

   setTimeout(update, 1000/10);
}
update();


function updateResourcebar(res){
   var width = (player[res]/player[res+"Max"])*100;
   document.getElementById(res+"barInner").style.width =  width + 'px';

   if(player[res] > player[res+"Max"]*0.7)
      document.getElementById(res+"barInner").style.background = "#FF0000";
   else if(player[res] > player[res+"Max"]*0.4)
      document.getElementById(res+"barInner").style.background = "#ff8800";
   else
      document.getElementById(res+"barInner").style.background = "#00FF00";
}

function incrementResources(){
   for(var i=0; i<unlockedResources.length; i++){
      if(player[unlockedResources[i]] < player[unlockedResources[i]+"Max"]){
         player[unlockedResources[i]] += player[unlockedResources[i]+"Income"];
         
         if(player[unlockedResources[i]] < 0)
            player[unlockedResources[i]] = 0;

         if(player[unlockedResources[i]] > player[unlockedResources[i]+"Max"]){
            player[unlockedResources[i]] = player[unlockedResources[i]+"Max"];
         }
      }
      document.getElementById(unlockedResources[i]+"Text").innerHTML = player[unlockedResources[i]] + " " + unlockedResources[i];
      updateResourcebar(unlockedResources[i]);
   }
}

function updateScienceProgress(){
   for(var i=0; i<scienceInProgress.length; i++){
      if(scienceInProgress[i].progress === -1){
         scienceInProgress[i].progress = Math.round(Math.random()*10*scienceInProgress[i].techTier)+5*scienceInProgress[i].techTier;
         scienceInProgress[i].progressMax = scienceInProgress[i].progress;
      }
      else if(scienceInProgress[i].progress > 0){
         scienceInProgress[i].progress--;
         document.getElementById("sci"+scienceInProgress[i].name).children[4].children[0].style.width =
               96-scienceInProgress[i].progress/scienceInProgress[i].progressMax*96 + "px";
      }
      else{
         addScience(scienceInProgress[i]);
         scienceInProgress.splice(i,1);
         i--;
      }
   }
}

function logisticsBuy(name){
   var log = logisticsUnlocked[truncateName(name)];

   //sjekk om logistikk er tilgjengelig
   if(log.current === log.max)
      return;

   //har spilleren råd til å kjøpe?
   for(var i=0; i<log.resource.length; i++){
      if(player[log.costResource[i]] < log.cost[i]){
         return;
      }
   }

   log.onGet();
   
   for(var i=0; i<log.resource.length; i++){
      player[log.costResource[i]] -= log.cost[i];
   }

   var amountGrowth = log.amountGrowth[
            log.resource.length];
   var costGrowth = log.costGrowth[
            log.costResource.length];

   for(var i=0; i<log.resource.length; i++){
      player[log.resource[i]+"Income"] += log.amount[i];
      if(amountGrowth === "flat"){
         log.amount[i] += log.amountGrowth[i]
      }
      else{
         console.log("not implemented anything other than a flat increment :c");
      }
   }
   for(var i=0; i<log.costResource.length; i++){
      if(costGrowth === "flat"){
         log.cost[i] += log.costGrowth[i];
      }
      else{
         console.log("not implemented anything other than a flat increment :c");
      }
   }
   var p = document.getElementById(name).children[1];
   p.innerHTML = "";
   for(var i=0; i<log.costResource.length; i++){
      if(i > 0)
         p.innerHTML += "\n";
      p.innerHTML = log.cost[i] + " " + log.costResource[i];
   }

   log.current++;
   if(log.current === log.max)
      hideBuybutton(name);
}

document.getElementById("godmode").addEventListener("click", godmode);
function godmode(){
   player.moneyMax += 1_000_000_000;
   player.money += 1_000_000_000;
}