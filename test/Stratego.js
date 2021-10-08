const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("Stratego", function () {

  let Stratego;
  let stratego;
  let owner;
  let Alice;
  let aliceStratego;
  let Bob;
  let bobStratego;
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    [owner, Alice, Bob] = await ethers.getSigners();
    Stratego = await ethers.getContractFactory("Stratego");
  
    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    stratego = await Stratego.deploy();
    await stratego.deployed();
    // await stratego.createBoard();
    aliceStratego = stratego.connect(Alice);
    bobStratego = stratego.connect(Bob);

  });
  describe("game creation", function () {
    it("Creates a game room for Alice", async function () {
      console.log("alice's address: %s", Alice.address);
      await expect(aliceStratego.createGame())
        .to.emit(aliceStratego, 'GameIDs')
        .withArgs(Alice.address, 69);
    })
  });
  
  // describe("board functionality", function() {
  //   it("Should convert coords into array index correctly", async function() {
  //       expect(await stratego.coord2Idx(0, 0)).to.equal(0);
  //       // expect(await stratego.coord2Idx(5, 5)).to.equal(55);
  //       // expect(await stratego.coord2Idx(9, 9)).to.equal(99);
  
  //   });
    
  //   it("Should read Stratego pieces properly", async function() {
  //     await stratego.createBoard();
  //     let piece1 = await stratego.coord2Piece(0,0);
  //     let piece2 = await stratego.coord2Piece(5,2);
  //     let piece3 = await stratego.coord2Piece(5,0);
  //     expect(await stratego.piece2Str(piece1)).to.equal("R");
  //     expect(await stratego.piece2Str(piece2)).to.equal("X");
  //     expect(await stratego.piece2Str(piece3)).to.equal("E");
  //   });
    
  //   it("Should create a board with proper piece starting locations", async function() {
  //     await stratego.createBoard();
  //     let expectedBoard = "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRREEXXEEXXEEEEXXEEXXEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"
  //     expect(await stratego.printBoard()).to.equal(expectedBoard);
  //   });
  // });
  
  // describe("moving pieces", async function() {
  //     it("Should update the board state correctly when moving", async function() {
  //       await stratego.createBoard();
  //       await stratego.movePiece(3,9,4,9);
  //       let expectedBoard = "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRREEEXXEEXXEREEXXEEXXEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"
  //       expect(await stratego.printBoard()).to.equal(expectedBoard);
  
  //     });
  // });
})