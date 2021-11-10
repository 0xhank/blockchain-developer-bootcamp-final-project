import { Piece, c2i, numRows, numCols } from '../constants/constants'

export class BoardLogic {
  // Board is 1-indexed. Row 1 is the red army side.
  pieces :  Map< number, Piece | undefined> = new Map();

  public createBoard = () : Map< number, Piece | undefined> => {
    let blocked :  [number, number][] = [
      [4,7], [5,7], [4,6], [5,6],
      [4,3], [5,3], [4,2], [5,2]];
    blocked.map(item => this.pieces.set(c2i(item), (Piece.BLOCKED)));
    
    // ones
    this.pieces.set(c2i([9,0]), (Piece.ONE));
    
    // twos
    for (let i=1; i<3; i++) {
      this.pieces.set(c2i([9,i]), (Piece.TWO ));
    }
    
    //threes
    for (let i=3; i<6; i++) {
      this.pieces.set(c2i([9,i]), (Piece.THREE ));
    }
    
    //fours
    for (let i=6; i<10; i++) {
      this.pieces.set(c2i([9,i]), (Piece.FOUR ));
    }
    
    //five
    for (let i=0; i<5; i++) {
      this.pieces.set(c2i([8,i]), (Piece.FIVE ));
    }
    
    //six
    for (let i=5; i<10; i++) {
      this.pieces.set(c2i([8,i]), (Piece.SIX ));
    }
    
    //seven
    for (let i=0; i<5; i++) {
      this.pieces.set(c2i([7,i]), (Piece.SEVEN ));
    }
    
    //eight 
    for (let i=5; i<10; i++) {
      this.pieces.set(c2i([7,i]), (Piece.EIGHT ));
    }
    this.pieces.set(c2i([6,0]), (Piece.EIGHT ));
    
    //nine
    this.pieces.set(c2i([6,1]), (Piece.NINE ));

    //bomb
    for (let i=1; i<9; i++) {
      this.pieces.set(c2i([6,i]), (Piece.BOMB));
    }
    
    //flag
    this.pieces.set(c2i([6,9]), (Piece.FLAG));
  
    for(let i = 0; i < 40; i++) {
      this.pieces.set(c2i([Math.floor(i / 10), i % 10]), (Piece.ENEMY));
    }
    return this.pieces;
  }

  /* Accessor methods */

  getPiece = (a:  [number, number]) : Piece | undefined =>  {
    return this.pieces.get(c2i(a));
  }
  
  getBoard = () : Map< number, Piece | undefined> => {
    if(this.pieces.size === 0){ 
      return this.createBoard();
    }
    return this.pieces;
  }
  /* UPDATE methods */

  // Move the piece on posA to posB and vice-versa
  swapPieces = ([i,j] : [number, number], [k,l] : [number, number]) : void => {
    let tempA : Piece | undefined = this.pieces.get(c2i([i,j]));
    let tempB : Piece | undefined = this.pieces.get(c2i([k,l]));
      
    this.pieces.set(c2i([i,j]), tempB);
    this.pieces.set(c2i([k,l]), tempA);
  }

  removePiece = (pos :  [number, number]) : void => {
    this.pieces.set(c2i(pos), undefined);
  }

  isMoveAllowed = (start : [number, number], end : [number, number]) : boolean=> {
    let startPiece = this.pieces.get(c2i(start))
    let endPiece = this.pieces.get(c2i(end))
    if (end[0] < 0 ||
        end[1] > numCols - 1 ||
        end[0] < 0 || 
        end[1] > numRows - 1)
      return false;
      
    let diffX = Math.abs(start[0] - end[0])
    let diffY = Math.abs(start[1] - end[1])
    
    console.log(`diffX : ${diffX}, diffY: ${diffY}`);
    if(!(diffX === 0 && diffY === 1) && !(diffX === 1 && diffY === 0)){
      return false;
    }
    if( startPiece === Piece.ENEMY ||
        startPiece === Piece.BLOCKED ||
        startPiece === undefined || 
        startPiece === Piece.BOMB ||
        startPiece === Piece.FLAG
        ) {
      return false;
    }
    if( endPiece !== Piece.ENEMY && endPiece !== undefined) return false;
    return true;
  }

  oneSpaceAway = ([x, y] :  [number, number]) : Set<[number, number]> => {
    let moves : Set<[number, number]> = new Set();
  
    let oneSpaceAway :  [number, number][] = [];
      x !== 0 && oneSpaceAway.push([x - 1, y]);
      x !== (numRows - 1) && oneSpaceAway.push([x + 1, y]);
      y !== 0 && oneSpaceAway.push([x, y -1]);
      y !== (numCols - 1) && oneSpaceAway.push([x, y + 1]);

    oneSpaceAway.map(item => moves.add(item));
    return moves;
  }

  getValidMoves = (start : [number, number]) : Set<number> => {
    let moves : Set<number> = new Set()
    if (this.pieces.get(c2i(start)) == null) {
      return moves;
    }
    // let pieceValue = this.pieces.get(start)?.getValue();

    // "normal" one-space-away moves
    
    this.oneSpaceAway(start).forEach(move => {
      if (this.isMoveAllowed(start, move)) {
        moves.add(c2i(move));
      }
    });
    return moves;
  }

  public setPiece = ( loc : number, piece: Piece | undefined) : void => {
    this.pieces.set(loc, piece);
    console.log(`${loc} set to ${piece }`)
  }

  public isSquareEmpty = (pos :  [number, number]) : boolean => {
    return this.pieces.get(c2i(pos)) === undefined;
  }
}
