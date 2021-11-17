import React from 'react';
import '../styles/Square.css';
import { TeamType, Piece } from '../utils/utils'
// import one from 'public/images/one.png';

interface Props {
  row : number,
  col : number,
  team : TeamType,
  piece : Piece | undefined,
  onClick : () => void,
  showMoveIndicator : boolean, 
  // showLastMove : boolean | undefined,
  showSelectedPiece : boolean | undefined
}

interface Style {
  color : string,
}

export const Square: React.FC<Props> = (
  { row, 
    col, 
    team, 
    piece, 
    onClick, 
    showMoveIndicator, 
    // showLastMove, 
    showSelectedPiece}) => 
{
  function prettyPrint(piece : Piece | undefined) : string {
    if(!piece) return '';
    switch (piece) {
      case Piece.ONE     : return '1'
      case Piece.TWO     : return '2'
      case Piece.THREE   : return '3'
      case Piece.FOUR    : return '4'
      case Piece.FIVE    : return '5'
      case Piece.SIX     : return '6'
      case Piece.SEVEN   : return '7'
      case Piece.EIGHT   : return '8'
      case Piece.NINE    : return '9'
      case Piece.FLAG    : return 'F'
      case Piece.BOMB    : return 'B'
      case Piece.BLOCKED : return 'X'
      case Piece.ENEMY   : return '?'
    }
  }

  function _fetchImage( name : string | undefined) : string {
    return `./images/${name}`;
  }

  function getStyle(piece : Piece | undefined) : Style | undefined{
    if (piece === undefined) return undefined;

    const style : Style = {color : 'black'}
    const myColor = team === TeamType.RED ? '#ff5000' : '#0065ff';
    const badColor = team !== TeamType.RED ? '#ff5000' : '#0065ff';

    if (piece === undefined) return piece;
    
    if(piece === Piece.ENEMY) style.color = badColor
    else if (piece !== Piece.BLOCKED) style.color = myColor;
    
    return style;
  }

  function getImage(piece : Piece | undefined) : string {
    if (!piece) return "";
    
    if (piece === Piece.ENEMY) {
      return team === TeamType.BLUE ? 'red-team.png' : 'blue-team.png'
    }
    switch (piece) {
      case Piece.ONE     : return 'one.png'
      case Piece.TWO     : return 'two.png'
      case Piece.THREE   : return 'three.png'
      case Piece.FOUR    : return 'four.png'
      case Piece.FIVE    : return 'five.png'
      case Piece.SIX     : return 'six.png'
      case Piece.SEVEN   : return 'seven.png'
      case Piece.EIGHT   : return 'eight.png'
      case Piece.NINE    : return 'nine.png'
      case Piece.FLAG    : return 'flag.png'
      case Piece.BOMB    : return 'bomb.png'
      case Piece.BLOCKED : return 'barrier.png'
    }
  }
  
  let className : string = "square ";
  className += showSelectedPiece ? "selectedPiece" : showMoveIndicator ? "possibleMoves" : "showLastMove";
  
  return (
    <div className= {className} onClick={onClick} style = { {backgroundImage : `url(${_fetchImage(getImage(piece))}`}}>
      <p className="piece-name" style={getStyle(piece)}>{prettyPrint(piece)}</p>
    </div>
  );
}

export default Square;
