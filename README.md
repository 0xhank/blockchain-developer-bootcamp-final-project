# Henry Caron's Consensys Blockchain Bootcamp Final Project: Zero Knowledge Stratego

## Project Scope
  Simple two-player game with public game data stored on the blockchain and private piece values stored locally. Commit-reveal protocol ensures cheating is not occurring.

## Deployed Frontend: 
Play the game with a friend at: 
```website.com```.
Make sure that your Metamask is set to Rinkeby.

## Running Locally

### Prerequisites
- npm
- Node.js >= v14.18.1
- Hardhat
- React

### Get Started

1. Clone the repo and cd into it ```git clone https://github.com/henryacaron/blockchain-developer-bootcamp-final-project.git Stratego && cd Stratego```
2. Install deps with yarn ```yarn``` or npm ```npm install```
3. Spinup hardhat blockchain ```npx hardhat node --watch```
4. Open a second terminal
5. Enter frontend dir with ```cd frontend```
6. Install dependencies ```npm install```
7. Import seed phrase into throwaway Metamask wallet. Current mnemonic is ```test test test test test test test test test test test junk```
8. Ensure Metamask RPC is set to ```localhost:8545``` and the chainID is ```31337```
9. Start React app with ```npm start```

## Testing Contract
Test the contract with ```npx hardhat test```

## Video Example of Game

Watch the game at: https://www.youtube.com/watch?v=dQw4w9WgXcQ