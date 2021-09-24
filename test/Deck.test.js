/*

The public version of the file used for testing can be found here: https://gist.github.com/ConsenSys-Academy/ce47850a8e2cba6ef366625b665c7fba

This test file has been updated for Truffle version 5.0. If your tests are failing, make sure that you are
using Truffle version 5.0. You can check this by running "trufffle version"  in the terminal. If version 5 is not
installed, you can uninstall the existing version with `npm uninstall -g truffle` and install the latest version (5.0)
with `npm install -g truffle`.

*/
const { catchRevert } = require("./exceptionsHelpers.js");
var Deck = artifacts.require("./Deck.sol");

contract("Deck", function (accounts) {
  const [contractOwner, alice] = accounts;

  beforeEach(async () => {
    instance = await Deck.new();
  });
  
  it.skip("should have a deck", async () => {
    assert.equal(typeof instance.deck, 'function', "the contract has no deck");
  });  
  
  it.skip("should emit a print event when the deck is reset", async () => {
    let eventEmitted = false;
    const tx = await instance.reset();
    if (tx.logs[0].event == "printDeck") {
      eventEmitted = true;
    }
    assert.equal(eventEmitted, true, "resetting deck should emit a printDeck event", );
  });
  
  it("should shuffle the deck when shuffle is called", async () => {
    let decksEqual = false;
    // const preShuffle = await instance.reset.call();
    const shuffle = await instance.shuffle.call();
    console.log(shuffle[0]);
    if (preShuffle == shuffle) {
      let decksEqual = true;
    }
    assert.equal(decksEqual, false, "shuffling deck should emit a printDeck event", );
  });
});
