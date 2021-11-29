import React, { useContext, useEffect, useState } from "react";
import { StrategoContext, CurrentAddressContext } from "../hardhat/SymfoniContext";
import {  } from "../hardhat/SymfoniContext";
import { BigNumber } from "bignumber.js";
import { Game } from "./Game"
import '../styles/Stratego.css'
import {TeamType } from '../utils/utils'

export const Stratego: React.FC = () => {
  
  const stratego = useContext(StrategoContext);
  const currentAddress = useContext(CurrentAddressContext)[0];

  const [winner, setWinner] = useState<TeamType | undefined>(undefined);
  const [newGame, setNewGame] = useState<boolean>(false);
  const [showGameNo, setShowGameNo] = useState<boolean>(false);
  const [gameID, setGameID] = useState<string>('');
  const [IDstore, setIDstore] = useState<string>('');
  const [team, setTeam] = useState<TeamType>(TeamType.RED);
  const strategoAddress =0x88049602F0369DE0dBC4bD5dD39D4068333f8789;
 
  useEffect(() => {
    console.log(`gameID updated, is now ${gameID}`);
    const doAsync = async () => {
      
      if (!stratego.instance) return;
      console.log(currentAddress);

      console.log("Stratego is deployed at ", 0x88049602F0369DE0dBC4bD5dD39D4068333f8789);
      
      stratego.instance.on("GameIDs", (sender : number, game : number) => {
        console.log("heard GameIds");
        console.log(`game: ${game.toString()}`);
        console.log(`addresses equal: ${sender.toString()}, ${currentAddress}`);
        if(sender.toString() !== currentAddress) return;
        // setNewGame(true);
        setShowGameNo(true);
        setGameID(game.toString());
        console.log(`gameID: ${gameID}`); 
      });
      
      stratego.instance.on("beginGame", (game : BigNumber, red : string, blue : string) => {
        console.log("heard beginGame");
        console.log(`param game is ${game} and gameID: ${gameID}`);
        
        if(game.toString() !== gameID) return;
        // setOpponent(red === currentAddress ? Number(blue) : Number(red));
        setTeam(red === currentAddress ? TeamType.RED : TeamType.BLUE);
        console.log("game has begun");
        setNewGame(true);
        // event.removeListener(); // Solve memory leak with this.
      });
    };
    doAsync();
    return(() => {
      if (!stratego.instance) return;
      stratego.instance.removeAllListeners("beginGame");
      stratego.instance.removeAllListeners("GameIDs");
    })
  }, [stratego, gameID, currentAddress]); 
  

  const startNewGame = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!stratego.instance) throw Error("Stratego instance not ready");
    try{
    const tx = await stratego.instance.createGame();
    console.log("createGame tx", tx);     
    } catch (e){
      if(!e) alert("unknown error");
      else if(e.message) alert(`${e.message}, please try again`)
      else if(!e.data.message) alert(`${JSON.stringify(e)}, please try again`)
      else alert(`${e.data.message}, please try again`)
    }
  };
  
  const joinGame = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stratego.instance) throw Error("Stratego instance not ready");
    setGameID(IDstore);
    try{
      const tx = await stratego.instance.join(Number(IDstore));
      console.log("join tx", tx);      
    } catch (e){
      if(!e) alert("unknown error");
      else if(e.message) alert(`${e.message}, please try again`)
      else if(!e.data.message) alert(`${JSON.stringify(e)}, please try again`)
      else alert(`${e.data.message}, please try again`)    }
        
      // set it to the value the blockchain returns   
  }
  
  function handleChange (input: string) {
    setIDstore(input);
  }
  
  const handleReset = () => {
    setGameID('');
    setNewGame(false);
    setShowGameNo(false);
  }
  
  const endGame = (team : TeamType | undefined) => {
    if(team === undefined){
      console.log("no winner");
      return;
    }
    setWinner(team);
  }

  return (
    
    <div className = "body">
      <span className = "text">Connected to: {currentAddress.slice(0,6)}...</span>          
      {/* <span className = "text" style = {{alignSelf: "flex-end"}}>Network: {chainId}...</span>           */}

      {winner !== undefined ? 
        <div className="entry-block">
          <p className= "title ">Game Over!</p>
          <p className = "title">{winner === TeamType.RED ? "Red" : "Blue"} wins!</p>
        </div> : 
        newGame ? 
          <Game
            gameID = {gameID}
            startNewGame={newGame}
            onGameOver={(team : TeamType | undefined) => endGame(team)}
            team={team}
          /> :
          showGameNo ?  
            <div className="entry-block">
              <p className = "title">Your game room:</p>
              <p className = "title" style = {{fontSize : "18pt"}}>{gameID}</p>
              <p className = "text">Awaiting opponent to join game...</p>
              <button className="confirm-btn" onClick = {handleReset}>Reset Game</button>
            </div> :
              <div className="entry-block">
                <span className = "title">Start New Game</span>
                <div className = "form">
                <button className="confirm-btn" onClick={startNewGame}>Create Game</button>
              
                <form style = {{width : '100%'}} onSubmit={joinGame}>
                  <input
                    value={IDstore}
                    onChange={(e) => handleChange(e.target.value)}
                    type="number"
                    placeholder="Enter game number"
                    className="input"
                  />
                  <button type="submit" className="confirm-btn">Join Game</button>
                </form>
                </div>
              </div>}
    </div>
  )
}

  