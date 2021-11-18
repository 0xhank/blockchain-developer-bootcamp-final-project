# Consensys Blockchain Bootcamp Final Project: Zero Knowledge Stratego

## How to install and run

1. Clone the repository
2. npm install the main folder
3. Spin up a local blockchain using npm run node
4. In the browser create a new account in Metamask with the mnemonic "test test test test test test test test test test test junk" and choose "Localhost 8545" as the network
5. In a new terminal, open /frontend
6. npm install in /frontend
7. npm start to create a react server on Localhost 3000. You should see the game connect to Metamask and enter the Create/Join screen.

(To test, I typically have two browsers open simultaneously connected to different Metamask accounts that can play vs each other.)

## Concept Description

    I want to build a stratego game that is hosted on the blockchain. Players create and join games through Metamask. Rounds occur in real time, and one player cannot view the pieces of the opposing player. When a move occurs, a player must verify that their move is acceptable without revealing what their piece is; in order for this to work, I will use zero-knowledge proofs. I've drawn inspiration for my implementation from Dark Forest, an open-source, real-time incomplete information blockchain game that overcame many of the same challenges this game faces.

## Stratego's Core Characteristics

    Stratego is a classic board game that has simple rules and some unique characteristics. It is incomplete information, meaning any one player doesn't have access to the full game state during play. A successful player must understand game theory and risk versus reward calculations, as well as a good memory to keep track of which pieces are in which locations. It is a compelling, short-form board game of capture the flag.

## Key Technical Challenges

### 1. Zero Knowledge Proofs

    In stratego, there is always information unavailable to any given player, such as the value of opposing pieces. However, the blockchain's state is available to all other users. Therefore, it will be necessary for my project to incorporate zero knowledge proofs to keep certain elements of the game state hidden from users. Zero knowledge proofs are described as "cryptographic methods that allow someone (the verifier) to validate a claim done by a second party (the prover), without requiring the prover to reveal any underlying information about the claim." By this method, elements of the state can be validated without needing to reveal any actual information.

### 3. Real-time execution

    An essential aspect of stratego is it occurs in real time. Since every play is stored on the blockchain, it is essential that each transaction is completed in 1-3 seconds and is gasless. This means the game itself must be hosted on a blockchain other than Ethereum, such as Polygon, Loom, or xDai. Perhaps it's possible to begin the game in Ethereum and host in-game transactions in another blockchain.

### 4. Multiple "boards" capability

    A room is a private space on the blockchain that clients can access either with an access code. For multiple games can be played simultaneously, it is necessary for the Dapp to create a room, or in the case of stratego, a board, for a new game.

### 5. Usable front end

    You can't have a good Dapp without some slick UX!
