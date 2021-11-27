# Design Pattern Decisions

## Inheritance and Interfaces
This contract inherits from the Open Zeppelin Access Control contract. It defines player addresses as roles in Access Control and ensures that only players can access functions in their game.

## Access Control Design Patterns
In addition to Open Zeppelin's Access Control contract, my contract blocks certain functions if it's the incorrect phase. This ensures players cannot improperly alter the game state. 