function enableIframe(sourceId, visibility){
    var container = document.getElementById("iframeContainer");
    container.style.visibility = visibility;
    document.getElementById("mainIframe").src = sourceId;

}

function startGame(e){
    var buttonid = e.target.id;
    var name = buttonid.substr(11, buttonid.length - 11);
    var gamePath = games[name].src;
    enableIframe("games/" + gamePath, "visible");
}

function exitGame(){

}
document.getElementById("offButton").onclick = function () {
    enableIframe("", "hidden");
}

var numberOfGameDivs = 0;
function createShowcaseDiv(gameObject){
    var div = document.createElement("div");
    div.id = "game" + gameObject.id;
    div.classList.add("gameDiv");
    document.getElementById("gameContainer").appendChild(div);
    
    var image = document.createElement("img");
    image.id = "image" + gameObject.id;
    image.src = "images/" + gameObject.image;

    var startButton = document.createElement("button");
    startButton.id = "startButton" + gameObject.id;
    startButton.innerHTML = "Try!";
    startButton.onclick = startGame;

    var title = document.createElement("h2");
    title.innerHTML = gameObject.name;

    var description = document.createElement("p");
    description.innerHTML = gameObject.description;


    div.appendChild(title);
    div.appendChild(image);
    div.appendChild(startButton);
    div.appendChild(description);

    //to make css easier to deal with,
    //insert a small div for the middle every odd number
    numberOfGameDivs++;
    if(numberOfGameDivs%2 == 1){
        var extraDiv = document.createElement("div");
        extraDiv.classList.add("extraDiv");
        document.getElementById("gameContainer").appendChild(extraDiv);
    }
}

//get game names and sort them, descending by year made
var keys = Object.keys(games);
keys.sort((a, b) => {return games[a].year > games[b].year ? 1 : -1}).reverse();
for(var i = 0; i < keys.length; i++){
    createShowcaseDiv(games[keys[i]])
}


var selectedFolder = document.getElementById("folderGames");
var folderContainer = document.getElementById("folderTopContainer");

//because i style the folders with JS here, it becomes inline CSS
//thus i also have to define :hover behaviour here as the styling file has lower precedence
function setHoverBehaviourOnFolders(){
    var children = folderContainer.children;
    for(var child of children){
        child.onmouseover = folderHovered;
        child.onmouseleave = folderUnhovered;
        child.onclick = folderClicked;
    }
}
function folderHovered(e){
    if(!e.target.classList.contains("folderSelectable"))
        return;
    e.target.style.background = "#019b4c";
    e.target.children[0].style.background = "";
}
function folderUnhovered(e) {
    if(!e.target.classList.contains("folderSelectable"))
        return;

    e.target.style.background = "#21bb6c";
    e.target.children[0].style.background = "";
}
function folderClicked(e){
    var target = e.target;
    if(!e.target.classList.contains("folderSelectable"))
        target = target.parentNode;
        
    //switch active container
    selectedFolder = target;
    styleSelectedFolder();
}

function resetStyleAllFolders(){
    var children = folderContainer.children;
    for(var child of children){
        child.style.zIndex = 0;
        child.style.borderColor = "#215c6c";

        //make containers invisible
        var name = child.id.substring(6, child.id.length - 1).toLowerCase() + "Container";
        document.getElementById(name).style.visibility = "hidden";

    }
}
function styleSelectedFolder(){
    resetStyleAllFolders();

    selectedFolder.style.borderColor = "#885c00";
    selectedFolder.style.zIndex = "1";

    //make correct container visible
    var name = selectedFolder.id.substring(6, selectedFolder.id.length - 1).toLowerCase() + "Container";
    document.getElementById(name).style.visibility = "visible";
}

setHoverBehaviourOnFolders();
styleSelectedFolder();