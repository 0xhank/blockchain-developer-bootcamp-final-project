# Consensys Blockchain Bootcamp Final Project

## Refresher: Pros and Cons of Web3

### Pros

1. *Decentralized Trust* - A blockchain based system promises each stakeholder full data records stored in a decentralized way. Any addition to the records need algorithmic validation from multiple nodes following a set consensus mechanism.
2. *Immutability -* Records created on a blockchain cannot be modified since any additional blocks are appended to the blockchain and broadcasted to multiple nodes.
3. *Traceability -* Blockchain enables a quicker settlement of trades or interactions because a single version of agreed upon data is available on a distributed ledger between organizations where a full history of records of the transaction is available.
4. *Data Security -* All transactions in a blockchain network are cryptographically secured and provide integrity and are considered very difficult to hack. The blockchain itself is an immutable and durable ledger and the transactions once recorded on the blockchain after a consensus among the peers cannot be altered or deleted.
5. *Privacy - D*ifferent entities communicate autonomously. Each transaction is between two public addresses unlinked to the actual names or home addresses. Blockchains implement privacy through the use of Zero Knowledge Proofs where encrypted transactions can be verified without the need for revealing data or identity.

### Cons

1. *Low Speed* -  Most Proof of Work blockchains have limited Block size and hence can have very limited speed of transactions (Chang et al., 2020). Bitcoin for example supports the creation of 1 block each 10 min, which is a median transaction rate of 7 transactions per second (Lee, 2019). Ethereum supports 15 transactions per second. In comparison Visa, based on centralized databases processes around 1700 transactions per second and can scale very rapidly (Khan et al., 2020).
2. *Cannot support large files* - It is a common practice to have the blockchain as a validator for documents, and storing the result of a Hash function on the blockchain which is very small in data size but sufficient to validate the authenticity of the original file. Hence a blockchain usually complements a central digital platform and does not need to always replace it.
3. *Energy Waste* - Mining, etc
4. *Necessity to have critical mass -* Blockchain is redundant where one or few highly trustworthy players are interacting and its implementation can be much more complex than traditional centralized databases. Once a Blockchain is implemented, to succeed it must have a certain critical mass to achieve the desired level of decentralization. Decentralization of decision-making and verification processes require high levels of participation of the community around these platforms either by producing, consuming, voting, coding or verifying transactions.

# Brainstorm

### Idea: Ethereum Poker Game
* Why? Because I enjoy poker and want to allow others to play on a decentralized platform
   * Technical requirements:
      * Simple and usable front-end
         * Multiple sockets that provide users with live information about money, cards, game state, and more
      * Encrypted game state: I cannot have access to other users' cards
      * Instant/free game state updates: Required for the functionality of the app as a live, fast-moving game
      * Ability to cash in or cash out.
      * Ability to join unique game room with specific people.
    *  Questions
      * Will this be for real ETH or just for play coins? 
      * How can the game state be updated fast and easily?
      * How can I effectively test the code for multiple users?

### Idea: Decentralized Job search platform
   * Why?
      * To guarantee applicants have employment history they purpore
   * User Workflow
      * User completes employment specified at specific company (account) and company verifies their employment or rejects and alters the work they performed
      * User completes certification/degree from institution and institution verifies their degree
      * Built-in, secured tests offered to provide internal verification of quality
   * Use cases
      * For job searchers: provides immediate database for current and former employees regarding job descriptions, pay estimates, and quality of job environment
      * For employers: Ensures qualified applicants, speeds up process of choosing applicants, eliminates issue of reading resumes with embellished histories

### Idea: American Fantasy Football (To be fleshed out)
   * Why? American football is an untapped area for utilization of NFTs, team building, and betting
   * Potential capabilities:
      * Special editions of players
      * Unique team upgrades/ special combo multipliers
      * Player marketplace
      * Prizes based on weekly performance
      * Integration with real NFL teams
   * https://decrypt.co/resources/sorare-beginners-guide-2021

### Ethereum Poker



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
