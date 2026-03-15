//fila har alle greiene som vises på skjermen
var body = document.getElementsByTagName("body")[0];
body.style.background = "#888888";
body.style.fontFamily = "Bahnschrift";
body.style.display = "flex";
body.style.justifyContent = "space-evenly";


var resDiv = document.createElement("div");
resDiv.style.float = "left";
resDiv.id = "resDiv";
document.getElementsByTagName("body")[0].appendChild(resDiv);

function createResource(name){
   var moneyDiv = document.createElement("div");
   moneyDiv.id = name + "Div";
   resDiv.appendChild(moneyDiv);

   var moneyText = document.createElement("p");
   moneyText.id = name + "Text";
   moneyText.innerHTML = "0 " + name;

   var moneybar = document.createElement("div");
   moneybar.id = "moneybar";
   moneybar.style.width = "100px";
   moneybar.style.height = "10px";
   moneybar.style.border = "2px solid #000000";
   var moneybarInner = document.createElement("div");
   moneybarInner.id = name + "barInner";
   moneybarInner.style.height = "10px";

   moneybar.appendChild(moneybarInner);
   moneyDiv.appendChild(moneyText);
   moneyDiv.appendChild(moneybar);

   resDiv.appendChild(moneyDiv);
}

var scienceDiv = document.createElement("div");
scienceDiv.style.float = "left";
scienceDiv.id = "scienceDiv";
document.getElementsByTagName("body")[0].appendChild(scienceDiv);

var techDisplay = document.createElement("p");
techDisplay.style.float = "left";
techDisplay.id = "techDisplay";
techDisplay.innerHTML = "Knowledge:";
body.appendChild(techDisplay);

function createScienceDiv(scienceToAdd){
   sciDiv = document.createElement("div");
   sciDiv.id = "sci" + scienceToAdd.name;
   sciDiv.style.border = "solid 2px #662222";
   sciDiv.style.width = "200px";
   sciDiv.style.display = "flex";
   sciDiv.style.flexWrap = "wrap";
   scienceDiv.appendChild(sciDiv);

   var pName = document.createElement("p");
   pName.style.width = "100%";
   pName.style.margin = "5% 0%"
   pName.style.textAlign = "center";
   pName.innerHTML = scienceToAdd.name;
   sciDiv.appendChild(pName);

   var pDesc = document.createElement("p");
   pDesc.style.width = "100%";
   pDesc.style.margin = "5% 0%"
   pDesc.style.textAlign = "center";
   pDesc.innerHTML = scienceToAdd.description;
   sciDiv.appendChild(pDesc);

   var p = document.createElement("p");
   p.style.width = "100%";
   p.style.margin = "5% 0%";
   p.style.textAlign = "center";
   p.innerHTML = "";
   for(var i=0; i<scienceToAdd.resource.length; i++){
      if(i > 0)
         p.innerHTML += "<br>";
      p.innerHTML += scienceToAdd.cost[i] + " " + scienceToAdd.resource[i];
   }
   sciDiv.appendChild(p);

   var button = document.createElement("button");
   button.innerHTML = "Sciencify";
   button.id = "button" + scienceToAdd.name;
   button.addEventListener("click", function(e){
      var str = e.target.id.substring(6,e.target.id.length);
      scienceProgress(str);
   },);
   button.style.margin = "auto";
   sciDiv.appendChild(button);

   var scibar = document.createElement("div");
   scibar.style.width = "100px";
   scibar.style.height = "10px";
   scibar.style.margin = "5% 10%";
   scibar.style.border = "2px solid #000000";
   var scibarInner = document.createElement("div");
   scibarInner.style.height = "10px";
   scibarInner.style.width = "0px";
   scibarInner.style.background = "#0000BB";

   scibar.appendChild(scibarInner);
   sciDiv.appendChild(scibar);

   if(scienceToAdd.picture != "a"){
      var img = document.createElement("img");
      img.src = scienceToAdd.picture;
      sciDiv.appendChild(img);
   }

   scienceDiv.appendChild(sciDiv);

}

function removeScienceDiv(name){
   scienceDiv.removeChild(document.getElementById("sci"+name));
}

//logistics
var logDiv = document.createElement("div");
logDiv.style.position = "";
logDiv.id = "logDiv";
logDiv.style.float = "right";
body.appendChild(logDiv);

function createLogisticsDiv(logistic){
   var div = document.createElement("div");
   div.id = logistic.name;
   div.style.border = "solid 2px #662222";
   div.style.width = "200px";
   div.style.display = "flex";
   div.style.flexWrap = "wrap";

   var pName = document.createElement("p");
   pName.style.width = "100%";
   pName.style.margin = "5% 0%";
   pName.style.textAlign = "center";
   pName.innerHTML = logistic.name;

   var p = document.createElement("p");
   p.style.width = "100%";
   p.style.margin = "5% 0%";
   p.style.textAlign = "center";
   p.innerHTML = "";
   for(var i=0; i<logistic.costResource.length; i++){
      if(i > 0)
         p.innerHTML += "\n";
      p.innerHTML = logistic.cost[i] + " " + logistic.costResource[i];
   }

   var button = document.createElement("button");
   button.innerHTML = "Buy";
   button.style.margin = "auto";
   button.addEventListener("click", function(e){
      var str = e.target.parentNode.id;
      logisticsBuy(str);
   },);

   div.appendChild(pName);
   div.appendChild(p);
   div.appendChild(button);
   logDiv.appendChild(div);
}

function showBuybutton(name){
   document.getElementById(name).children[2].style.visibility = "visible";
}

function hideBuybutton(name){
   document.getElementById(name).children[2].style.visibility = "hidden";
}
