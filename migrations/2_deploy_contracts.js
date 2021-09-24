var Deck = artifacts.require("./Deck.sol");

module.exports = function(deployer) {
  deployer.deploy(Deck);
};
