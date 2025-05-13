var thingToRender = "statistikk";
function rendering(){
    
    if(roundsLeft !== 1)
        drawCards();
    applyTablechanges();
    createFloatingModText();
    updateLastCardShowcase();
    updateRoundsLeft();
    
    c.clearRect(0, 0, can.width, can.height);
    canvasDrawImages();

    setTimeout(cardDrawAnimation, 100);
}

function renderList(){
    createTableRowForStatistics("forbruk", "strøm",
                                "Strømforbruk: ", Math.round(getStat("strøm")) + "kwh", " : ",
                                getStat("strømutslipp") + " tonn CO2");

    createTableRowForStatistics("forbruk", "oppvarming",
                                "Oppvarming: ", getStat("oppvarming") + "kwh", " : ",
                                getStat("oppvarmingutslipp") + " tonn CO2");

    createTableRowForStatistics("forbruk", "diesel",
                                "Dieselforbruk: ", getStat("diesel") + "L", " : ",
                                aggregateNumbers.dieselutslipp + " tonn CO2");



    createTableRowForStatistics("statistikk", "melk",
                                "Melk: ", baseAggregateNumbers.melk, " --> ",
                                aggregateNumbers.melk);
                                
    createTableRowForStatistics("statistikk", "storfekjøtt",
                                "Storfekjøtt: ", baseAggregateNumbers.storfekjøtt, " --> ",
                                aggregateNumbers.storfekjøtt);

    createTableRowForStatistics("statistikk", "svinekjøtt",
                                "Svinekjøtt: ", baseAggregateNumbers.svinekjøtt, " --> ",
                                aggregateNumbers.svinekjøtt);

    createTableRowForStatistics("statistikk", "grisunger",
                                "Smågris: ", baseAggregateNumbers.grisunger, " --> ",
                                aggregateNumbers.grisunger);
                                
    createTableRowForStatistics("statistikk", "korn",
                                "Korn: ", baseAggregateNumbers.korn, " --> ",
                                aggregateNumbers.korn);

    createTableRowForStatistics("statistikk", "ts",
                                "Tørrstoff: ", baseAggregateNumbers.ts, " --> ",
                                aggregateNumbers.ts);

}

function createTableRowForStatistics(table, name, ...content){
    var tr = document.createElement("tr");
    var td;

    for(var i=0; i<content.length; i++){
        td = document.createElement("td");

        //make changes to numbers, to allow them to be animated with CSS
        if(i == 1 || i == 3){

            //a mess to figure out which number to target for what statistic
            if(i == 3 && table === "forbruk")
                td.id = "td" + name + "utslipp";
            else if(i == 3)
                td.id = "td" + name;
            else if(i == 1 && table === "forbruk")
                td.id = "td" + name;

            //figure out if we're dealing with a float or an int, and style accordingly
            //float
            var numberContent;
            if(parseInt(content[i]) !== parseFloat(content[i])){
                numberContent = parseFloat(content[i]);

                var parts = String(parseFloat(content[i])).split(".");

                td.classList.add("tdFloat");
                td.style.setProperty("--num", parts[0]);
                td.style.setProperty("--float", parts[1]);
            }

            //int
            else{
                var numberContent = parseInt(content[i]);
                td.classList.add("tdNum");
                td.style.setProperty("--num", numberContent);
            }
            
            var textContent;
            if(typeof content[i].length === "undefined")
                textContent = "";
            else
                textContent = content[i].substring(String(numberContent).length);
            td.innerHTML = textContent
        }
        else
            td.innerHTML = content[i]; 

        tr.appendChild(td);
    }

    if(table == "statistikk")
        document.getElementById("gårdsstatistikk").children[0].appendChild(tr);

    
    else if(table == "forbruk")
        document.getElementById("forbruksstatistikk").children[0].appendChild(tr);

    //c.fillText("Strømforbruk: " + getStat("strøm") + "kwh - " + getStat("strømUtslipp") + " tonn CO2", baseOffsetX*22, baseOffsetY);
}

function applyTablechanges(){
    var keys = Object.keys(calcRoundDifference);
    var source, id;
    for(var i=0; i<keys.length; i++){
        source = aggregateNumbers[keys[i]];
        id = "td" + keys[i];
        
        if(keys[i] === "eng" || keys[i] === "beite"){
            source = aggregateNumbers["ts"];
            id = "tdts";
        }

        if(document.getElementById(id).classList.contains("tdFloat")){
            var parts = String(source).split(".");
            //want 4 numbers in total for aesthetics
            parts = adjustDecimalLength(parts);
            document.getElementById(id).style.setProperty("--num", parts[0]); 
            document.getElementById(id).style.setProperty("--float", parts[1]);

        }
        else
            document.getElementById(id).style.setProperty("--num", parseInt(source)); 
    }


}

//function to make sure decimals in numbers don't get too long to avoid structure degradation in the html table.
//also includes ways to make the numbers have extra 0s, but it clashes with animation, and thus does nothing
function adjustDecimalLength(parts){
    //2 decimals
    if(parts[0] >= 10){
        var length = String(parts[1]).length;
        if(length == 1)
            parts[1] = String(parts[1])+"0";
        else if(length == 3)
            parts[1] = Math.round(parts[1]/10);
    }
    //3 decimals
    else{
        var length = String(parts[1]).length;
        if(length == 1)
            parts[1] = String(parts[1])+"00";
        else if(length == 2)
            parts[1] = String(parts[1])+"0";
    }
    return parts;
}

