//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Blockchain Stratego
/// @author Henry Caron
/// @dev All function calls are currently implemented without side effects
contract Stratego is AccessControl {
    uint16 constant BOARDSIZE = 100;
    uint64 constant g = 69;
    uint64 constant p = 999983;
    
    uint64 n_games = 0;
    uint64 n_activegames = 0;
    uint64 last_id = 1;
    
    /// @dev The possible tile types 
    enum Tile {
      Red,
      Blue,
      Empty,
      Blocked
    }
    
    /// @dev The possible game phases 
    enum Phase {
      Awaiting,
      Placement,
      Gameplay,
      Battle,
      Gameover
    }
    
    /// @dev stores all information for a game
    struct Game {
      address red;
      address blue;
      Phase currPhase;
      Tile[BOARDSIZE] board;
      uint gameID;
      string redBoard;
      string blueBoard;
      uint8 attVal;
      uint8 defVal;
      uint8 attLoc;
      uint8 defLoc;
      bool exists;
      bool turn; // false means red, true means blue
      bytes32 PLAYER_ROLE;

    }
    
    /// @dev contains all games that have been created
    mapping(uint => Game) games;
    
/***********************************Events ********************************** */

    event GameIDs(address from, uint gameID);
    event beginGame(uint gameID, address red, address blue);
    event piecesPlaced(uint gameID, string redBoard, string blueBoard);

    event pieceClaimed(uint gameID, address sender, uint8 pieceVal);
    event makeMove(uint gameID, uint oldCoord, uint newCoord, string hashboard);

    event battleSquares(uint gameID, uint oldCoord, uint newCoord, string hashboard);
    event battleResolved(uint gameID, uint attLoc, uint attVal, uint defLoc, uint defVal);
    event GameoverLog(uint gameID, bool winner);
    event verifyData(uint gameID, address sender, string data);
    
/******************************* Modifiers ********************************** */
   /// @notice Ensures game exists and game phase is correct
    /// @param gameID the game number
    /// @param phase phase the game should be in
    modifier rightPhase(uint gameID, Phase phase) {
      require(games[gameID].exists, "game doesn't exist");
      require(games[gameID].currPhase == phase, "game in wrong phase");
      _;
    }

/********************************Game Setup********************************** */
    /// @notice Creates game and sets creator as red player
    /// @dev The Alexandr N. Tetearing algorithm could increase precision
    /// @return gameID ID of game to share with other player
    function createGame() external returns (uint64){
      uint64 gameID = (last_id * g) % p;
      while (games[gameID].exists){
        gameID = (gameID + 1) % p;
      }
      last_id = gameID; 
      
      Game storage game = games[gameID];
      
      game.PLAYER_ROLE = keccak256(abi.encode(gameID));

      game.red = msg.sender;
      game.turn = false;
      game.exists = true;
      game.redBoard = '';
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
    
    /// @notice Allows player to join created game then begins game
    /// @param gameID The game number 
    function join(uint gameID) external rightPhase(gameID, Phase.Awaiting) {
      Game storage game = games[gameID];
      require(game.red != msg.sender, "player already in game");
      game.blue = msg.sender;
      game.currPhase = Phase.Placement;
      game.blueBoard = '';
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _setupRole(game.PLAYER_ROLE, msg.sender);
      grantRole(game.PLAYER_ROLE, game.red);


      n_activegames ++;
      game.board = createBoard(gameID);
      emit beginGame(gameID, game.red, game.blue);
    }
    
    /// @notice Records piece placements of particular game then starts game
    /// @param gameID the game number
    /// @param board board information to be saved by game
    function place(uint gameID, string memory board) external rightPhase(gameID, Phase.Placement) {
      Game storage game = games[gameID];
      require(hasRole(game.PLAYER_ROLE, msg.sender));
      if(msg.sender == game.red){
        require(bytes(game.redBoard).length == 0, "Red pieces already set");
        game.redBoard = board;
      } else {
        require(bytes(game.blueBoard).length == 0, "Blue pieces already set");
        game.blueBoard = board;
      }
      if(bytes(game.redBoard).length != 0 && bytes(game.blueBoard).length != 0){
        game.currPhase = Phase.Gameplay;
        emit piecesPlaced(gameID, game.redBoard, game.blueBoard);

      }
    }
    /// @notice generates starting board state
    /// @param gameID the game number
    /// @return board board information to be saved by game
    function createBoard(uint gameID) private returns (Tile[BOARDSIZE] memory)  {
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
      return game.board;
    }
/******************************** Movement ********************************** */

    /// @notice Moves piece in a game of given coords
    /// @param gameID the game number
    /// @param oldCoord previous piece location
    /// @param newCoord new piece location
    /// @param hashboard hash of board for verification
    function movePiece(uint gameID, uint8 oldCoord, uint8 newCoord, string memory hashboard) 
                         external 
                         rightPhase(gameID, Phase.Gameplay)
                         {
      Game storage game = games[gameID];
      require(oldCoord < 100 && newCoord < 100, "coords not in range");
      require(hasRole(game.PLAYER_ROLE, msg.sender));
      
      bool currTurn = false;
      Tile moverTile = Tile.Red;
      if(msg.sender == game.blue){
        currTurn = true;
        moverTile = Tile.Blue;
      }
      
      require(currTurn == game.turn, "not your turn");
      
      Tile oldTile = game.board[oldCoord];
      Tile newTile = game.board[newCoord];
      require(oldTile == moverTile, "cannot move that piece");
      require(newTile != moverTile && newTile != Tile.Blocked, "cannot move there"); 

      uint diffX = diff(oldCoord / 10, newCoord / 10);
      uint diffY = diff(oldCoord % 10, newCoord % 10);
      require((diffX == 0 && diffY == 1) || (diffX == 1 && diffY == 0), "cannot jump squares");
          
      // no battle
      if(newTile == Tile.Empty){
        game.board[oldCoord] = Tile.Empty;
        game.board[newCoord] = moverTile;
        game.turn = !currTurn;
        emit makeMove(game.gameID, oldCoord, newCoord, hashboard);

      } else {
        // battle
        game.currPhase = Phase.Battle;
        game.attLoc = oldCoord;
        game.defLoc = newCoord;
        emit battleSquares(game.gameID, oldCoord, newCoord, hashboard);
      }      
    } 
      
/********************************** Battle ********************************** */

    function battle(uint gameID, uint8 pieceVal) external rightPhase(gameID, Phase.Battle) {
      Game storage game = games[gameID];
      require(pieceVal < 12, "invalid piece value");
      require(hasRole(game.PLAYER_ROLE, msg.sender));
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
        game.board[game.attLoc] = Tile.Empty;
      
        if(game.defVal == 11) {
          game.currPhase = Phase.Gameover;
          emit GameoverLog(game.gameID, game.turn);
          return;
        }
        if(game.defVal == game.attVal){
          game.board[game.defLoc] = Tile.Empty;
          emit battleResolved(game.gameID, game.attLoc, 0, game.defLoc, 0);
        } else {
          // one winner
          bool winner = false;
  
          if (game.defVal == 10 && game.attVal != 8) winner = !game.turn;
          else if (game.attVal == 9 && game.defVal == 1) winner = game.turn;
          else winner = game.attVal < game.defVal ? game.turn : !game.turn;
          
          if(winner == game.turn){
            game.board[game.defLoc] = game.turn ? Tile.Blue : Tile.Red;
            emit battleResolved(game.gameID, game.defLoc, game.attVal, game.attLoc, 0);
          } else {
            emit battleResolved(game.gameID, game.attLoc, 0, game.defLoc, game.defVal);
          }
        }
        game.turn = !game.turn;
        game.attVal = 0;
        game.defVal = 0;
        game.attLoc = 101;
        game.defLoc = 101;
        game.currPhase = Phase.Gameplay;
      }
    }

    
/********************************* Utility ********************************** */
    /// @notice Calculates difference between two uints
    /// @param x1 first uint to compare
    /// @param x2 second uint to compare
    function diff(uint x1, uint x2) private pure returns (uint) {
      return x1 > x2 ? x1 - x2 : x2 - x1;
    }    
    
/***************************** Verification ********************************* */
    
    /// @notice Alerts users to verification call
    /// @param gameID the game number
    /// @param data sequence of game states
    function verify (uint gameID, string memory data) external rightPhase(gameID, Phase.Gameover){
      emit verifyData(gameID, msg.sender, data);
    }
    
}
