# Consensys Blockchain Bootcamp Final Project

# Intro

I am still new to coding in blockchain, and I need to investigate coding paradigms that are optimized for the platform and ones that are a less viable. As it stands, I'm not sure about the feasibility of real-time card games. Would each user need to complete a transaction just to, say, play a card in go fish? Additionally, I need to spend more time investigating issues with Web2 for some of the ideas I've come up with. Stay tuned for more robust and fully thought-out ideas.
# Refresher: Pros and Cons of Web3

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

