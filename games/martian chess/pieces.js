class Piece{
    constructor(position, loyalty, name){
        this.position = position;
        this.loyalty = loyalty; //number representing the player number (here 1 or 2)
        this.name = name;
    }
    availableMoves = [];
    score = 0;
    colour = "";
}

class Pawn extends Piece{
    constructor(position, loyalty, name){
        super(position, loyalty, name);
        this.score = 1;
        this.colour = colourGetter(this.loyalty, this.name);
    }

    getAvailableMoves(board){
        this.availableMoves = [];

        //test for all four corners; are they possible, is a piece captured, and is a crossing happening
        //the two second parts are post-processed into the available moves

        if(this.position-5 > -1 && (this.position-5)%4 < this.position%4)
            if(board[this.position-5] === null || board[this.position-5].loyalty !== this.loyalty)
                this.availableMoves.push([this.position-5]);

        if(this.position-3 > -1 && (this.position-3)%4 > this.position%4)
            if(board[this.position-3] === null || board[this.position-3].loyalty !== this.loyalty)
                this.availableMoves.push([this.position-3]);
        
        if(this.position+3 < 32 && (this.position+3)%4 < this.position%4)
            if(board[this.position+3] === null || board[this.position+3].loyalty !== this.loyalty)
                this.availableMoves.push([this.position+3]);
        
        if(this.position+5 < 32 && (this.position+5)%4 > this.position%4)
            if(board[this.position+5] === null || board[this.position+5].loyalty !== this.loyalty)
                this.availableMoves.push([this.position+5]);
        
    }
}


class Drone extends Piece{
    constructor(position, loyalty, name){
        super(position, loyalty, name);
        this.score = 2;
        this.colour = colourGetter(this.loyalty, this.name);
    }

    getAvailableMoves(board){
        this.availableMoves = [];

        //since drones can move twice in a position, i just check the positions 2 if 1 was successfull
        if(this.position-4 > -1){
            if(board[this.position-4] === null){
                this.availableMoves.push([this.position-4]);

                if(this.position-8 > 0)
                    if(board[this.position-8] === null || board[this.position-8].loyalty !== this.loyalty)
                        this.availableMoves.push([this.position-8]);
                
            }
            else if(board[this.position-4].loyalty !== this.loyalty)
                this.availableMoves.push([this.position-4]);

        }

        if(this.position-1 > -1 && (this.position-1)%4 < this.position%4){
            if(board[this.position-1] === null){
                this.availableMoves.push([this.position-1]);

                if(this.position-2 > 0 && (this.position-2)%4 < this.position%4)
                    if(board[this.position-2] === null || board[this.position-2].loyalty !== this.loyalty)
                        this.availableMoves.push([this.position-2]);
                
            }
            else if(board[this.position-1].loyalty !== this.loyalty)
                this.availableMoves.push([this.position-1]);
        }

        if(this.position+4 < 32){
            if(board[this.position+4] === null){
                this.availableMoves.push([this.position+4]);

                if(this.position+8 < 32)
                    if(board[this.position+8] === null || board[this.position+8].loyalty !== this.loyalty)
                        this.availableMoves.push([this.position+8]);
                
            }
            else if(board[this.position+4].loyalty !== this.loyalty)
                this.availableMoves.push([this.position+4]);
        }

        if(this.position+1 < 32 && (this.position+1)%4 > this.position%4){
            if(board[this.position+1] === null){
                this.availableMoves.push([this.position+1]);

                if(this.position+2 > 0 && (this.position+2)%4 > this.position%4)
                    if(board[this.position+2] === null || board[this.position+2].loyalty !== this.loyalty)
                        this.availableMoves.push([this.position+2]);
                
            }
            else if(board[this.position+1].loyalty !== this.loyalty)
                this.availableMoves.push([this.position+1]);
        }
    }
}

class Queen extends Piece{
    constructor(position, loyalty, name){
        super(position, loyalty, name);
        this.score = 3;
        this.colour = colourGetter(this.loyalty, this.name);
    }

