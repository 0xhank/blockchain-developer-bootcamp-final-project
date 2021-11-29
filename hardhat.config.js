require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 
 const RINKEBY_API_KEY ="https://rinkeby.infura.io/v3/d1b16f81dcd14905b330afbe8a4f2672"
 const ROPSTEN_API_KEY ="https://ropsten.infura.io/v3/d1b16f81dcd14905b330afbe8a4f2672"

 const PRIVATE_KEY = "69";

 module.exports = {
  solidity: "0.7.3",
  networks: {
    ropsten: {
      url: ROPSTEN_API_KEY,
      accounts: [PRIVATE_KEY]
    },
    rinkeby: {
      url: RINKEBY_API_KEY,
      accounts: [PRIVATE_KEY]
    }
  }
};
