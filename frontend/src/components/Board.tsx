import React, { useState } from 'react';
import {TeamType, numRows, numCols, c2i, Piece } from '../constants/constants'
import '../styles/Board.css'
import { Square } from './Square'

interface Props {
  piecePositions : Map< number, Piece | undefined>,
  possibleMoves : Set<number>,
  lastMove :  [number, number][] | undefined,
  onClickPiece : ([i,j] : [number, number]) => void,
  onSecondClick : (a : [number, number], b : [number, number]) => void,
  team : TeamType
}
 
export const Board: React.FC<Props> = ({
  piecePositions,
  possibleMoves,
  lastMove,
  onClickPiece,
  onSecondClick,
  team
}) => {

  const [lastClick, setLastClick] = useState<number[] | null>()
  
  const onClick = ([i,j]: [number, number]) => {
    if (lastClick) {
      const [i1,j1] = lastClick;
      onSecondClick([i1, j1], [i,j]);
      setLastClick(null)
    } else {
      onClickPiece([i,j]);
      setLastClick([i,j])
    }
  }
  
  const isLastMove = (a: [number, number]) => {
    if (lastMove === null) return false;
    if (team === TeamType.RED && lastMove?.includes(a)) {
      return true;
    }
    if (team === TeamType.BLUE && lastMove?.includes(a)) {
      return true;
    }
    return false;
  }

  const showSelectedPiece = (i : number,j : number) => {
    if (!lastClick) return;
    return lastClick[0] === i && lastClick[1] === j;
  }

  let squares = []

  for (let i : number = 0; i < numRows; i++) {
    for (let j : number = 0; j < numCols; j++) {
      squares.push(<Square
        key = {i * 10 + j}
        row={i}
        col={j}
        team={team}
        piece={piecePositions.get(c2i([i,j]))}
        onClick={() => onClick([i,j])}
        showMoveIndicator={possibleMoves.has(c2i([i,j]))}
        showLastMove={isLastMove([i,j])}
        showSelectedPiece={showSelectedPiece(i,j)}
      />);
    }
  }

  return (
    <div className="board">{squares}</div>
  );
}
