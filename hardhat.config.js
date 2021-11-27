require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 
 const API_KEY ="https://rinkeby.infura.io/v3/d1b16f81dcd14905b330afbe8a4f2672"
 
 const RINKEBY_PRIVATE_KEY = "98ab7ac9c1d44be51e60abd16076b6ba488f154d862f6900d96ccd4aec45dc39";

module.exports = {
  solidity: "0.7.3",
  // networks: {
  //   RINKEBY: {
  //     url: API_KEY,
  //     accounts: [`${RINKEBY_PRIVATE_KEY}`]
  //   }
  // }
};
