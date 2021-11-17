import React, { useContext, useEffect, useState } from "react";
import { GreeterContext } from "../hardhat/SymfoniContext";
import { CurrentAddressContext } from "../hardhat/SymfoniContext";
import { BigNumber } from "bignumber.js";
import { Game } from "./Game"
import '../styles/Stratego.css'
import {TeamType } from '../constants/constants'
import GameLogic from "../logic/GameLogic"

export const Stratego: React.FC = () => {
  
  const stratego = useContext(GreeterContext);
  const currentAddress = useContext(CurrentAddressContext)[0];
  
  const [winner, setWinner] = useState<TeamType | null>(null);
  const [newGame, setNewGame] = useState<boolean>(false);
  const [showGameNo, setShowGameNo] = useState<boolean>(false);
  const [gameID, setGameID] = useState<string>('');
  const [IDstore, setIDstore] = useState<string>('');
  const [team, setTeam] = useState<TeamType>(TeamType.RED);

  useEffect(() => {
    console.log(`gameID updated, is now ${gameID}`);
    const doAsync = async () => {
      if (!stratego.instance) return;
      console.log(currentAddress);

      console.log("Stratego is deployed at ", stratego.instance.address);
      
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
  }, [stratego, gameID, currentAddress]); 

  const startNewGame = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!stratego.instance) throw Error("Stratego instance not ready");
    const tx = await stratego.instance.createGame();
    console.log("createGame tx", tx);      
      // set it to the value the blockchain returns
  };
  
  const joinGame = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stratego.instance) throw Error("Stratego instance not ready");
    setGameID(IDstore);
    const tx = await stratego.instance.join(Number(IDstore));
    console.log("createGame tx", tx);      
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
  
  const endGame = (team : TeamType) => {
    setWinner(team);
  }

  return (
    winner !== null ? <div className="entry-block">
            <p className= "title ">Game Over!</p>
            <p className = "title">{winner === TeamType.RED ? "Red" : "Blue"} wins!</p>
          </div> : 
          newGame ? 
              <Game
                gameID = {gameID}
                startNewGame={newGame}
                onGameOver={(team : TeamType) => endGame(team)}
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
                </div>
  )
}

  