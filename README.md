# Consensys Blockchain Bootcamp Final Project: Zero Knowledge Stratego

Zero Knowledge Proofs are a cutting edge technology in the blockchain community. In cryptography, zero knowledge proofs let you convince me that you know something, or have done something, without revealing to me what your secret thing was. Practically, zero-knowledge is important because it gives you privacy in situations where you’d otherwise have to reveal confidential information. We have already seen Zero Knowledge, or ZK, used in the crypto world. ZCash is a currency that allows users to send private, verified transactions through ZK. ZK will also be used in roll-ups because it allows large numbers of transactions to be executed and verified in small amounts of space and time. I believe ZK has vast potential to allow for privacy in Ethereum DApps. In this project, I want to explore how to build a ZKP in a simple and fun DApp: Stratego.

## Concept Description

    I want to build a stratego game that is hosted on the blockchain. Players enter a game through Metamask. First, they set up their army by placing tiles. Then they take it in turns to make moves. Moves occur in real time, and each is verified by a zero-knowledge proof. Since ZKPs take a relatively long time to be calculated, the game will continue with each ZKP being calculated in the background. Once one player captures the enemy's flag, the game ends.

## Key Technical Challenges

### 1. Zero Knowledge Proofs

    In Stratego, there is always information unavailable to any given player, namely the pieces the other play holds. Therefore, it will be necessary for my project to incorporate zero knowledge proofs to keep certain elements of the game state hidden from users. Zero knowledge proofs are described as "cryptographic methods that allow someone (the verifier) to validate a claim done by a second party (the prover), without requiring the prover to reveal any underlying information about the claim." By this method, elements of the state can be validated without needing to reveal any actual information. Each team's piece arrangment will be kept locally, off chain, and each time they move, they will prove it is possible through a zero-knowledge proof.

### 2. Commit-Reveal Protocol

  Commit-reveal protocols are methods to ensure that two parties share information at the same time. Each party submits a "commitment," which hides the information they want to share. Then both parties reveal the information that the commitment refers to. The commitment is used to prove that the party's choice hasn't changed. This technique can be used when both players reveal their pieces during an attack.
  
### 3. Real-time execution

    An essential aspect of Stratego is it occurs in real time. Since every play is stored on the blockchain, it is essential that each transaction is completed in 1-3 seconds and is gasless. This means the game itself must be hosted on a blockchain other than Ethereum, such as Polygon, Loom, or xDai. Perhaps it's possible to begin the game in Ethereum and host in-game transactions in another blockchain.

### 4. Multiple "boards" capability

    A room is a private space on the blockchain that clients can access either with an access code. For multiple games can be played simultaneously, it is necessary for the Dapp to create a room, or in the case of Stratego, a board, for a new game.

### 5. Usable front end

    You can't have a good Dapp without some slick UX!
