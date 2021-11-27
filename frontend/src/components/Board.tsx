import React, { useState } from 'react';
import {TeamType, numRows, numCols, c2i, Piece } from '../utils/utils'
import '../styles/Board.css'
import { Square } from './Square'

interface Props {
  team : TeamType,
  pieces : Map<number, Piece | undefined>
  onFirstClick : ([i,j] : [number, number]) => void,
  onSecondClick : (a : [number, number], b : [number, number]) => void,
  possibleMoves : Set<Piece>
}

export const Board: React.FC<Props> = ({team, pieces, possibleMoves, onFirstClick, onSecondClick}) => {

  const [lastClick, setLastClick] = useState<[number,number] | undefined>()
  
  const onClick = ([i,j]: [number, number]) => {
    if (lastClick) {
      const [i1,j1] = lastClick;
      onSecondClick([i1, j1], [i,j]);
      setLastClick(undefined);
    } else {
      onFirstClick([i,j]);
      setLastClick([i,j]);
    }
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
        piece={pieces.get(c2i([i,j]))}
        onClick={() => onClick([i,j])}
        showMoveIndicator={possibleMoves.has(c2i([i,j]))}
        showSelectedPiece={showSelectedPiece(i,j)}
      />);
    }
  }

  return (
    <div className="board">{squares}</div>
  );
}