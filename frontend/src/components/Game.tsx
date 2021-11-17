import React, { useState, useEffect, useContext } from 'react';
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
  const [oppHashes, setOppHashes] = useState<string[]>([])

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
  }, [stratego, board, turn, oppHashes]);
 
  const piecesPlaced = (gameNo : number, redboard : number, blueBoard : number) => {
    if(gameNo.toString() !== gameID) return;
    console.log("Game Started")
    setStarted(true);
  }
  
  const makeMove = (gameNo : number, start : number, end : number, hash : string) => {
    console.log("make move,", gameNo);
    if(gameNo.toString() !== gameID || hash === oppHashes[oppHashes.length-1]) return;

    if(team === TeamType.RED){
      start = inv(start);
      end = inv(end);
    } 
    
    console.log(`Piece Moved From ${start} to ${end}`);
    
    let newBoard = new BoardLogic();
    newBoard = board;
    newBoard.movePiece (i2c(start), i2c(end));
    setBoard({...board, pieces : newBoard.pieces  });
    setOppHashes([...oppHashes, hash]);
    setTurn(turn === TeamType.RED ? TeamType.BLUE : TeamType.RED)
  }
  
  const battleSquares = (gameNo : number, att : number, def : number, hash: string) => {        
    if(gameNo.toString() !== gameID || hash === oppHashes[oppHashes.length-1]) return;
    console.log(`battle squares : ${att} and ${def}`);
    if(team === TeamType.RED){
      att = inv(att);
      def = inv(def);
    } 
    let myPiece : Piece | undefined = board.getPiece(i2c(team === turn ? att : def))
    
    if(!stratego.instance || !myPiece) return;
    const myNum : number = piece2Num(myPiece);
    setOppHashes([...oppHashes, hash]);

    alert(`You're ${team === turn ? 'attacking' : 'defending'} with ${myPiece}`)
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
    let newBoard = new BoardLogic();
    newBoard = board;
    
    newBoard.setPiece(attLoc, num2Piece(attVal));
    newBoard.setPiece(defLoc, num2Piece(defVal));
    setBoard({...board, pieces : newBoard.pieces  });
    setTurn(turn === TeamType.RED ? TeamType.BLUE : TeamType.RED)
  }
  
  const gameOver = (gameNo : number, winner : boolean) => {
    console.log("Game Over")
    if(gameNo.toString() !== gameID) return;
    onGameOver(winner ? TeamType.BLUE : TeamType.RED);
  }
  
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
    
    let tx = await stratego.instance.movePiece(gameID, startIdx, endIdx, board.hashBoard());
    
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