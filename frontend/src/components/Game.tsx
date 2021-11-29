import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StrategoContext } from "../hardhat/SymfoniContext";
import { CurrentAddressContext } from "../hardhat/SymfoniContext";

import sha1 from 'sha1'
import { Board } from './Board'
import '../styles/Game.css'; 
import BoardLogic from "../logic/BoardLogic"

import { TeamType,Piece, inv, c2i, i2c, num2Piece, piece2Num } from '../utils/utils' 

interface Props {
  gameID : string,
  startNewGame : boolean,
  onGameOver: (team: TeamType | undefined) => void,
  team : TeamType,
}


export const Game: React.FC<Props> = ({gameID, startNewGame, onGameOver, team}) => {
                                        
  const stratego = useContext(StrategoContext);
  const currentAddress = useContext(CurrentAddressContext)[0];

  const [started, setStarted] = useState<boolean>(false);
  const [turn, setTurn] = useState<TeamType>(TeamType.RED);
  const [board, setBoard] = useState<BoardLogic>(new BoardLogic());
  const [possibleMoves, setPossibleMoves] = useState<Set<Piece>>(new Set());
  const [prevMoves, setPrevMoves] = useState<string[]>([])
  const [hashes, setHashes] = useState<string[]>([]);
  const [waiting, setWaiting] = useState<boolean>(false);
  
  const handlePiecesPlaced = useCallback((gameNo : number, redBoard : string, blueBoard : string) => {
    if(gameNo.toString() !== gameID) return;
    setHashes([team === TeamType.RED ? blueBoard : redBoard])
    console.log("Game Started")
    setStarted(true);
    setWaiting(false);
  }, [gameID, team])
  
  const handleMove = useCallback((gameNo : number, start : number, end : number, hash : string) => {
    // console.log("make move,", gameNo);
    if(gameNo.toString() !== gameID) return;

    if(team === TeamType.RED){
      start = inv(start);
      end = inv(end);
    }  
    
    console.log(`Piece Moved From ${start} to ${end}`);
    
    let newBoard = new BoardLogic();
    newBoard = board;
    newBoard.movePiece(i2c(start), i2c(end));
    setBoard({...board, pieces: newBoard.pieces });
    if(turn !== team) {
      console.log(`receiving ${hash}`)

      setHashes([...hashes, hash])
    }
    console.log(hashes);
    setTurn(turn === TeamType.RED ? TeamType.BLUE : TeamType.RED)
    setWaiting(false);

  }, [board, gameID, team, turn, hashes])


  const battleSquares = useCallback(async (gameNo : number,
                                           att : number, 
                                           def : number,
                                           hash) => {  
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
    setWaiting(false);

    alert(`You're ${team === turn ? 'attacking' : 'defending'} with ${myPiece}`)
    if(!stratego.instance) throw new Error("stratego not ready");
    try {
    await stratego.instance.battle(gameNo, myNum)
    setWaiting(true);

    } catch(e) {
      alert(`${e ? e.message ? e.message : e.data.message : null}, please try again`)

    }
    
    if(turn !== team) {
      console.log(`receiving ${hash}`)
      setHashes([...hashes, hash])
    }
  }, [board, gameID, stratego, team, turn, hashes])
  
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
    
    let attPiece : Piece | undefined;
    let defPiece : Piece | undefined;
    
    if(team === turn){
      attPiece = num2Piece(Number(attVal));
      defPiece = Number(defVal) === 0 ?  undefined : Piece.ENEMY;
    } else {
      defPiece = num2Piece(Number(defVal));
      attPiece = Number(attVal) === 0 ? undefined : Piece.ENEMY;
    }
    
    setBoard((prevBoard: BoardLogic) => {
      prevBoard.setPiece(Number(attLoc), attPiece);
      prevBoard.setPiece(Number(defLoc), defPiece);
      return prevBoard;
    });
    
    setTurn(turn === TeamType.RED ? TeamType.BLUE : TeamType.RED)
    setWaiting(false);

  }, [gameID, team, turn])
  
  const gameOver = useCallback( async (gameNo : number, winner : boolean) =>  {
    console.log("Game Over")
    if(gameNo.toString() !== gameID) return;
    // onGameOver(winner ? TeamType.BLUE : TeamType.RED);
    alert("verify your moves");
    if(!stratego.instance) throw Error("Stratego instance not ready");
    try {
      let tx = await stratego.instance.verify(gameID, prevMoves.toString())
      setWaiting(true);

      console.log(tx);
    } catch (e){
      if(!e) alert("unknown error");
      else if(e.message) alert(`${e.message}, please try again`)
      else if(!e.data.message) alert(`${JSON.stringify(e)}, please try again`)
      else alert(`${e.data.message}, please try again`)    }
  }, [gameID, stratego, prevMoves]);
  
  const verify = useCallback((gameNo : number, address : string, oppMoves : string) =>  {
    console.log("Verifying")
    if(gameNo.toString() !== gameID || address === currentAddress){
      console.log("wrong game or address")
      return;
    } 
    
    let verified : boolean = true;
    const movesArray : string [] = oppMoves.split(',');
    console.log(`oppmoves: ${movesArray}`)
    console.log(`hashes : ${hashes}`);
    if(movesArray.length !== hashes.length){
      console.log("wrong array length!");
      verified = false;
      return;
    }
    for(let i in movesArray){
      if(sha1(movesArray[i]) !== hashes[i]){
        console.log(`move ${i} failed`);
        verified = false;
      } else {
        console.log(`move ${i} succeeded`);
      }
    }
    alert(verified ? "Opponent Moves Verified!" : "Opponent Cheated!")
    onGameOver(turn === TeamType.RED ? TeamType.RED : TeamType.BLUE)
    setWaiting(false);

    // onGameOver(winner);  
  }, [gameID, hashes, currentAddress, onGameOver, turn]);

