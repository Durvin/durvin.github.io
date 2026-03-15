var canvas = document.getElementById("can");
var c = canvas.getContext("2d");
canvas.style.left = "600px"
canvas.style.top = "0"
canvas.style.position = "absolute"

var canvas2 = document.getElementById("can2");
var c2 = canvas2.getContext("2d");
canvas2.style.zIndex = "2"
canvas2.style.top = "0"
canvas2.style.position = "absolute"

canvas2.style.left = "600px"

function drawBackground(){
    c.fillStyle = "#bbbbbb"
    c.fillRect(0, 0, 64*4, 64*8);
}

function drawGrid(){
    c.lineWidth = 2
    c.strokeStyle = "#000000"
    c.beginPath();
    for(var i=0; i<5; i++){
        c.moveTo(0+64*i, 0);
        c.lineTo(0+64*i, 64*8);
    }

    for(var i=0; i<9; i++){
        c.moveTo(0, 0+64*i);
        c.lineTo(64*4, 64*i);
    }
    c.stroke();
    c.closePath();

    c.beginPath();
    c.strokeStyle = "#FF0000";
    c.lineWidth = 4;
    c.moveTo(0, 64*4);
    c.lineTo(64*4, 64*4);
    c.stroke();
    c.closePath();

}

//now that's what i call bad code
//TODO make this modular with a width, height and dot-number parameter
function drawMartians(){
    c.lineWidth = 2;
    for(var i=0; i<board.length; i++){
        if(board[i] === null)
            continue;
        c.beginPath();
        c.strokeStyle = board[i].colour;

        if(board[i].name === "Pawn"){
            //body
            c.moveTo((i*64)%256 + 24, Math.floor(i/4)*64 + 58);
            c.lineTo((i*64)%256 + 32, Math.floor(i/4)*64 + 30);
            c.lineTo((i*64)%256 + 40, Math.floor(i/4)*64 + 58);
            c.lineTo((i*64)%256 + 24, Math.floor(i/4)*64 + 58);

            //pawn dot
            c.moveTo((i*64)%256 + 30, Math.floor(i/4)*64 + 55);
            c.lineTo((i*64)%256 + 30, Math.floor(i/4)*64 + 50);
        }

        else if(board[i].name === "Drone"){
            //body
            c.moveTo((i*64)%256 + 20, Math.floor(i/4)*64 + 58);
            c.lineTo((i*64)%256 + 32, Math.floor(i/4)*64 + 22);
            c.lineTo((i*64)%256 + 44, Math.floor(i/4)*64 + 58);
            c.lineTo((i*64)%256 + 19, Math.floor(i/4)*64 + 58);

            //drone dots
            c.moveTo((i*64)%256 + 27, Math.floor(i/4)*64 + 50);
            c.lineTo((i*64)%256 + 27, Math.floor(i/4)*64 + 55);
            c.moveTo((i*64)%256 + 31, Math.floor(i/4)*64 + 50);
            c.lineTo((i*64)%256 + 31, Math.floor(i/4)*64 + 55);
        }

        else if(board[i].name === "Queen"){
            //body
            c.moveTo((i*64)%256 + 16, Math.floor(i/4)*64 + 58);
            c.lineTo((i*64)%256 + 32, Math.floor(i/4)*64 + 15);
            c.lineTo((i*64)%256 + 48, Math.floor(i/4)*64 + 58);
            c.lineTo((i*64)%256 + 16, Math.floor(i/4)*64 + 58);
            c.stroke();

            //queen dots
            c.moveTo((i*64)%256 + 24, Math.floor(i/4)*64 + 55);
            c.lineTo((i*64)%256 + 24, Math.floor(i/4)*64 + 50);
            c.moveTo((i*64)%256 + 28, Math.floor(i/4)*64 + 55);
            c.lineTo((i*64)%256 + 28, Math.floor(i/4)*64 + 50);
            c.moveTo((i*64)%256 + 32, Math.floor(i/4)*64 + 55);
            c.lineTo((i*64)%256 + 32, Math.floor(i/4)*64 + 50);


        }
        c.stroke();
        c.closePath();
    }
}

function writeScore(){
    c.font = "22px Comic Sans MS";
    //c.fontSize = "22"
    c.fillStyle = "#000000";
    c.fillText("Player 1 score: " + playerScores[0], 270, 60);
    c.fillText("Player 2 score: " + playerScores[1], 270, 90);
}

//rainbow
function r(){
    var str = "#";
    var num = 0;
    for(var i=0; i<6; i++){
        num = Math.floor(Math.random()*11);
        switch(num){
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                str += num;
                break;
            case 10:
                str += "A";
                break;
            case 11:
                str += "B";
                break;
        }

    }
    return str
}

var redOrGreen = "";
function colourGetter(loyalty, pieceName){
    if(loyalty === 2)
        redOrGreen = "0066";
    else
        redOrGreen = "BB00";

    if(pieceName === "Pawn")
        return "#" + redOrGreen + "00"

    else if(pieceName === "Drone")
        return "#" + redOrGreen + "AA"

    else //queen
        return "#" + redOrGreen + "FF"
    
}

function showAvailableMoves(tile){
    c2.clearRect(0, 0, 256, 512);

    if(board[tile] === null)
        return;
    
    var a = board[tile].availableMoves;
    c2.fillStyle = "rgba(150, 50, 50, 0.4)"
    possibleMoves = [];
    for(var i=0; i<a.length; i++){
        c2.fillRect((a[i]%4)*64, Math.floor(a[i]/4)*64, 64, 64);
        possibleMoves.push(a[i][0]);
    }

    highlightPreviousMoves();
}

function writeEnd(){
    var winner = "Draw";
    if(playerScores[0] > playerScores[1])
        winner = "Player 1";
    else if(playerScores[0] < playerScores[1])
        winner = "Player 2";
    
    c.font = "30px Comic Sans"
    c.fillText("Winner is: " + winner, 270, 150);
}

function highlightPreviousMoves(){
    c2.fillStyle = "rgba(50, 50, 150, 0.4)";
    if(previousMoveP1.length > 0){
        c2.fillRect((previousMoveP1[0]%4)*64, Math.floor(previousMoveP1[0]/4)*64, 64, 64);
        c2.fillRect((previousMoveP1[1]%4)*64, Math.floor(previousMoveP1[1]/4)*64, 64, 64);
    }

    c2.fillStyle = "rgba(50, 150, 50, 0.4)";
    if(previousMoveP2.length > 0){
        c2.fillRect((previousMoveP2[0]%4)*64, Math.floor(previousMoveP2[0]/4)*64, 64, 64);
        c2.fillRect((previousMoveP2[1]%4)*64, Math.floor(previousMoveP2[1]/4)*64, 64, 64);
    }
}