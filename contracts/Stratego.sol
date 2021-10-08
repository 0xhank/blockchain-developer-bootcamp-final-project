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
      bool exists;
      address winner;
    }
    
    mapping(uint => Game) games;
    event boardState(TileType[BOARDSIZE] board);
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
      n_games++;
      console.log("Address, GameID is %s , %s", msg.sender, gameID);
      

      emit GameIDs(msg.sender, gameID);
    }
    
    function join(uint gameID) external {
      Game storage game = games[gameID];
      require(game.exists && game.currPhase == Phase.Awaiting);
      require(game.red != msg.sender);
      game.blue = msg.sender;
      game.currPhase = Phase.Placement;
      n_activegames ++;
      game.board = createBoard(gameID);
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
      emit boardState(game.board);
      return game.board;
    }

    function coord2Idx(uint x, uint y) public pure returns (uint) {
      return 10 * x + y;
    }
    
    function coord2Piece(uint x, uint y,uint gameID) public view returns (TileType){
      Game storage game = games[gameID];

      return game.board[coord2Idx(x,y)];
    }
    
    function piece2Str(TileType piece) public pure returns (string memory) {
      if(piece == TileType.Empty) return "E";
      if (piece == TileType.Blocked) return "X";
      if (piece == TileType.RedPiece) return "R";
      return "B";
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
       
    function battle(uint newX, uint newY) public{
      
    }
    function diff(uint x1, uint x2) private pure returns (uint) {
      return x1 > x2 ? x1 - x2 : x2 - x1;
    }
    
      /**
      Steps:
        1. Verify:
          1. It's the correct person's move
          2. The original square has a piece of the correct color
          3. The new square is not blocked
          4. The move is one square in a cardinal direction
        2. If it's a battle, battle
        3. If it's an empty square, update accordingly
    */
    
    function movePiece(uint origX, uint origY, uint newX, uint newY, uint gameID) public {
      Game storage game = games[gameID];
      
      TileType origTile = game.board[coord2Idx(origX, origY)];
      TileType newTile =  game.board[coord2Idx(newX, newY)];
            
      uint diffX = diff(origX, newX);
      uint diffY = diff(origY, newY);
      require((diffX == 0 && diffY == 1) || (diffX == 1 && diffY == 0));
      
      
      if(game.turn == Team.Red){
        require(msg.sender == game.red  && origTile == TileType.RedPiece);
        require(newTile == TileType.BluePiece || newTile == TileType.Empty);

        if(newTile == TileType.BluePiece){
          battle(newX, newY);
          game.turn = Team.Blue;
          return;
        }
        
        game.board[coord2Idx(newX, newY)] = TileType.RedPiece;
        game.turn = Team.Blue;
        return;
      } 
      
      require(msg.sender == game.blue && origTile == TileType.BluePiece);
      require(newTile == TileType.RedPiece || newTile == TileType.Empty);

       if(newTile == TileType.RedPiece){
            battle(newX, newY);
            game.turn = Team.Red;
            return;
      }
          
          game.board[coord2Idx(newX, newY)] = TileType.BluePiece;
          game.turn = Team.Red;
          return;
    } 
}