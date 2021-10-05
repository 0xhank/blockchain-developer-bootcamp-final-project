const { expect } = require("chai");
const { ethers } = require("hardhat");

let Game;
let hardhatGame;
let owner;
let addr1;
let addr2;
let addrs;

beforeEach(async function () {
  // Get the ContractFactory and Signers here.
  Game = await ethers.getContractFactory("Game");
  [owner, addr1, addr2] = await ethers.getSigners();

  // To deploy our contract, we just have to call Token.deploy() and await
  // for it to be deployed(), which happens once its transaction has been
  // mined.
  hardhatGame = await Game.deploy();
  // await hardhatGame.createBoard();

});

describe("board functionality", function() {
  it("Should convert coords into array index correctly", async function() {
      expect(await hardhatGame.coord2Idx(0, 0)).to.equal(0);
      expect(await hardhatGame.coord2Idx(5, 5)).to.equal(55);
      expect(await hardhatGame.coord2Idx(9, 9)).to.equal(99);

  });
  
  it("Should read game pieces properly", async function() {
    await hardhatGame.createBoard();
    let piece1 = await hardhatGame.coord2Piece(0,0);
    let piece2 = await hardhatGame.coord2Piece(5,2);
    let piece3 = await hardhatGame.coord2Piece(5,0);
    expect(await hardhatGame.piece2Str(piece1)).to.equal("P");
    expect(await hardhatGame.piece2Str(piece2)).to.equal("B");
    expect(await hardhatGame.piece2Str(piece3)).to.equal("E");
  });
  it("Should create a board with proper dimensions", async function() {
    let board = await hardhatGame.createBoard();
    let boardString = await hardhatGame.printBoard(board)
    // console.log(board);
    let expectedBoard = "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPEEBBEEBBEEEEBBEEBBEEPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP"
    expect(boardString).to.equal(expectedBoard);
  });
});