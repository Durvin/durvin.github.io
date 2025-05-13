var currentCards = [];
var drawnCards = [];
var buttons = [];
var potentialCards = [];
var usedCards = [];

/*
var allcards
var availablecards
var currentcards
var usedcards
*/

//card drawing logic:
/*
Firstly draw upto x cards from current cards

Present them to the player, and place clicked ones in usedCards

add new cards from potentialCards to currentCards, if possible

repeat
*/

var roundsTotal = 10 +1;
var roundsLeft = roundsTotal;


//add all cards with no prerequisites
function createCards(){
    for(var i=0; i<modifications.length; i++){
        if(modifications[i].prerequisite.length === 0)
                             //modification id, name, gameplay text, description, is a card with prerequisites
            currentCards.push([i, modifications[i].name, modifications[i].gameplayText, modifications[i].description, false]);
        else
            potentialCards.push([i, modifications[i].name, modifications[i].gameplayText, modifications[i].description, true]);
    }
}

//check prerequisite demands of modifications in potentialCards, and add to currentCards if they are met
function checkPrerequisites(){
    var canBeAdded = true;
    var demand;
    var mod;
    for(var i=0; i<potentialCards.length; i++){
        for(var j=0; j<modifications[potentialCards[i][0]].prerequisite.length; j++){
            demand = modifications[potentialCards[i][0]].prerequisite[j];
            mod = findModification(demand);
            if(!mod.active)
                canBeAdded = false;
        }

        if(canBeAdded){
            currentCards.push(potentialCards[i]);
            potentialCards.splice(i, 1);
            i--;
        }
    }
}

var cardsToDraw = 3;
function drawCards(){
    if(currentCards.length < cardsToDraw)
        cardsToDraw = currentCards.length;

    //draw a card from the stack
    var cardToGive = -1;
    var cardStack = structuredClone(currentCards);
    for(var i=0; i<cardsToDraw; i++){
        if(cardStack.length === 0)
            break;
        cardToGive = cardStack[Math.floor(Math.random()*cardStack.length)];
        drawnCards.push(cardToGive)
        //render it
        createCardDiv(cardToGive);

        //i'm only using filter here to learn it. There are other ways i prefer for doing this
        cardStack = cardStack.filter(function(car){return car[0] !== cardToGive[0]});
    }
}


function cardIsClicked(){
    //avoid multiple cards being clicked in the same animation
    if(cardAnimationIsActive)
        return;

    var drawn;
    //find the clicked card
    for(var i=0; i<drawnCards.length; i++){
        if(drawnCards[i][1] == this.id)
            drawn = drawnCards[i];
    }

    var mod = modifications[drawn[0]];

    //activate it
    activateModification(mod)
    previousActivatedModification = mod;

    //remove from current cards
    currentCards = currentCards.filter(function(card){return card[0] !== drawn[0]});
    usedCards.push(this.id);
    
    //remove cards while the cards are in the deck in the animation
    cardRetreatAnimation();
    setTimeout(function(){
        var kortHolder = document.getElementById("kortHolder");
        
        while(kortHolder.childNodes.length > 2){
            kortHolder.removeChild(kortHolder.childNodes[kortHolder.childNodes.length-1]);
        }

        main();

    }, 400);
}

function activateModification(mod){
    //activate modification
    mod.active = true;

    //check if the modification leads to gameplaychanges
    if(mod.source[0] === "gameplay")
        activateGameplayModification(mod);

    //check if the activated modification lead to any new cards being available
    checkPrerequisites();
}


function activateGameplayModification(mod){
    if(mod.name == "Valgmuligheter"){
        cardsToDraw += 2;
    }
    else if(mod.name == "Subsidier"){
        roundsTotal += 3;
        roundsLeft += 3;
    }
}

var points;
function pointsGiver(){
    
}