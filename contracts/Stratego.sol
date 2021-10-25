// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;
// import * as hre from "hardhat";
import "hardhat/console.sol";


contract Stratego {

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
      uint8 attackerVal;
      uint8 attackedVal;
      uint8 attackerLoc;
      uint8 attackedLoc;
      uint redBoard;
      uint blueBoard;
      uint gameID;
      bool exists;      
    }
    
    mapping(uint => Game) games;
    
    event currPhase (uint gameID, Phase curr);
    event gameState(address red, address blue, string boardString);
    event piecesPlaced(uint gameID, address sender, uint64 board);
    event pieceClaimed(uint gameID, address sender, uint8 pieceVal);

    event battleSquares(uint gameID, uint attackerLoc, uint attackedLoc);
    event battleResolved(uint gameID, address winner);
    event logBoard(string boardString);
    event GameIDs(address from, uint gameID);
    event GameoverLog(uint gameID, bool winner);
    
    function createGame() external{
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
      game.attackerLoc = 101;
      game.attackedLoc = 101;
      game.attackerVal = 0;
      game.attackedVal = 0;
      n_games++;
     

      emit GameIDs(msg.sender, gameID);
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
      emit gameState(game.red, game.blue, printBoard(gameID));
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
      emit piecesPlaced(gameID, msg.sender, board);
      
      if(game.blueBoard != 0 && game.redBoard != 0){
        game.currPhase = Phase.Gameplay;
      }
      emit currPhase(gameID, game.currPhase);

    }
    function createBoard(uint gameID) public returns (Tile[BOARDSIZE] memory) {
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

    function coord2Idx(uint x, uint y) public pure returns (uint8) {
      return uint8(10 * x + y);
    }
    
    function Idx2Coord(uint Idx) public pure returns(uint, uint) {
      return(100 / Idx, 100 % Idx);
    }
    
    function coord2Piece(uint gameID, uint x, uint y) public view returns (Tile){
      Game storage game = games[gameID];

      return game.board[coord2Idx(x,y)];
    }

    function piece2Str(Tile piece) public pure returns (string memory) {
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
      bool attacked = !game.turn;
      bool attacker = game.turn;
      if (game.attackedVal == 10 && game.attackerVal != 8){
        return attacked;
      }
      if (game.attackerVal == 9 && game.attackedVal == 1) {
        return attacker;
      }
      return game.attackerVal < game.attackedVal ? attacker : attacked;
    }
    
    function resolveBattle(Game storage game) private {
      game.board[game.attackerLoc] = Tile.Empty;
      
      if(game.attackedVal == 11) {
        game.currPhase = Phase.Gameover;
        emit GameoverLog(game.gameID, game.turn);
        return;
      }
      if(game.attackedVal == game.attackerVal){
        console.log("equal");
        game.board[game.attackedLoc] = Tile.Empty;
        emit battleResolved(game.gameID, address(0));
        game.turn = !game.turn;
        game.attackerVal = 0;
        game.attackedVal = 0;
        game.attackerLoc = 101;
        game.attackedLoc = 101;
        return;
      }
      // one winner
      bool winner = fight(game);
      address winnerAddress = winner ? game.blue : game.red;
      if(winner == game.turn){
        game.board[game.attackedLoc] = game.turn ? Tile.Blue : Tile.Red;
      } 
      
      game.turn = !game.turn;
      game.attackerVal = 0;
      game.attackedVal = 0;
      game.attackerLoc = 101;
      game.attackedLoc = 101;
      emit battleResolved(game.gameID, winnerAddress );
    }
    function battle(uint gameID, uint8 pieceVal) external {
      Game storage game = games[gameID];
      require(game.exists, "game doesn't exist");
      require(game.currPhase == Phase.Battle, "not battling");
      require(pieceVal < 12, "invalid piece value");
      require(msg.sender == game.red || msg.sender == game.blue, "not playing");
      bool player = !(msg.sender == game.red);
      
      if(player == game.turn){
        require(game.attackerVal == 0, "already received piece");
        require(pieceVal < 10, "cannot move that piece");
        game.attackerVal = pieceVal;
      } else {
        require(game.attackedVal == 0, "already received piece");
        game.attackedVal = pieceVal;
      }
      
      emit pieceClaimed(gameID, msg.sender, pieceVal);

      if(game.attackerVal != 0 && game.attackedVal != 0){
        resolveBattle(game);
      }
      emit pieceClaimed(gameID, msg.sender, pieceVal);
    }
    function diff(uint x1, uint x2) private pure returns (uint) {
      return x1 > x2 ? x1 - x2 : x2 - x1;
    }
    
    function completeMove(Game storage game,
                          Tile oldTile,
                          Tile newTile,
                          uint8 oldIdx,
                          uint8 newIdx,
                          Tile moverTile,
                          bool currTurn
                          ) 
                            private {
      require(currTurn == game.turn, "not your turn");
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
      } else {
        // battle
        game.currPhase = Phase.Battle;
        game.attackerLoc = oldIdx;
        game.attackedLoc = newIdx;
        emit battleSquares(game.gameID, oldIdx, newIdx);
      }      
    }
    
    function movePiece(uint gameID,
                       uint oldX,
                       uint oldY,
                       uint newX,
                       uint newY) 
                         external {
      Game storage game = games[gameID];
      require(game.exists, "game doesn't exist");
      require(oldX < 10 && oldY < 10 && newX < 10 && newY < 10, "coords not in range");
      require(game.currPhase == Phase.Gameplay, "cannot move during this game phase");
      require(msg.sender == game.blue || msg.sender == game.red, "not playing");
     
      
      uint8 oldIdx = coord2Idx(oldX, oldY);
      uint8 newIdx = coord2Idx(newX, newY);
      Tile oldTile = coord2Piece(gameID, oldX, oldY);
      Tile newTile = coord2Piece(gameID, newX, newY);

      if(msg.sender == game.red){
        completeMove(game, oldTile, newTile, oldIdx, newIdx, Tile.Red, false);
      } else {
        completeMove(game, oldTile, newTile, oldIdx, newIdx, Tile.Blue, true);
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

