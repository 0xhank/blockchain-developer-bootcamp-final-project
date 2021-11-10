<<<<<<< HEAD
# Get started

1. Clone the repo and cd into it `git clone https://github.com/symfoni/hardhat-react-boilerplate.git MyProject && cd MyProject`
2. Install deps with yarn `yarn` or npm `npm install`
3. Start hardhat `npx hardhat node --watch`

![](https://media.giphy.com/media/9l6z9MzXfHX9gKzbvU/giphy.gif)
=======
# Consensys Blockchain Bootcamp Final Project: Zero Knowledge Stratego
>>>>>>> 225c247808b788def0fb33fcbf6d51fb0268aceb

```text
It runs up a Hardhat node, compile contracts, generates typescript interfaces, creates React context and instantiates your contract instances and factories with frontend provider.
```

<<<<<<< HEAD
4. Open up a new terminal
5. Enter the frontend directory: `cd frontend`
6. Install dependencies: `npm install`
7. Import seed phrase in Metamask. The default mnemonic currently used by hardhat is `test test test test test test test test test test test junk`
  1. Please note that you need to sign out from your current Metamask wallet to import a new one. **Instead of logging out**, you can use a new browser profile to do your Ethereum development:
  3. Click your profile icon in the top right corner of Chrome (right next to the hamburger menu icon)
  4. Click "Add"
  5. Give the profile a name and click "Add"
  6. In this new browser window, install Metamask and import the keyphrase above
8. Ensure Metamask RPC is set to `http://localhost:8545` and chainID `31337`.
9. Start the React app: `npm start`

The frontend should open at http://localhost:3000/

Because of this default hardhat.config.ts it will first try to connect with an injected provider like Metamask (web3modal package does this).
=======
    I want to build a stratego game that is hosted on the blockchain. Players create and join games through Metamask. Rounds occur in real time, and one player cannot view the pieces of the opposing player. When a move occurs, a player must verify that their move is acceptable without revealing what their piece is; in order for this to work, I will use zero-knowledge proofs. I've drawn inspiration for my implementation from Dark Forest, an open-source, real-time incomplete information blockchain game that overcame many of the same challenges this game faces.

## Stratego's Core Characteristics

    Stratego is a classic board game that has simple rules and some unique characteristics. It is incomplete information, meaning any one player doesn't have access to the full game state during play. A successful player must understand game theory and risk versus reward calculations, as well as a good memory to keep track of which pieces are in which locations. It is a compelling, short-form board game of capture the flag.
>>>>>>> 225c247808b788def0fb33fcbf6d51fb0268aceb

If nothing found it will try to connect with your hardhat node. On localhost and hardhat nodes it will inject your mnemonic into the frontend so you have a "browser wallet" that can both call and send transactions. NB! Dont ever put a mnemonic with actual value here.

In hardhat.config.ts there is example on how to instruct your hardhat-network to use mnemonic or privatekey.

<<<<<<< HEAD
```ts
const config: HardhatUserConfig = {
  react: {
    providerPriority: ["web3modal", "hardhat"],
  },
};
```

Ensure you are useing RPC to http://localhost:8545.

You may also need to set the chainID to 31337 if you are useing Hardhat blockchain development node.

## Invalid nonce.

```bash
eth_sendRawTransaction
  Invalid nonce. Expected X but got X.
```

Reset your account in Metamask.
=======
    In stratego, there is always information unavailable to any given player, such as the value of opposing pieces. However, the blockchain's state is available to all other users. Therefore, it will be necessary for my project to incorporate zero knowledge proofs to keep certain elements of the game state hidden from users. Zero knowledge proofs are described as "cryptographic methods that allow someone (the verifier) to validate a claim done by a second party (the prover), without requiring the prover to reveal any underlying information about the claim." By this method, elements of the state can be validated without needing to reveal any actual information.

### 3. Real-time execution

    An essential aspect of stratego is it occurs in real time. Since every play is stored on the blockchain, it is essential that each transaction is completed in 1-3 seconds and is gasless. This means the game itself must be hosted on a blockchain other than Ethereum, such as Polygon, Loom, or xDai. Perhaps it's possible to begin the game in Ethereum and host in-game transactions in another blockchain.

### 4. Multiple "boards" capability

    A room is a private space on the blockchain that clients can access either with an access code. For multiple games can be played simultaneously, it is necessary for the Dapp to create a room, or in the case of stratego, a board, for a new game.

### 5. Usable front end
>>>>>>> 225c247808b788def0fb33fcbf6d51fb0268aceb

# We ❤️ these **Ethereum** projects:

- [Hardhat 👷](https://hardhat.org/)
- [Hardhat-deploy 🤘](https://hardhat.org/plugins/hardhat-deploy.html)
- [Typechain 🔌](https://github.com/ethereum-ts/Typechain#readme)
- [hardhat-typechain 🧙‍♀️](https://hardhat.org/plugins/hardhat-typechain.html)
- [ethers.js v5 ⺦](https://github.com/ethers-io/ethers.js#readme)
- [web3modal 💸](https://github.com/Web3Modal/web3modal#web3modal)
- [ts-morph 🏊‍♂️](https://github.com/dsherret/ts-morph)
- [@symfoni/hardhat-react 🎻(our own)](https://www.npmjs.com/package/@symfoni/hardhat-react)
