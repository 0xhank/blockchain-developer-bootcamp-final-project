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
    
    enum Team {
      Red,
      Blue
    }
    
    enum TileType {
      RedPiece,
      BluePiece,
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
      TileType[BOARDSIZE] board;
      Team turn;
      uint8 attackerVal;
      uint8 attackedVal;
      uint redBoard;
      uint blueBoard;
      uint gameID;
      bool exists;
      
      
    }
    
    mapping(uint => Game) games;
    
    event currPhase (uint gameID, Phase curr);
    
    event gameState(address red, address blue, string boardString);
    event piecesPlaced(uint gameID, address sender, uint64 board);
    event battleLog(uint gameID, uint attackerLoc, uint attackedLoc);
    event logBoard(string boardString);
    event GameIDs(address from, uint gameID);
    
    function createGame() external{
      uint64 gameID = (last_id * g) % p;
      while (games[gameID].exists){
        gameID = (gameID + 1) % p;
      }
      last_id = gameID;
      
      Game storage game = games[gameID];
      
      game.red = msg.sender;
      game.turn = Team.Red;
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
    function createBoard(uint gameID) public returns (TileType[BOARDSIZE] memory) {
      Game storage game = games[gameID];

      for (uint16 i = 0; i < 40; i++ ){
        game.board[i] = TileType.RedPiece;
        game.board[BOARDSIZE-i-1] = TileType.BluePiece;
      }
      for (uint16 j = 40; j < 60; j++){
        game.board[j] = TileType.Empty;
      }
      
      game.board[42] = TileType.Blocked;
      game.board[43]= TileType.Blocked;
      game.board[52]= TileType.Blocked;
      game.board[53]= TileType.Blocked;
      
      game.board[46]= TileType.Blocked;
      game.board[47]= TileType.Blocked;
      game.board[56]= TileType.Blocked;
      game.board[57]= TileType.Blocked;
      emit logBoard(printBoard(game.gameID));
      return game.board;
    }

    function coord2Idx(uint x, uint y) public pure returns (uint8) {
      return uint8(10 * x + y);
    }
    
    function Idx2Coord(uint Idx) public pure returns(uint, uint) {
      return(100 / Idx, 100 % Idx);
    }
    
    function coord2Piece(uint gameID, uint x, uint y) public view returns (TileType){
      Game storage game = games[gameID];

      return game.board[coord2Idx(x,y)];
    }

    function piece2Str(TileType piece) public pure returns (string memory) {
      if(piece == TileType.Empty) return "E";
      if (piece == TileType.Blocked) return "X";
      if (piece == TileType.RedPiece) return "R";
      return "B";
    }
       
    function battle(uint gameID, uint pieceVal) external {
      Game storage game = games[gameID];
      require(game.exists, "game doesn't exist");
      require(game.currPhase == Phase.Battle, "not battling");
      Team player = msg.sender == game.red ? Team.Red : Team.Blue;
      if(player == game.turn){
        require(game.attacked)
      }
      
    }
    function diff(uint x1, uint x2) private pure returns (uint) {
      return x1 > x2 ? x1 - x2 : x2 - x1;
    }
    
    function completeMove(Game storage game,
                          TileType oldTile,
                          TileType newTile,
                          uint8 oldIdx,
                          uint8 newIdx,
                          TileType moverTile,
                          Team currTurn
                          ) 
                            private {
      require(currTurn == game.turn, "not your turn");
      require(oldTile == moverTile, "cannot move that piece");
      require(newTile != moverTile && newTile != TileType.Blocked, "cannot move there"); 
      
      uint diffX = diff(oldIdx / 10, newIdx / 10);
      console.log("oldIdx: %s, newIdx: %s", oldIdx, newIdx);
      uint diffY = diff(oldIdx % 10, newIdx % 10);
      require((diffX == 0 && diffY == 1) || (diffX == 1 && diffY == 0), "cannot jump squares");
      // no battle
      if(newTile == TileType.Empty){
        game.board[oldIdx] = TileType.Empty;
        game.board[newIdx] = moverTile;
        game.turn = currTurn == Team.Red ? Team.Blue : Team.Red;
      } else {
        // battle
        game.currPhase == Phase.Battle;
        emit battleLog(game.gameID, oldIdx, newIdx);
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
      TileType oldTile = coord2Piece(gameID, oldX, oldY);
      TileType newTile =  coord2Piece(gameID, newX, newY);

      if(msg.sender == game.red){
        completeMove(game, oldTile, newTile, oldIdx, newIdx, TileType.RedPiece, Team.Red);
      } else {
        completeMove(game, oldTile, newTile, oldIdx, newIdx, TileType.BluePiece, Team.Blue);
      }
    } 
    
    function printBoard(uint gameID) public view returns (string memory){
      Game storage game = games[gameID];
       
      string memory newString = new string(BOARDSIZE);
      bytes memory byteString = bytes(newString);
      
      for(uint i = 0; i < BOARDSIZE; i++){
        if(game.board[i] == TileType.Blocked) {
          byteString[i] = "X";
          continue;
        }
        if(game.board[i] == TileType.RedPiece) {
          byteString[i] = "R";
          continue;
        }
        if(game.board[i] == TileType.BluePiece) {
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