    getAvailableMoves(){
        this.availableMoves = [];

        //down
        for(var i=1; i<8; i++){
            if(this.position+(i*4) < 32){
                if(board[this.position+(i*4)] === null)
                    this.availableMoves.push([this.position+(i*4)]);

                else if(board[this.position+(i*4)].loyalty !== this.loyalty){
                    this.availableMoves.push([this.position+(i*4)]);
                    break;
                }

                else
                    break;
            }
            else
                break;
        }

        //up
        for(var i=1; i<8; i++){
            if(this.position-(i*4) > -1){
                if(board[this.position-(i*4)] === null)
                    this.availableMoves.push([this.position-(i*4)]);

                else if(board[this.position-(i*4)].loyalty !== this.loyalty){
                    this.availableMoves.push([this.position-(i*4)]);
                    break;
                }
                else
                    break;
            }
            else
                break;
        }

        //right
        for(var i=1; i<4; i++){
            //i don't need to check for overflow (32+),
            //since this is an interesting case where the if below will indirectly find it anyways
            if((this.position+i)%4 < this.position%4)
                break;
            
            if(board[this.position+i] === null) 
                this.availableMoves.push([this.position+i]);
            
            else if(board[this.position+i].loyalty === this.loyalty)
                break;

            else if(board[this.position+i].loyalty !== this.loyalty){
                this.availableMoves.push([this.position+i]);
                break;
            }
        }

        //left
        for(var i=1; i<4; i++){
            if(this.position-i < 0 || (this.position-i)%4 > this.position%4)
                break;
            
            if(board[this.position-i] === null) 
                this.availableMoves.push([this.position-i]);

            else if(board[this.position-i].loyalty === this.loyalty)
                break;

            else if(board[this.position-i].loyalty !== this.loyalty){
                this.availableMoves.push([this.position-i]);
                break;
            }
        }

        //up left
        for(var i=1; i<4; i++){
            if(this.position-(i*5) < 0 || (this.position-(i*5))%4 > this.position%4)
                break;
            
            if(board[this.position-(i*5)] === null) 
                this.availableMoves.push([this.position-(i*5)]);

            else if(board[this.position-(i*5)].loyalty === this.loyalty)
                break;

            else if(board[this.position-(i*5)].loyalty !== this.loyalty){
                this.availableMoves.push([this.position-(i*5)]);
                break;
            }
        }

        //up right
        for(var i=1; i<4; i++){
            if(this.position-(i*3) < 0 || (this.position-(i*3))%4 < this.position%4)
                break;
            
            if(board[this.position-(i*3)] === null) 
                this.availableMoves.push([this.position-(i*3)]);

            else if(board[this.position-(i*3)].loyalty === this.loyalty)
                break;

            else if(board[this.position-(i*3)].loyalty !== this.loyalty){
                this.availableMoves.push([this.position-(i*3)]);
                break;
            }
        }

        //down left
        for(var i=1; i<4; i++){
            if(this.position+(i*3) > 31 || (this.position+(i*3))%4 > this.position%4)
                break;
            
            if(board[this.position+(i*3)] === null) 
                this.availableMoves.push([this.position+(i*3)]);
            
            else if(board[this.position+(i*3)].loyalty === this.loyalty)
                break;

            else if(board[this.position+(i*3)].loyalty !== this.loyalty){
                this.availableMoves.push([this.position+(i*3)]);
                break;
            }
        }

        //down right
        for(var i=1; i<4; i++){
            if(this.position+(i*5) > 31 || (this.position+(i*5))%4 < this.position%4)
                break;
            
            if(board[this.position+(i*5)] === null) 
                this.availableMoves.push([this.position+(i*5)]);
            
            else if(board[this.position+(i*5)].loyalty === this.loyalty)
                break;

            else if(board[this.position+(i*5)].loyalty !== this.loyalty){
                this.availableMoves.push([this.position+(i*5)]);
                break;
            }
        }
    }
}