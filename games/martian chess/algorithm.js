//is player 2
var player2Algorithm = true;
var algorithmType = 2;

/*
0: random
1: push forward pieces
2: capture if possible, move forward otherwise
4: ???
10: training
*/

var chosenMove = 0;
var possibleAlgorithmMoves = [];
function algo(){
    possibleAlgorithmMoves = [];

    for(var i=16; i<32; i++){
        if(board[i] !== null){
            for(var j=0; j<board[i].availableMoves.length; j++)
                possibleAlgorithmMoves.push([i, board[i].availableMoves[j], []]);
        }
    }

    
    analyseMoves(2, possibleAlgorithmMoves);

    if(algorithmType === 0){
        chosenMove = Math.floor(Math.random()*possibleAlgorithmMoves.length);
    }

    else if(algorithmType === 1){
        possibleAlgorithmMoves.sort((a,b) => {
            var aContains = a[2].includes(1);
            var bContains = b[2].includes(1);
            if(aContains && !bContains)
                return -1;
            if(!aContains && bContains)
                return 1;

            return 0;
        });

        var amountContainsPushForward = 0;

        while(true){
            if(!possibleAlgorithmMoves[amountContainsPushForward][2].includes(1) ||
                amountContainsPushForward === possibleAlgorithmMoves.length)
                break;
            
            amountContainsPushForward++;
        }

        chosenMove = Math.floor(Math.random()*amountContainsPushForward);
    }

    else if(algorithmType === 2){
        possibleAlgorithmMoves.sort((a,b) => {
            var aContains = a[2].includes(2);
            var bContains = b[2].includes(2);
            if(aContains && !bContains)
                return -1;
            if(!aContains && bContains)
                return 1;

            return 0;
        });

        var amountContainsCaptures = 0;

        while(true){
            if(!possibleAlgorithmMoves[amountContainsCaptures][2].includes(2) ||
            amountContainsCaptures === possibleAlgorithmMoves.length)
                break;
            
                amountContainsCaptures++;
        }

        chosenMove = Math.floor(Math.random()*amountContainsCaptures);
    }

    else{
        chosenMove = 0;
    }


    if(possibleAlgorithmMoves.length > 0 && !end)
        movePiece(possibleAlgorithmMoves[chosenMove][1][0], possibleAlgorithmMoves[chosenMove][0]);
}

/*
analysis results uhhh explanation
[0] is just the position to move to
1: it moves the piece forward
2: this captures a piece 

*/


function analyseMoves(player, moves){
    if(player === 2){
        for(var i=0; i<moves.length; i++){
            //if it finds a move that moves a row up, include a 2 in the analysis array
            if(Math.floor(board[moves[i][0]].position/4) > Math.floor(moves[i][1][0]/4))
                moves[i][2].push(1);
            
            //it found a move that captures a piece
            if(Math.floor(board[moves[i][1][0]] !== null))
                moves[i][2].push(2);
        }
    }
}