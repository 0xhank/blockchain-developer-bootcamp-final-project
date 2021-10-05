// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;
// import * as hre from "hardhat";
import "hardhat/console.sol";


contract Game {

    enum TileType {
      Piece,
      Empty,
      Blocked
    }
    
    TileType[100] public board;


    event boardState(TileType[100] board);
    event logBoard(string boardString);
    function createBoard() public returns (TileType[100] memory) {
      for (uint16 i = 0; i < 40; i++ ){
        board[i] = TileType.Piece;
        board[100-i-1] = TileType.Piece;
      }
      for (uint16 j = 40; j < 60; j++){
        board[j] = TileType.Empty;
      }
      
      board[42] = TileType.Blocked;
      board[43]= TileType.Blocked;
      board[52]= TileType.Blocked;
      board[53]= TileType.Blocked;
      
      board[42]= TileType.Blocked;
      board[43]= TileType.Blocked;
      board[52]= TileType.Blocked;
      board[53]= TileType.Blocked;
      // console.log("%s",board);
      emit boardState(board);
      return board;
    }

    function coord2Idx(uint x, uint y) public pure returns (uint) {
      return 10 * x + y;
    }
    
    function coord2Piece(uint x, uint y) public view returns (TileType){
      return board[coord2Idx(x,y)];
    }
    
    function piece2Str(TileType piece) public pure returns (string memory) {
      if(piece == TileType.Empty) return "E";
      if (piece == TileType.Blocked) return "B";
      return "P";
    }
    function printBoard() public returns (string memory){
      string memory boardString = new string(100);
      bytes memory byteString = bytes(boardString);

      for(uint16 i = 0; i < board.length; i++) {
        if(board[i] == TileType.Blocked) {
          byteString[i] = "B";
          continue;
        }
        if(board[i] == TileType.Piece) {
          byteString[i] = "P";
          continue;
        }
        byteString[i] = "E";
        boardString = string(byteString);
        console.log("boardState is: %s", boardString);

        emit logBoard(boardString);
        return boardString;
      }
    }
}