/***********************************Use Effects ******************************/
  useEffect(() => {
    stratego?.instance?.on("verifyData", verify);
    return () => {stratego?.instance?.off("verifyData", verify)}
  }, [verify, stratego]);
  
  useEffect(() => {
    stratego?.instance?.on("piecesPlaced", handlePiecesPlaced);
    return () => {stratego?.instance?.off("piecesPlaced", handlePiecesPlaced)}
  }, [handlePiecesPlaced, stratego]);
  
  useEffect(() => {
    stratego?.instance?.on("makeMove", handleMove);
    return () => {stratego?.instance?.off("makeMove", handleMove)}
  }, [handleMove, stratego]);
  
  useEffect(() => {
    stratego?.instance?.on("battleSquares", battleSquares);
    return () => { stratego?.instance?.off("battleSquares", battleSquares)}
  }, [battleSquares, stratego]);
  
  useEffect(() => {
    stratego?.instance?.on("battleResolved", battleResolved);
    return () => { stratego?.instance?.off("battleResolved", battleResolved)}
  }, [battleResolved, stratego]);
  
  useEffect(() => {
    stratego?.instance?.on("GameoverLog", gameOver);
    return () => {stratego?.instance?.off("GameoverLog", gameOver)};
  }, [gameOver, stratego]);
  
  const submitTeam = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  )  => {
    e.preventDefault();
    if (!stratego.instance) throw Error("Stratego instance not ready");
    console.log(`sending orig board ${sha1(board.toString())}`)
    setPrevMoves([board.toString()]);
    try{ 
    await stratego.instance.place(Number(gameID), sha1(board.toString()));
    setWaiting(true);

    } catch (e) {
      if(!e) alert("unknown error");
      else if(e.message) alert(`${e.message}, please try again`)
      else if(!e.data.message) alert(`${JSON.stringify(e)}, please try again`)
      else alert(`${e.data.message}, please try again`);
    }
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
    
    setPrevMoves([...prevMoves, board.toString()]);
    console.log(`sending ${sha1(board.toString())}`)
    try {
      let tx = await stratego.instance.movePiece(gameID, startIdx, endIdx, sha1(board.toString()))
      setWaiting(true);

      console.log(tx);
    } catch (e) {
      if(!e) alert("unknown error");
      else if(e.message) alert(`${e.message}, please try again`)
      else if(!e.data.message) alert(`${JSON.stringify(e)}, please try again`)
      else alert(`${e.data.message}, please try again`);
    }
    
  }
  
  return (
      <div id = "Game">
      <div className = "gameInfo">
       <p className = "titlet">{!started ? "Set Up Board" : "Playing Game"}</p>
          <p className = "text">{started ? waiting ? "Waiting" : turn === team ? "Your Turn" : "Opponent's Turn" : null} </p>
          {!started && 
          <button className="confirm-bttn" onClick= {submitTeam}>
            Submit
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