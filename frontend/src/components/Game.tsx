import React, { useState, useEffect, useContext, useCallback } from 'react';
import { GreeterContext } from "../hardhat/SymfoniContext";

import { Board } from './Board'
import '../styles/Game.css'; 
import BoardLogic from "../logic/BoardLogic"

import { TeamType,Piece, inv, c2i, i2c, num2Piece, piece2Num } from '../utils/utils' 

interface Props {
  gameID : string,
  startNewGame : boolean,
  onGameOver: (team: TeamType) => void,
  team : TeamType,
}


export const Game: React.FC<Props> = ({gameID, startNewGame, onGameOver, team}) => {
                                        
  const stratego = useContext(GreeterContext);

  const [started, setStarted] = useState<boolean>(false);
  const [turn, setTurn] = useState<TeamType>(TeamType.RED);
  // const [winner, setWinner] = useState< TeamType | undefined >(undefined);
  const [board, setBoard] = useState<BoardLogic>(new BoardLogic());
  const [possibleMoves, setPossibleMoves] = useState<Set<Piece>>(new Set());
   
  const handlePiecesPlaced = useCallback((gameNo : number, redboard : number, blueBoard : number) => {
    if(gameNo.toString() !== gameID) return;
    console.log("Game Started")
    setStarted(true);
  }, [gameID])
  
  const handleMove = useCallback((gameNo : number, start : number, end : number, hash : string) => {
    // console.log("make move,", gameNo);
    if(gameNo.toString() !== gameID) return;

    if(team === TeamType.RED){
      start = inv(start);
      end = inv(end);
    } 
    
    console.log(`Piece Moved From ${start} to ${end}`);

    setBoard((prevBoard : BoardLogic) => {
      prevBoard.movePiece(i2c(start), i2c(end));
      return prevBoard
    });

    setTurn((prevTurn : TeamType) => prevTurn === TeamType.RED ? TeamType.BLUE : TeamType.RED)
  }, [board, gameID, team, turn])


  const battleSquares = useCallback(async (gameNo : number, att : number, def : number) => {  
    if(gameNo.toString() !== gameID) return;
    console.log(`battle squares : ${att} and ${def}`);
    if(team === TeamType.RED){
      att = inv(att);
      def = inv(def);
    } 
    let myPiece : Piece | undefined = board.getPiece(i2c(team === turn ? att : def))
    
    if(!stratego.instance || !myPiece) return;
    const myNum : number = piece2Num(myPiece);
    // setOppHashes([...oppHashes, hash]);

    alert(`You're ${team === turn ? 'attacking' : 'defending'} with ${myPiece}`)
    if(!stratego.instance) throw new Error("stratego not ready");
    const tx = await stratego.instance.battle(gameNo, myNum);
    console.log(tx);

  }, [board, gameID, stratego, team, turn])
  
  const battleResolved = useCallback((gameNo : number,
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
    
    setBoard((prevBoard : BoardLogic) => {
      prevBoard.setPiece(attLoc, num2Piece(attVal));
      prevBoard.setPiece(defLoc, num2Piece(defVal));
      return prevBoard
    });
    
    setTurn((prevTurn : TeamType) => prevTurn === TeamType.RED ? TeamType.BLUE : TeamType.RED)
  }, [board, gameID, team, turn])
  
  const gameOver = useCallback((gameNo : number, winner : boolean) => {
    console.log("Game Over")
    if(gameNo.toString() !== gameID) return;
    onGameOver(winner ? TeamType.BLUE : TeamType.RED);
  }, [gameID, onGameOver]);
  
  const listen = useCallback(async () => {

    if(!stratego.instance) return;
    stratego.instance.on("piecesPlaced", handlePiecesPlaced);
    stratego.instance.on("makeMove", handleMove);
    stratego.instance.on("battleSquares", battleSquares);
    stratego.instance.on("battleResolved", await battleResolved);
    stratego.instance.on("GameoverLog", gameOver);
    return async () => {
      stratego.instance.off("piecesPlaced", handlePiecesPlaced);
    stratego.instance.off("makeMove", handleMove);
    stratego.instance.off("battleSquares", battleSquares);
    stratego.instance.off("battleResolved", await battleResolved);
    stratego.instance.off("GameoverLog", gameOver);
    };
  },[ battleResolved, battleSquares, gameOver, handleMove, handlePiecesPlaced, stratego.instance]);
  
   useEffect(() => {
      listen();

    }, [listen]);
  
  const submitTeam = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  )  => {
    e.preventDefault();
    if (!stratego.instance) throw Error("Stratego instance not ready");
    await stratego.instance.place(Number(gameID), 1);
  }
   
  const onClickPiece = (a :  [number, number]) => {
    setPossibleMoves(board.getValidMoves(a));
    // setLastMove(getLastMove());
  }
  
  const movePiece = async (start: [number, number], end : [number, number]) =>  {
    // console.log(`moving ${c2i(start)} to ${c2i(end)}`);
    // console.log(start, end); //  DEBUG
    if(!board.isMoveAllowed(start, end) || turn !== team){
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
    
    let tx = await stratego.instance.movePiece(gameID, startIdx, endIdx)
    
    console.log(tx);
  }
  
  return (
      <div id = "Game">
      <div className = "gameInfo">
       <p className = "titlet">{!started ? "Set Up Board" : "Playing Game"}</p>
          <p className = "text">{started ? turn === team ? "Your Turn" : "Opponent's Turn" : null} </p>
          {!started && 
          <button className="confirm-bttn" onClick= {submitTeam}>
            Submit Setup
          </button>}
      </div>

      <Board
        team = {team}
        pieces = {board.getBoard()}
        onFirstClick={started ? onClickPiece : () => {}}
        onSecondClick={started ? movePiece : board.swapPieces}
        possibleMoves = {possibleMoves}
      />
    </div>
  );
}