import { BoardLogic } from './BoardLogic';

import {TeamType, Piece, c2i, i2c } from '../constants/constants'

export default class GameLogic {
  board: BoardLogic = new BoardLogic();
  turn : TeamType = TeamType.RED;
  started : boolean = true;
  winner : TeamType | undefined = undefined;
  lastRevealedPieces : Map< [number, number], Piece[]> = new Map();
  lastMove :  [number, number][] = []; // Should be a pair (start, end) 

  /******************************* Getters ************************************/
  
  public getBoard() : Map< number, Piece | undefined> {
    return this.board.getBoard();
  }

  public getValidMoves = (start :  [number, number]) : Set<number> => {
    let empty : Set<number> = new Set();
    if (!this.started) {
      return empty;
    }
    if (this.board.getPiece(start) === null ||
        this.board.getPiece(start) === Piece.BLOCKED ||
        this.board.getPiece(start) === Piece.ENEMY){
      return empty;
    }
    return this.board.getValidMoves((start));
  }

  public getTurn = () : TeamType => {
    return this.turn;
  }

  public getLastMove = () : [number, number][] => {
    return this.lastMove;
  }

  public getWinner = () : TeamType | undefined => {
    return this.winner;
  }

  public isGameEnded = () => {
    return this.winner === TeamType.RED || this.winner === TeamType.BLUE;
  }
  
  public getPiece = (p : [number, number]) : Piece | undefined => {
    return this.board.getPiece(p);
  }
  
  private isTeamPiece = (p :  [number, number]) : boolean => {
    const piece = this.board.getPiece(p);
    return piece !== undefined && piece !== Piece.BLOCKED && piece !== Piece.ENEMY
  }
  
  public swapPieces = (a :  [number, number], b :  [number, number]) : void => {
    (this.isTeamPiece(a) && this.isTeamPiece(b)) && this.board.swapPieces(a, b);
  }

  public canMakeMove = (start : [number, number], end : [number, number]) : boolean => {
    return this.started && this.board.isMoveAllowed(start, end) && this.getValidMoves(start).has(c2i(end))
  }
  
  public movePiece = (start :  number, end :  number) : void => {
    this.board.swapPieces(i2c(start),i2c(end));
  }
  
  public setPiece = (loc : number, piece: Piece | undefined) : void => {
    this.board.setPiece(loc, piece);
  }
}