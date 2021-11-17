//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";

contract Greeter {
    uint16 constant BOARDSIZE = 100;
    uint64 constant g = 69;
    uint64 constant p = 999983;
    
    uint64 n_games = 0;
    uint64 n_activegames = 0;
    uint64 last_id = 1;
    
    enum Tile {
      Red,
      Blue,
      Empty,
      Blocked
    }
    
    enum Phase {
      Awaiting,
      Placement,
      Gameplay,
      Battle,
      Gameover
    }
    
    struct Game {
      address red;
      address blue;
      Phase currPhase;
      Tile[BOARDSIZE] board;
      bool turn; // false means red, true means blue
      uint8 attVal;
      uint8 defVal;
      uint8 attLoc;
      uint8 defLoc;
      uint redBoard;
      uint blueBoard;
      uint gameID;
      bool exists;      
    }
    
    mapping(uint => Game) games;
    
    event currPhase (uint gameID, Phase curr);
    event beginGame(uint gameID, address red, address blue);
    event piecesPlaced(uint gameID, uint blueBoard, uint redBoard);
    event pieceClaimed(uint gameID, address sender, uint8 pieceVal);
    event makeMove(uint gameID, uint oldIdx, uint newIdx, string hashed);

    event battleSquares(uint gameID, uint oldIdx, uint newIdx, string hashed);
    event battleResolved(uint gameID, uint attLoc, uint attVal, uint defLoc, uint defVal);
    event logBoard(string boardString);
    event GameIDs(address from, uint gameID);
    event GameoverLog(uint gameID, bool winner);
    
    function createGame() external returns (uint64){
      uint64 gameID = (last_id * g) % p;
      while (games[gameID].exists){
        gameID = (gameID + 1) % p;
      }
      last_id = gameID; 
      
      Game storage game = games[gameID];
      
      game.red = msg.sender;
      game.turn = false;
      game.exists = true;
      game.redBoard = 0;
      game.gameID = gameID;
      game.attLoc = 101;
      game.defLoc = 101;
      game.attVal = 0;
      game.defVal = 0;
      game.currPhase = Phase.Awaiting;
      n_games++;
     

      emit GameIDs(msg.sender, gameID);
      return gameID;
    }
    
    function join(uint gameID) external {
      Game storage game = games[gameID];
      require(game.exists && game.currPhase == Phase.Awaiting, "game not in waiting state");
      require(game.red != msg.sender, "player already in game");
      game.blue = msg.sender;
      game.currPhase = Phase.Placement;
      game.blueBoard = 0;

      n_activegames ++;
      game.board = createBoard(gameID);
      // emit gameState(game.board);
      emit beginGame(gameID, game.red, game.blue);
    }
    
    function place(uint gameID, uint64 board) external {
      Game storage game = games[gameID];
      require(game.exists, "game doesn't exist");

      require(game.currPhase == Phase.Placement, "game in wrong phase");
      require(msg.sender == game.red || msg.sender == game.blue, "not playing");
      if(msg.sender == game.red){
        require(game.redBoard == 0, "Red pieces already set");
        game.redBoard = board;
      }
      if(msg.sender == game.blue){
        require(game.blueBoard == 0, "Blue pieces already set");
        game.blueBoard = board;
      }
      
      if(game.blueBoard != 0 && game.redBoard != 0){
        game.currPhase = Phase.Gameplay;
        emit piecesPlaced(gameID, game.redBoard, game.blueBoard);

      }
    }
    
    function createBoard(uint gameID) private returns (Tile[BOARDSIZE] memory) {
      Game storage game = games[gameID];

      for (uint16 i = 0; i < 40; i++ ){
        game.board[i] = Tile.Red;
        game.board[BOARDSIZE-i-1] = Tile.Blue;
      }
      for (uint16 j = 40; j < 60; j++){
        game.board[j] = Tile.Empty;
      }
      
      game.board[42] = Tile.Blocked;
      game.board[43]= Tile.Blocked;
      game.board[52]= Tile.Blocked;
      game.board[53]= Tile.Blocked;
      
      game.board[46]= Tile.Blocked;
      game.board[47]= Tile.Blocked;
      game.board[56]= Tile.Blocked;
      game.board[57]= Tile.Blocked;
      emit logBoard(printBoard(game.gameID));
      return game.board;
    }

    function coord2Idx(uint x, uint y) private pure returns (uint8) {
      return uint8(10 * x + y);
    }
    
    function Idx2Coord(uint Idx) private pure returns(uint, uint) {
      return(100 / Idx, 100 % Idx);
    }
    
    function coord2Piece(uint gameID, uint a) private view returns (Tile){
      Game storage game = games[gameID];

      return game.board[a];
    }

    function piece2Str(Tile piece) private pure returns (string memory) {
      if(piece == Tile.Empty) return "E";
      if (piece == Tile.Blocked) return "X";
      if (piece == Tile.Red) return "R";
      return "B";
    }
    /*
      PIECE Values
      0: Empty
      1: 1 (Marshal)
      2: 2 (General)
      3: 3 (Colonel)
      4: 4 (Major)
      5: 5 (captain)
      6: 6 (Lieutenant)
      7: 7 (Sargeant)
      8: 8 (Miner)
      9: 9 (Spy)
      10: bomb
      11: flag
    */
    function fight(Game storage game) private view returns (bool) {
      bool def = !game.turn;
      bool att = game.turn;
      if (game.defVal == 10 && game.attVal != 8){
        return def;
      }
      if (game.attVal == 9 && game.defVal == 1) {
        return att;
      }
      return game.attVal < game.defVal ? att : def;
    }
    
    function resolveBattle(Game storage game) private {
      game.board[game.attLoc] = Tile.Empty;
      
      if(game.defVal == 11) {
        game.currPhase = Phase.Gameover;
        emit GameoverLog(game.gameID, game.turn);
        return;
      }
      if(game.defVal == game.attVal){
        console.log("equal");
        game.board[game.defLoc] = Tile.Empty;
        emit battleResolved(game.gameID, game.attLoc, 0, game.defLoc, 0);
        game.turn = !game.turn;
        game.attVal = 0;
        game.defVal = 0;
        game.attLoc = 101;
        game.defLoc = 101;
        game.currPhase = Phase.Gameplay;
        return;
      }
      // one winner
      bool winner = fight(game);
      address winnerAddress = winner ? game.blue : game.red;
      if(winner == game.turn){
        game.board[game.defLoc] = game.turn ? Tile.Blue : Tile.Red;
        emit battleResolved(game.gameID, game.attLoc, game.attVal, game.defLoc, 0);
      } else {
        emit battleResolved(game.gameID, game.attLoc, 0, game.defLoc, game.defVal);
      }
      game.turn = !game.turn;
      game.attVal = 0;
      game.defVal = 0;
      game.attLoc = 101;
      game.defLoc = 101;
      game.currPhase = Phase.Gameplay;

    }
    
    function battle(uint gameID, uint8 pieceVal) external {
      Game storage game = games[gameID];
      require(game.exists, "game doesn't exist");
      require(game.currPhase == Phase.Battle, "not battling");
      require(pieceVal < 12, "invalid piece value");
      require(msg.sender == game.red || msg.sender == game.blue, "not playing");
      bool player = !(msg.sender == game.red);
      
      if(player == game.turn){
        require(game.attVal == 0, "already received piece");
        require(pieceVal < 10, "cannot move that piece");
        game.attVal = pieceVal;
      } else {
        require(game.defVal == 0, "already received piece");
        game.defVal = pieceVal;
      }
      
      emit pieceClaimed(gameID, msg.sender, pieceVal);

      if(game.attVal != 0 && game.defVal != 0){
        resolveBattle(game);
      }
    }
    
    function diff(uint x1, uint x2) private pure returns (uint) {
      return x1 > x2 ? x1 - x2 : x2 - x1;
    }
    
    function completeMove(Game storage game,
                          uint8 oldIdx,
                          uint8 newIdx,
                          Tile moverTile,
                          bool currTurn,
                          string memory hashed
                          ) 
                            private {
      require(currTurn == game.turn, "not your turn");
      
      Tile oldTile = coord2Piece(game.gameID, oldIdx);
      Tile newTile = coord2Piece(game.gameID, newIdx);
      require(oldTile == moverTile, "cannot move that piece");
      require(newTile != moverTile && newTile != Tile.Blocked, "cannot move there"); 

      uint diffX = diff(oldIdx / 10, newIdx / 10);
      uint diffY = diff(oldIdx % 10, newIdx % 10);
      require((diffX == 0 && diffY == 1) || (diffX == 1 && diffY == 0), "cannot jump squares");
          
      // no battle
      if(newTile == Tile.Empty){
        game.board[oldIdx] = Tile.Empty;
        game.board[newIdx] = moverTile;
        game.turn = !currTurn;
        emit makeMove(game.gameID, oldIdx, newIdx, hashed);

      } else {
        // battle
        game.currPhase = Phase.Battle;
        game.attLoc = oldIdx;
        game.defLoc = newIdx;
        emit battleSquares(game.gameID, oldIdx, newIdx, hashed);
      }      
    }
    
    function movePiece(uint gameID,
                       uint8 oldCoord,
                       uint8 newCoord,
                       string memory hashed) 
                         external {
      Game storage game = games[gameID];
      console.log("oldCoord: %d, newCoord: %d", oldCoord, newCoord);
      require(game.exists, "game doesn't exist");
      require(oldCoord < 100 && newCoord < 100, "coords not in range");
      require(game.currPhase == Phase.Gameplay, "cannot move during this game phase");
      require(msg.sender == game.blue || msg.sender == game.red, "not playing");

      if(msg.sender == game.red){
        completeMove(game, oldCoord, newCoord, Tile.Red, false, hashed);
      } else {
        completeMove(game, oldCoord, newCoord, Tile.Blue, true, hashed);
      }
    } 
    
    function printBoard(uint gameID) public view returns (string memory){
      Game storage game = games[gameID];
       
      string memory newString = new string(BOARDSIZE);
      bytes memory byteString = bytes(newString);
      
      for(uint i = 0; i < BOARDSIZE; i++){
        if(game.board[i] == Tile.Blocked) {
          byteString[i] = "X";
          continue;
        }
        if(game.board[i] == Tile.Red) {
          byteString[i] = "R";
          continue;
        }
        if(game.board[i] == Tile.Blue) {
          byteString[i] = "B";
          continue;
        }
        byteString[i] = "E";
      }     
      return string(byteString);
    }
    
    function printPhase(uint gameID) public view returns (string memory) {
      Game storage game = games[gameID];
 
      if(game.currPhase == Phase.Awaiting) return "Awaiting";
      if(game.currPhase == Phase.Placement) return "Placement";
      if(game.currPhase == Phase.Gameplay) return "Gameplay";
      if(game.currPhase == Phase.Battle) return "Battle";
      return "Gameover";

    }
}
