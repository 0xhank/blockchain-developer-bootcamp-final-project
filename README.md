# Consensys Blockchain Bootcamp Final Project



# Ethereum Poker

## Problem

Online poker is hugely popular, but requires players to pay high fees for access to online casinos. Cashing out can take multiple days, and there is often a lack of transparency about shady gambling sites. An open source blockchain poker game would solve many of these issues. Players could buy in instantly with their crypto, maintain anonymity, and not have to pay high fees. There would be complete transparency, giving power to players in an industry that is dominated by centralized casinos.

## Concept Description

    I want to build a poker game that is hosted on the blockchain. Players buy in to a table through Metamask and play with their actual ETH. Rounds occur in real time, and players don't have access to the game state other than their cards and community cards that everyone can see. Once the game is over, players cash out and their accounts receive tokens equivalent to their final in-game stack. I've drawn inspiration for my implementation from Dark Forest, an open-source, real-time incomplete information blockchain game that overcame many of the same challenges this game faces.

## Poker's Core Characteristics

    Poker is a classic card game that has simple rules and some unique characteristics. It is incomplete information, meaning any one player doesn't have access to the full game state during play. A successful player must understand game theory and risk versus reward calculations (called pot odds). In addition, incalculable "live tells"-- when players receive information from their opponent unrelated to the cards in play -- influence players to defy the mathematically optimal choice. Finally, poker is typically played for real money, bringing meaning to each hand. These traits make it one of the most difficult games to master and causes every hand of every game to be unique. 

## Key Technical Challenges

# 1. Zero Knowledge Proofs

    In poker, there is always information unavailable to any given player, such as other players' cards and the order of cards in the deck. However, the blockchain's state is available to all other users. Therefore, it will be necessary for my project to incorporate zero knowledge proofs to keep certain elements of the game state hidden from users. Zero knowledge proofs are described as "cryptographic methods that allow someone (the verifier) to validate a claim done by a second party (the prover), without requiring the prover to reveal any underlying information about the claim." By this method, elements of the state can be validated without needing to reveal any actual information.

### 2. Real-time execution

    An essential aspect of poker is it occurs in real time. Players often have a "shot clock" of time to make a play. Each player makes between one and ten plays, such as folding, calling, betting, or raising each hand. Since every play is stored on the blockchain, it is essential that each transaction is completed in 1-3 seconds and is gasless. This means the game itself must be hosted on a blockchain other than Ethereum, such as Polygon, Loom, or xDai. Perhaps it's possible to begin the game in Ethereum and host in-game transactions in another blockchain.

### 3. Multiple "tables" capability

    A room is a private space on the blockchain that clients can access either with an access code. For multiple games can be played simultaneously, it is necessary for the Dapp to create a room, or in the case of poker, a table, for a new game.

### 4. Usable front end

    You can't have a good Dapp without some slick UX!
