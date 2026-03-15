function unlocks(scienceName){
   switch(scienceName){
      case "Rocks":
         player.moneyMax += 15;
         player.rockMax += 100;
         attemptToUnlock("rock");
         break;
      case "Copper":
         player.moneyMax += 45;
         player.copperMax += 100;
         attemptToUnlock("copper");
         break;
      case "Treasury":
         player.moneyMax += 1000;
         break;
      case "Flint":
         attemptToUnlock("flint");
         player.flintMax += 100;
         break;
      case "Rock Tools":
         
         break;
      case "Treasury II":
         player.moneyMax += 30000;
      case "Treasury III":
         player.moneyMax += 1250000;
      default:
         console.log("Unknown science '" + scienceName + "'");
   }
}

var scienceList = [];

var csvScienceList =
   //name, resources needed to see, resources needed to get, tech tier,  description
   `
   Rocks; money; 4; 8; 1; Rocks are hard and sturdy
   Copper; money; 20; 25; 1; Copper is far more moldable than stone, but hard to get
   Rock Tools; money, rock; 20, 50; 100, 100; 1; Rock tools hard. Rock tools smash. Rock tools better than hands
   Flint; rock; 50; 80; 1; Some of these rocks are quite sharp and flat. Maybe they can be usefull

   Treasury; money; 10; 60; 1; Wait, i can just stockpile money? hmmm....
   Treasury II; money; 1000; 1500; 1; Wait, i can just stockpile more money? hmmm....
   Treasury III; money; 30000; 40000; 1; Wait, i can just stockpile even more money? hmmm....
   `;


function csvToListScience(){
   var lines = csvScienceList.split("\n");
   var currentLine = "";
   for(var i=0; i<lines.length; i++){
      var obj = {};
      currentLine = lines[i].split(";");
      if(currentLine.length === 1){
         continue;
      }
      formatLines(currentLine);
      obj.name = currentLine[0];
      obj.resource = splitNSplice(currentLine[1], "string");
      obj.show = splitNSplice(currentLine[2], "number");
      obj.cost = splitNSplice(currentLine[3], "number");
      obj.techTier = parseInt(currentLine[4]);
      obj.description = currentLine[5];
      if(currentLine.length === 7)
         obj.picture = currentLine[6];
      else
         obj.picture = "a";
      obj.progress = -1;
      scienceList.push(obj);
   }
}

function splitNSplice(string, type){
   string = string.split(",");
   formatLines(string);
   if(type === "number"){
      for(var i=0; i<string.length; i++){
         string[i] = parseInt(string[i]);
      }
   }
   return string;
}

function formatLines(string){
   var arr = [];
   for(var i=0; i<string.length; i++){
      if(string[i][0]  === " "){
         //purge the tabulations!
         var j = 0;
         while(string[i][j] === " "){
            j++;
         }
         string[i] = string[i].substring(j, string[i].length);
      }
   }
}
csvToListScience();

//Tier 2
var scienceList2 = [];

//Tier 3...
var scienceList3 = [];

var scienceIdeas = [
   {
      name: "Gas Plant",
      resource: ["Electricity", "Carbon Emissions"],
      show: [],
      cost: [],
      picture: "a",
      progress: -1,
      techTier: 1,
      description: "Cheap and produces power"
   },{
      name: "Coal Powerplant V1",
      resource: [""],
      show: [],
      cost: [],
      picture: "a",
      progress: -1,
      techTier: 1,
      description: "Crude but generates power"
   },{
      name: "Nuclear Reactor",
      resource: [""],
      show: [],
      cost: [],
      picture: "a",
      progress: -1,
      techTier: 1,
      description: ""
   },{
      name: "Coal Powerplant V2",
      resource: [""],
      show: [],
      cost: [],
      picture: "a",
      progress: -1,
      techTier: 1,
      description: "Moar power"
   },{
      name: "Fission Reactor",
      resource: [""],
      show: [],
      cost: [],
      picture: "a",
      progress: -1,
      techTier: 1,
      description: ""
   },{
      name: "Fusion Reactor",
      resource: [""],
      show: [],
      cost: [],
      picture: "a",
      progress: -1,
      techTier: 1,
      description: "The big one"
   },{
      name: "",
      resource: [""],
      show: [],
      cost: [],
      picture: "a",
      progress: -1,
      techTier: 1,
      description: ""
   },{
      name: "",
      resource: [""],
      show: [],
      cost: [],
      picture: "a",
      progress: -1,
      techTier: 1,
      description: ""
   },{
      name: "",
      resource: [""],
      show: [],
      cost: [],
      picture: "a",
      progress: -1,
      techTier: 1,
      description: ""
   },
];


var logisticsList = [
   {  name: "Rock Gatherer",
      description: "Gathers rocks",
      prerequisites: ["Rocks"],
      resource: ["rock"],
      amount: [1],
      amountGrowth: [0, "flat"],
      costResource: ["money"],
      cost: [10],
      costGrowth: [10, "flat"],
      max: 50,
      current: 0,
      onGet: function(){
         player.rockMax += 100;
         console.log("yes")
      }
   },

   {  name: "Money finder",
      description: "Some things are shinier than other...",
      prerequisites: ["Rocks"],
      resource: ["money"],
      amount: [1],
      amountGrowth: [0, "flat"],
      costResource: ["money"],
      cost: [10],
      costGrowth: [5, "flat"],
      max: 10,
      current: 0,
      onGet: function(){}
   },

   {  name: "Flintmaker",
   description: "We can turn rocks... into pointy rocks!",
   prerequisites: ["Flint"],
   resource: ["flint"],
   amount: [1],
   amountGrowth: [0, "flat"],
   costResource: ["rock"],
   cost: [50],
   costGrowth: [50, "flat"],
   max: 10,
   current: 0,
   onGet: function(){
      player.rockIncome -= 2;
   }
},
]
