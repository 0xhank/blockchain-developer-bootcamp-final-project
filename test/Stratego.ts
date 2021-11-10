const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("Stratego", function () {
  const startingBoard = "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRREEXXEEXXEEEEXXEEXXEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"
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
    Stratego = await ethers.getContractFactory("Greeter");
  
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
      await expect(aliceStratego.createGame())
        .to.emit(aliceStratego, 'GameIDs')
        .withArgs(Alice.address, 69);
    });
    it("Doesn't allow Alice to play both sides", async function () {
      await aliceStratego.createGame();
      await expect(aliceStratego.join(69)).to.be.reverted;
    });
    it("Allows Bob to join game", async function () {
      await aliceStratego.createGame();
      await expect(bobStratego.join(69))
        .to.emit(bobStratego, 'gameState')
        .withArgs(Alice.address, Bob.address, startingBoard);
    });
    it("Bob cannot join an uncreated game", async function () {
      await expect(bobStratego.join(70)).to.be.reverted;
    });
    it("Cindy cannot join a full game", async function () {
      const [Cindy] = await ethers.getSigners();
      const cindyStratego = stratego.connect(Cindy);
      await aliceStratego.createGame();
      await bobStratego.join(69);
      await expect(cindyStratego.join(69)).to.be.reverted;
    });
    it("Bob can create a new game after Alice", async function () {
      await aliceStratego.createGame();
      await expect(bobStratego.createGame())
        .to.emit(bobStratego, 'GameIDs')
        .withArgs(Bob.address, 69 * 69);
    });
  });
  
  describe("game functionality", function() {
  
    beforeEach(async function () {
      await aliceStratego.createGame();
      await bobStratego.join(69);
    });
    
    describe("piece placement", function () {
      it("Alice and Bob boards saved correctly", async function () {
        let aliceBoard = 1;
        let bobBoard = 2;
        await expect(aliceStratego.place(69, aliceBoard))
        .to.emit(aliceStratego, 'piecesPlaced')
        .withArgs(69, Alice.address, 1);
        await expect(bobStratego.place(69, bobBoard))
        .to.emit(bobStratego, 'piecesPlaced')
        .withArgs(69, Bob.address, 2);
      });
      it("Gamestate updated after bob and alice place pieces", async function () {
        let aliceBoard = 1;
        let bobBoard = 2;
        await expect(aliceStratego.place(69, aliceBoard))
        .to.emit(aliceStratego, 'currPhase')
        .withArgs(69, 1);
        await expect(bobStratego.place(69, bobBoard))
        .to.emit(bobStratego, 'currPhase')
        .withArgs(69, 2);
      })
      it("cannot place pieces after state change", async function () {
        let aliceBoard = 1;
        let bobBoard = 2;
        await aliceStratego.place(69, aliceBoard);
        await bobStratego.place(69, bobBoard);
        await expect(aliceStratego.place(69, aliceBoard)).to.be.reverted;
      })
      it("cannot place pieces in unprepped room", async function () {
        let aliceBoard = 1;
        let bobBoard = 2;
        await bobStratego.place(69, bobBoard);
        await expect(aliceStratego.place(70, aliceBoard)).to.be.reverted;
      })
    });
    
    describe("moving pieces", function() {
      beforeEach(async function () {
        await aliceStratego.place(69, 1);
        await bobStratego.place(69, 1);
      });
      it("game must exist", async function () {
        await expect(aliceStratego.movePiece(70, 1,1,1,1)).to.be.revertedWith("game doesn't exist");
      });

      it("all inputs must be within correct range", async function () {
        await expect(aliceStratego.movePiece(69, 11,1,1,1)).to.be.revertedWith("coords not in range");
        await expect(aliceStratego.movePiece(69, 1,11,1,1)).to.be.revertedWith("coords not in range");
        await expect(aliceStratego.movePiece(69, 1,1,11,1)).to.be.revertedWith("coords not in range");
        await expect(aliceStratego.movePiece(69, 1,1,1,11)).to.be.revertedWith("coords not in range");
        await expect(aliceStratego.movePiece(69, 1,1,1,1)).to.be.revertedWith("cannot move there");
      })
      it("must be your turn to move", async function () {
        await expect(bobStratego.movePiece(69,1,1,1,1)).to.be.revertedWith("not your turn");
      });
      it("rando cannot move", async function () {
        const [Cindy] = await ethers.getSigners();
        const cindyStratego = stratego.connect(Cindy);
        await expect(cindyStratego.movePiece(69,1,1,1,1)).to.be.revertedWith("not playing");

      });
      
      it("move works when move to empty square", async function () {
        await aliceStratego.movePiece(69,3,9,4,9);
        let board = await aliceStratego.printBoard(69);
        // printBoard(board);
        await bobStratego.movePiece(69,6,9,5,9);
        board = await aliceStratego.printBoard(69);
        // printBoard(board);
        await aliceStratego.movePiece(69,4,9,3,9);
        board = await aliceStratego.printBoard(69);
        // printBoard(board);
        await bobStratego.movePiece(69,5,9,5,8);
        board = await aliceStratego.printBoard(69);
        // printBoard(board);
        await aliceStratego.movePiece(69,3,9,4,9);
        board = await aliceStratego.printBoard(69);
        // printBoard(board);
        await bobStratego.movePiece(69,5,8,5,9);
        board = await aliceStratego.printBoard(69);
        // printBoard(board);

        // let aliceBoard = await aliceStratego.printBoard(69);
        // printBoard(aliceBoard);
      });
      it("Cannot move twice", async function () {
        await aliceStratego.movePiece(69,3,9,4,9);
      });
      it("Cannot move blocked square", async function () {
        await expect(aliceStratego.movePiece(69,5,9,6,9)).to.be.revertedWith("cannot move that piece");
      });
      it("Cannot move opposite team square", async function () {
        await expect(aliceStratego.movePiece(69,6,9,5,9)).to.be.revertedWith("cannot move that piece");
      });
      it("Cannot move empty square", async function () {
        await expect(aliceStratego.movePiece(69,5,2,5,1)).to.be.revertedWith("cannot move that piece");
      });
      
      it("Cannot move to blocked square", async function () {
        await expect(aliceStratego.movePiece(69,3,2,4,2)).to.be.revertedWith("cannot move there");
      });
      
      it("Cannot move to taken square", async function () {
        await expect(aliceStratego.movePiece(69,3,2,3,1)).to.be.revertedWith("cannot move there");
    
      });
      
      it("Cannot move multiple squares", async function() {
        let board = await aliceStratego.printBoard(69);
        printBoard(board);
        await expect(aliceStratego.movePiece(69,3,9,5,9)).to.be.revertedWith("cannot jump squares");
        await expect(aliceStratego.movePiece(69,3,9,5,9)).to.be.revertedWith("cannot jump squares");
        await expect(aliceStratego.movePiece(69,3,0,4,1)).to.be.revertedWith("cannot jump squares");
        await expect(aliceStratego.movePiece(69,3,0,4,4)).to.be.revertedWith("cannot jump squares");
        await expect(aliceStratego.movePiece(69,3,0,4,9)).to.be.revertedWith("cannot jump squares");

      });
      // move works and battle occurs when move to enemy square
      it("Multiple players move and the board updates accordingly", async function () {
        await aliceStratego.movePiece(69,3,9,4,9);
        await bobStratego.movePiece(69, 6,9,5,9);
        let aliceBoard = await aliceStratego.printBoard(69);
        printBoard(aliceBoard);
      });
      it("When a player attacks another player, the gamestate updates to battle", async function () {
        await aliceStratego.movePiece(69,3,9,4,9);
        await bobStratego.movePiece(69,6,9,5,9);
        await expect(aliceStratego.movePiece(69,4,9,5,9))
          .to.emit(aliceStratego, 'battleSquares')
          .withArgs(69, 49, 59);
      });
      
      
      describe("battle", function () {
        beforeEach(async function () {
          console.log(await aliceStratego.printPhase(69));
          await aliceStratego.movePiece(69,3,9,4,9);
          await bobStratego.movePiece(69,6,9,5,9);
          await aliceStratego.movePiece(69,4,9,5,9);
        });
        
        it("Piece value is within correct range", async function() {
          await expect(aliceStratego.battle(69, 100)).to.be.revertedWith("invalid piece value");
          await expect(aliceStratego.battle(69, -1)).to.be.reverted;
          await expect(aliceStratego.battle(69, 12)).to.be.revertedWith("invalid piece value");
          await expect(aliceStratego.battle(69,1))
          .to.emit(aliceStratego, 'pieceClaimed')
          .withArgs(69, Alice.address, 1);
        });
        it("game must exist", async function () {
          await expect(aliceStratego.battle(70, 1)).to.be.revertedWith("game doesn't exist");
        });
        it("rando cannot battle", async function () {
          const [Cindy] = await ethers.getSigners();
          const cindyStratego = stratego.connect(Cindy);
          await expect(cindyStratego.battle(69,1)).to.be.revertedWith("not playing");
                 
        });
        it("player hasn't already declared battle piece", async function () {
          await aliceStratego.battle(69,1);
          await expect(aliceStratego.battle(69, 1)).to.be.revertedWith("already received piece");
        });
        it("player hasn't already declared battle piece", async function () {
          await bobStratego.battle(69,1);
          await expect(bobStratego.battle(69, 1)).to.be.revertedWith("already received piece");
        });
        /*
          phase is correct
        */
        
        describe.only("resolve battle", function () {          
          it("1 vs 2", async function() {
            await aliceStratego.battle(69,1);
            await expect(bobStratego.battle(69, 2))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, Alice.address);
          })
          it("1 vs 1", async function() {
            await aliceStratego.battle(69,1);
            await expect(bobStratego.battle(69, 1))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, '0x0000000000000000000000000000000000000000');
          })
          it("Other standard battles", async function() {
            await aliceStratego.battle(69,1);
            await expect(bobStratego.battle(69, 3))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, Alice.address);
          })
          it("Std Piece vs Bomb", async function() {
            await aliceStratego.battle(69,1);
            await expect(bobStratego.battle(69, 10))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, Bob.address);
          })
      
          it("Miner vs Bomb", async function() {
            await aliceStratego.battle(69,8);
            await expect(bobStratego.battle(69, 10))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, Alice.address);
          })
          
          it("1 vs Spy", async function() {
            await aliceStratego.battle(69,1);
            await expect(bobStratego.battle(69, 9))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, Alice.address);
          })
          
          it("Spy vs 1", async function() {
            await aliceStratego.battle(69,9);
            await expect(bobStratego.battle(69, 1))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, Alice.address);
          })          
        });
      });
    });

    
    describe("board tools functionality", function(){
      it("Should convert coords into array index correctly", async function() {
          expect(await stratego.coord2Idx(0, 0)).to.equal(0);
          expect(await stratego.coord2Idx(5, 5)).to.equal(55);
          expect(await stratego.coord2Idx(9, 9)).to.equal(99);
    
      });
      
      it("Should read Stratego pieces properly", async function() {
        await stratego.createBoard();
        let piece1 = await stratego.coord2Piece(69, 0, 0);
        let piece2 = await stratego.coord2Piece(69, 5, 2);
        let piece3 = await stratego.coord2Piece(69, 5, 0);
        expect(await stratego.piece2Str(piece1)).to.equal("R");
        expect(await stratego.piece2Str(piece2)).to.equal("X");
        expect(await stratego.piece2Str(piece3)).to.equal("E");
      });
    });
  });
});

let printBoard = (board) => {
  for(let i = 0; i < 100; i += 10){
    console.log(board.substring(i, i+10));
  }
}

/*
QUESTIONS
  SHOULD AN INPUT VALUE ALWAYS BE A uint?
*/