function clearTables(){
    var tab = document.getElementById("gårdsstatistikk").children[0];
    while(tab.children.length > 0)
        tab.removeChild(tab.children[tab.children.length -1]);
    
    tab = document.getElementById("forbruksstatistikk").children[0];
    while(tab.children.length > 0)
        tab.removeChild(tab.children[tab.children.length -1]);
    
}

//sjekker om et element er inni et forelderelement, uansett dybde (og inklusiv seg selv)
function hasParent(element, parent){
    try {
        return parent.contains(element);
    } catch (error) {
        console.log(error, element, parent);
    }
    
}

var numberOfMods = 1;
function drawModification(mod){
    c.fillText(mod.name, 40, 20+30*numberOfMods);
    
    var check = document.createElement("input")
    check.type = "checkbox";
    check.style.position = "fixed";
    check.style.left = 220+"px";
    check.style.top = 12+30*numberOfMods+"px";
    if(mod.active)
        check.checked = true;
    check.onclick = function(){
        mod.active = !mod.active;
        main();
    };

    document.getElementById("body").appendChild(check)

    numberOfMods++;
}

//remove preexisting modification checkboxes
function removeChildren(){
    var b = document.getElementById("body");
    for(var i=0; i<b.childNodes.length; i++){
        if(b.childNodes[i].localName === "input"){
            b.removeChild(b.childNodes[i]);
            i--;
        }
    }
}

function checkClick(e){
    var mouseAdjusted = [e.clientX - can.offsetLeft, e.clientY - can.offsetTop];
    var happened = false;

    for(var i=0; i<buttons.length; i++){
        if(aabb(mouseAdjusted, buttons[i])){
            var mod = modifications[buttons[i][4][0]];

            //activate modification
            mod.active = true;

            console.log(mod.name);

            //remove from currentCards
            currentCards = currentCards.filter(function(val){return val[0] !== buttons[i][4][0]});

            usedCards.push(buttons[i][4]);

            //remove all buttons
            buttons = [];
            happened = true;
            break;
        }
    }
    if(happened)
        main();
}

function aabb(a, b){
    return  a[0] >= b[0] &&
            a[0] <= b[0]+b[2] &&
            a[1] >= b[1] &&
            a[1] <= b[1]+b[3];
}

//creates the card divs contents
function createCardDiv(modification){
    var card = document.createElement("div");
    card.style.display = "flexbox";
    card.style.flexDirection = "vertical";
    card.classList.add("kort")

    var title = document.createElement("p");
    title.innerHTML = modification[1];
    title.classList.add("kortTittel")

    var image = document.createElement("img");
    image.src = "images/" + modifications[modification[0]].image + ".png";

    var imageContainer = document.createElement("div");
    imageContainer.classList.add("kortBilde")
    imageContainer.appendChild(image);

    var effects = document.createElement("p");
    effects.innerHTML = modification[2];
    effects.classList.add("kortEffekter")

    var description = document.createElement("p");
    description.innerHTML = modification[3];
    description.classList.add("kortBeskrivelse")

    
    card.appendChild(title);
    card.appendChild(imageContainer);
    card.appendChild(effects);
    card.appendChild(description);
    
    card.addEventListener("click", cardIsClicked);
    card.classList.add("deckAnimation");

    //is a card with a prerequisite
    if(modification[4])
        card.classList.add("spesialkort");

    //card id corresponds to modification
    card.id = modification[1];
    

    document.getElementById("kortHolder").appendChild(card);
}

//used to make sure the player cannot activate a card multiple times,
//or trigger strange animation anomalies
var cardAnimationIsActive = false;

function cardRetreatAnimation(){
    if(cardAnimationIsActive)
        return;

    cardAnimationIsActive = true;
    var cards = document.getElementsByClassName("kort");

    for(var i=0; i<cards.length; i++){
        cards[i].classList.add("deckAnimation");
    }

}

function cardDrawAnimation(){
    var cards = document.getElementsByClassName("kort");

    for(var i=0; i<cards.length; i++){
        cards[i].classList.remove("deckAnimation");
    }

    setTimeout(function(){cardAnimationIsActive = false;}, 400);
}


function createFloatingModText(){
    var keys = Object.keys(calcRoundDifference);
    var values = [];
    for(var i=0; i<keys.length; i++){
        values.push(keys[i] + ": " + round3(calcRoundDifference[keys[i]][0] - calcRoundDifference[keys[i]][1]));
    }
    if(values.length > 0)
        floatingTextMaker(previousActivatedModification, values);
}

var lastFloatingText = "";
function floatingTextMaker(mod, values){
    var p = document.createElement("p");
    p.classList.add("floatText");
    
    var text = "";
    //var text = mod.name + "<br>"
    for(var i=0; i<values.length; i++){
        text += values[i] + "<br>";
    }
    p.innerHTML = text;
    lastFloatingText = text;

    document.getElementById("floatingTextContainer").appendChild(p);

    setTimeout(function(){
        p.style.opacity = 0;
        p.style.top = "40%";
    }, 10)

    setTimeout(function(){
        document.getElementById("floatingTextContainer").removeChild(   
                    document.getElementById("floatingTextContainer").children[0]);
    }, 3000);


}

function updateLastCardShowcase(){
    var td = document.getElementById("sisteKort");
    td.innerHTML = "Siste korts effekter: <br>" + lastFloatingText;
}

function updateRoundsLeft(){
    roundsLeft--;
    var td = document.getElementById("rundeviser");
    td.innerHTML = "Tiltakskort igjen: " + roundsLeft;
}