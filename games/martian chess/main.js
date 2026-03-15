//TODO LIST
//make the piece movement contain less if-statements...
//make the drawing of the pieces more modular


//initialize everything
function start(){
    var inputNum = Math.floor(parseInt(document.getElementById("algoInput").value));
    if(typeof inputNum === "number" && !isNaN(inputNum))
        algorithmType = inputNum
    
    preprocessBoard();
    mainLoop();
}

//not an actual loop, but the main thing that will be used on each draw update
function mainLoop(){
    c.clearRect(0, 0, 800, 800);
    drawBackground();
    drawGrid();
    drawMartians();
    getAllAvailableMoves();
    highlightPreviousMoves();
    writeScore();
    if(end){
        writeEnd();
    }
}


document.addEventListener("keydown", function(e){
    if(e.key = "r")
        resetBoard();
});

function resetBoard(){
    end = false;
    playerTurn = 1;
    previousMoveP1 = [];
    previousMoveP2 = [];
    playerScores = [0, 0];
    board = [
        3, 3, 2, 0,
        3, 2, 1, 0,
        2, 1, 1, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 1, 1, 2,
        0, 1, 2, 3,
        0, 2, 3, 3,
    ];
    start();
}

var board = [
    3, 3, 2, 0,
    3, 2, 1, 0,
    2, 1, 1, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 1, 1, 2,
    0, 1, 2, 3,
    0, 2, 3, 3,
];

//turn board into actual object pieces
function preprocessBoard(){
    for(var i=0; i<board.length; i++){
        if(board[i] === 0)
            board[i] = null;
        else if(board[i] === 1)
            board[i] = new Pawn(i, Math.floor(i/16)+1, "Pawn");
        else if(board[i] === 2)
            board[i] = new Drone(i, Math.floor(i/16)+1, "Drone");
        else
            board[i] = new Queen(i, Math.floor(i/16)+1, "Queen");
    }
}

function getAllAvailableMoves(){
    for(var i=0; i<board.length; i++){
        if(board[i] !== null && board[i] !== 2 && board[i] !== 3)
            board[i].getAvailableMoves(board);
        
    }
}


var clickedTile = -1;
var previousClickedTile = -1;
canvas2.addEventListener("mousedown", function(e){
    if(e.clientX-600 > 256 || e.clientY > 512)
        return;


    clickedTile = Math.floor((e.clientX-600)/64)%4 + Math.floor(e.clientY/64)*4;

    for(var i=0; i<possibleMoves.length; i++){
        if(clickedTile === possibleMoves[i] && clickedTile !== previousClickedTile){
            if(clickedTile === previousMove[1] && previousClickedTile === previousMove[0]){
                console.log("illegal move!")
                return;
            }

            movePiece(clickedTile, previousClickedTile);
            c2.clearRect(0, 0, 256, 512);
            highlightPreviousMoves();
            return;
        }
    }


    if(board[clickedTile] !== null){
        previousClickedTile = clickedTile;
        showAvailableMoves(clickedTile)
    }

    else{
        c2.clearRect(0, 0, 256, 512);
    }
    
})

//filled by showAvailableMoves
var possibleMoves = [];
var previousMove = [-1, -1];

var previousMoveP1 = [];
var previousMoveP2 = [];

function movePiece(clickedTile, previousClickedTile){
    if(board[previousClickedTile].loyalty !== playerTurn){
        console.log("not your turn!")
        return;
    }


    possibleMoves = [];
    previousMove = [clickedTile, previousClickedTile];

    //award points if this is a capture
    if(board[clickedTile] !== null)
        playerScores[playerTurn-1] += board[clickedTile].score;

    board[clickedTile] = board[previousClickedTile];
    board[clickedTile].position = clickedTile;
    board[clickedTile].loyalty = Math.floor(clickedTile/16)+1;
    board[previousClickedTile] = null;
    
    if(playerTurn === 1)
        previousMoveP1 = [clickedTile, previousClickedTile];
    else
        previousMoveP2 = [clickedTile, previousClickedTile];

    mainLoop();
    checkPlayer();
}

//player turn
var playerTurn = 1;
var playersHavePieces = [true,true];
var end = false;
function checkPlayer(){
    playersHavePieces = [false, false];
    for(var i=0; i<32; i++){
        if(i<16 && board[i] !== null){
            playersHavePieces[0] = true;
            i = 15;
            continue;
        }

        else if(i > 15 && board[i] != null){
            playersHavePieces[1] = true;
            break;
        }
    }

    if(!playersHavePieces[0] || !playersHavePieces[1]){
        end = true;
        mainLoop();
        return;
    }

    playerTurn += 1
    if(playerTurn === 3)
        playerTurn = 1;
    
    if(playerTurn == 2 && player2Algorithm){
        getAllAvailableMoves();
        algo();
    }
}

playerScores = [0,0];


start();