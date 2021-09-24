// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Deck {
  uint constant LENGTH = 10;
  uint8[LENGTH] public deck;
  
      // address public owner = msg.sender;

  
  event printDeck(uint8[LENGTH] deck);
  
  
  constructor() public {
    reset();
  }
  
  function reset() public returns (uint8[LENGTH] memory ){
    for(uint8 i = 0; i < LENGTH; i++) {
      deck[i] = i;
    }
    print();
    return deck;
  }
  function getRandomNumber() private returns (uint) {
       return block.timestamp;
   }

   function shuffle() public {
      uint8[LENGTH] memory unshuffled;

      for (uint8 i=0; i < LENGTH; i++) {
          unshuffled[i] = i;
      }

      uint cardIndex;

      for (uint8 i=0; i < LENGTH; i++) {
          cardIndex = getRandomNumber() % (LENGTH - i);
          deck[i] = unshuffled[cardIndex];
          unshuffled[cardIndex] = unshuffled[LENGTH - i - 1];
      }
      print();
   }
   function print() public returns (uint8[LENGTH] memory){
   
   for(uint8 i=0; i < LENGTH; i++){
   }
    emit printDeck(deck);
    return deck;
   }
}