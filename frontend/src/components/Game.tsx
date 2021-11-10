import React, { useState, useEffect, useContext } from 'react';
import { GreeterContext } from "./../hardhat/SymfoniContext";
import { Board } from './Board'
import {GameContext} from './Stratego'
import '../styles/Game.css'; 

import { TeamType, Piece, numRows, numCols, c2i, i2c, piece2Num, num2Piece } from '../constants/constants' 

interface Props {
  gameID : string,
  startNewGame : boolean,
  onGameOver: (team: TeamType) => void,
  team : TeamType,
}

export const Game: React.FC<Props> = ({gameID, startNewGame, onGameOver, team}) => {
                                        
  const stratego = useContext(GreeterContext);
  const game = useContext(GameContext).game;

  const [piecePositions, setPiecePositions] = useState<Map< number, Piece | undefined>>(game.getBoard());
  const [possibleMoves, setPossibleMoves] = useState<Set<number>>(new Set());
  const [lastMove, setLastMove] = useState< [number, number][]>();
  const [started, setStarted] = useState<boolean>(false);
  
  const doAsync = async () => {
    console.log("do Async");
    if(!stratego.instance) return;
    stratego.instance.on("piecesPlaced", piecesPlaced);
    stratego.instance.on("makeMove", makeMove);
    stratego.instance.on("battleSquares", battleSquares);
    stratego.instance.on("battleResolved", battleResolved);
    stratego.instance.on("GameoverLog", gameOver);
    return;
  };
  
  useEffect(() => {
    doAsync();
    setPiecePositions(game.getBoard())
    console.log("new piece positions")

  }, [stratego]);
  
  useEffect(() => {
    setPiecePositions(game.getBoard())
    
  }, [game])
  
  const piecesPlaced = (gameNo : number, redboard : number, blueBoard : number) => {
    if(gameNo.toString() !== gameID) return;
    console.log("Game Started")
    setStarted(true);
    return;
  }
  
  const makeMove = (gameNo : number, start : number, end : number) => {
    if(team === TeamType.RED){
      start = inv(start);
      end = inv(end);
    } 
  
    if(gameNo.toString() !== gameID) return;
    
    console.log(`Piece Moved From ${start} to ${end}`);
    
    game.movePiece (start, end);
    game.turn = game.turn === TeamType.RED ? TeamType.BLUE : TeamType.RED;

    console.log(`game turn: ${game.turn}`);
    return;
  }
  
  const battleSquares = (gameNo : number, att : number, def : number) => {        
    if(gameNo.toString() !== gameID) return;
    console.log(`battle squares : ${att} and ${def}`);
    if(team === TeamType.RED){
      att = inv(att);
      def = inv(def);
    } 
    let myPiece : Piece | undefined = team === game.turn ? 
                                                game.getPiece(i2c(att)) :
                                                game.getPiece(i2c(def));
    if(!stratego.instance || !myPiece) return;
    const myNum : number = piece2Num(myPiece);
    const tx = stratego.instance.battle(gameNo, myNum);
    console.log(tx);
    return;
  }
  
  const battleResolved = (gameNo : number,
    attLoc : number, 
    attVal : number, 
    defLoc : number, 
    defVal : number) => {
    if(gameNo.toString() !== gameID) return;
      console.log("battleResolved")
      if(team === TeamType.RED){
      attLoc = inv(attLoc);
      defLoc = inv(defLoc);
      } 
      console.log(`attLoc: ${attLoc}, attVal : ${num2Piece(attVal)}, defLoc: ${defLoc}, ${num2Piece(defVal)}`)
      
      game.setPiece(attLoc, num2Piece(attVal));
      game.setPiece(defLoc, num2Piece(defVal));
      game.turn = game.turn === TeamType.RED ? TeamType.BLUE : TeamType.RED;
  }

  const gameOver = (gameNo : number, winner : boolean) => {
    console.log("Game Over")
    if(gameNo.toString() !== gameID) return;
    onGameOver(winner ? TeamType.BLUE : TeamType.RED);
    return;
  }
  const submitTeam = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  )  => {
    e.preventDefault();
    if (!stratego.instance) throw Error("Stratego instance not ready");
    await stratego.instance.place(Number(gameID), 1);
  }
  
  const onClickPiece = (a :  [number, number]) => {
    setPossibleMoves(game.getValidMoves(a));
    setPiecePositions(game.getBoard());
    setLastMove(game.getLastMove());
  }
  
  const swapPieces = (a :  [number, number], b :  [number, number]) => {
    // console.log(`swap pieces! ${a} with ${b}`);
    game.swapPieces(a,b);
    setPiecePositions(game.getBoard());
  }
  
  const inv = (num : number) : number => {
    return (numCols * numRows) -1 - num;
  }
  
  const movePiece = async (start: [number, number], end : [number, number]) =>  {
    // console.log(`moving ${c2i(start)} to ${c2i(end)}`);
    // console.log(start, end); //  DEBUG
    if(!game.canMakeMove(start, end) || game.getTurn() !== team){
      console.log("invalid move");
      setPossibleMoves(new Set());
      return;
    }
    const completeMove = window.confirm("Confirm move");
    setPossibleMoves(new Set());
    
    if(!completeMove) return;
    
    if(!stratego.instance) throw Error("Stratego instance not ready");
    const  startIdx = team === TeamType.RED ? inv(c2i(start)) : c2i(start);
    const  endIdx = team === TeamType.RED ? inv(c2i(end)) : c2i(end);
    
    let tx = await stratego.instance.movePiece(gameID, startIdx, endIdx);
    
    console.log(tx);
  }
  
  return (
    <div id = "Game">
    <div className = "gameInfo">
     <p className = "titlet">{!started ? "Set Up Board" : "Playing Game"}</p>
        <p className = "text">{started ? game.getTurn() === team ? "Your Turn" : "Opponent's Turn" : null} </p>
        {!started && 
        <button className="confirm-bttn" onClick= {submitTeam}>
          Submit Setup
        </button>}
    </div>
    {/* {!started ? <p>Set Up Board</p> : <p>Playing Game</p>}
        {started ? game.getTurn() === team ? <p>"Your Turn"</p> : <p>"Opponent's Turn"</p> : null}  */}
    <Board 
    piecePositions={piecePositions}
    possibleMoves={possibleMoves}
    lastMove={lastMove}
    onClickPiece={started ? onClickPiece : () => {}}
    onSecondClick={started ? movePiece : swapPieces}
    team={team}
  />
  </div>
    // <div>
    
    // <Board 
    //   piecePositions={piecePositions}
    //   possibleMoves={possibleMoves}
    //   lastMove={lastMove}
    //   onClickPiece={started ? onClickPiece : () => {}}
    //   onSecondClick={started ? movePiece : swapPieces}
    //   team={team}
    // />
    // {!started && 
    // <button className="submit-btn" onClick= {submitTeam}>
    //   Submit Setup
    // </button>}
    // <button className="submit-btn" onClick= {() => setUpdated(updated + 1)}>
    //   Update
    // </button>
  // </div>
  );
}