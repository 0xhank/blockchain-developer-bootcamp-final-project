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
        .to.emit(bobStratego, 'beginGame')
        .withArgs(69, Alice.address, Bob.address);
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
  
  describe.only("game functionality", function() {
  
    beforeEach(async function () {
      await aliceStratego.createGame();
      await bobStratego.join(69);
    });
    
    describe("piece placement", function () {
      it("Alice and Bob boards saved correctly", async function () {
        await aliceStratego.place(69, "1");
        await expect(bobStratego.place(69, "2"))
        .to.emit(bobStratego, 'piecesPlaced')
        .withArgs(69, "1", "2");
      });
      it("cannot place pieces after state change", async function () {
        let aliceBoard = "1";
        let bobBoard = "2";
        await aliceStratego.place(69, aliceBoard);
        await bobStratego.place(69, bobBoard);
        await expect(aliceStratego.place(69, aliceBoard)).to.be.reverted;
      })
      it("cannot place pieces in unprepped room", async function () {
        let aliceBoard = "1";
        let bobBoard = "2";
        await bobStratego.place(69, bobBoard);
        await expect(aliceStratego.place(70, aliceBoard)).to.be.reverted;
      })
    });
    
    describe("moving pieces", function() {
      beforeEach(async function () {
        await aliceStratego.place(69, "1");
        await bobStratego.place(69, "1");
      });
      
      it("game must exist", async function () {
        await expect(aliceStratego.movePiece(70, 11,11, 'a')).to.be.revertedWith("game doesn't exist");
      });

      it("all inputs must be within correct range", async function () {
        await expect(aliceStratego.movePiece(69, 111,11, 'a')).to.be.revertedWith("coords not in range");
        await expect(aliceStratego.movePiece(69, 111,11, 'a')).to.be.revertedWith("coords not in range");
        await expect(aliceStratego.movePiece(69, 11,111, 'a')).to.be.revertedWith("coords not in range");
        await expect(aliceStratego.movePiece(69, 11,111, 'a')).to.be.revertedWith("coords not in range");
        await expect(aliceStratego.movePiece(69, 11,11, 'a')).to.be.revertedWith("cannot move there");
      });
      
      it("must be your turn to move", async function () {
        await expect(bobStratego.movePiece(69,11,11, 'a')).to.be.revertedWith("not your turn");
      });
      
      it("rando cannot move", async function () {
        const [Cindy] = await ethers.getSigners();
        const cindyStratego = stratego.connect(Cindy);
        await expect(cindyStratego.movePiece(69, 11, 11, 'a')).to.be.reverted;
      });
      
      it("move works when move to empty square", async function () {
        await expect(aliceStratego.movePiece(69, 39, 49, 'a'))
        .to.emit(aliceStratego, 'makeMove')
        .withArgs(69, 39, 49, 'a');
        
        await expect(bobStratego.movePiece(69, 69, 59, 'a'))
        .to.emit(aliceStratego, 'makeMove')
        .withArgs(69, 69, 59, 'a');
        
        await expect(aliceStratego.movePiece(69, 49, 39, 'a'))
        .to.emit(aliceStratego, 'makeMove')
        .withArgs(69, 49, 39, 'a');
        await expect(bobStratego.movePiece(69, 59, 58, 'a'))
        .to.emit(aliceStratego, 'makeMove')
        .withArgs(69, 59, 58, 'a');
        await expect(aliceStratego.movePiece(69, 39, 49, 'a'))
        .to.emit(aliceStratego, 'makeMove')
        .withArgs(69, 39, 49, 'a');
        await expect(bobStratego.movePiece(69, 58, 59, 'a'))
        .to.emit(aliceStratego, 'makeMove')
        .withArgs(69, 58, 59, 'a');
      });
      
      it("Cannot move twice", async function () {
        await aliceStratego.movePiece(69, 39, 49, 'a');
      });
      
      it("Cannot move blocked square", async function () {
        await expect(aliceStratego.movePiece(69, 59, 69, 'a')).to.be.revertedWith("cannot move that piece");
      });
      
      it("Cannot move opposite team square", async function () {
        await expect(aliceStratego.movePiece(69, 69, 59, 'a')).to.be.revertedWith("cannot move that piece");
      });
      
      it("Cannot move empty square", async function () {
        await expect(aliceStratego.movePiece(69, 52, 51, 'a')).to.be.revertedWith("cannot move that piece");
      });
      
      it("Cannot move to blocked square", async function () {
        await expect(aliceStratego.movePiece(69, 32, 42, 'a')).to.be.revertedWith("cannot move there");
      });
      
      it("Cannot move to taken square", async function () {
        await expect(aliceStratego.movePiece(69,32,31, 'a')).to.be.revertedWith("cannot move there");
      });
      
      it("Cannot move multiple squares", async function() {
        await expect(aliceStratego.movePiece(69,39,59, 'a')).to.be.revertedWith("cannot jump squares");
        await expect(aliceStratego.movePiece(69,39,59, 'a')).to.be.revertedWith("cannot jump squares");
        await expect(aliceStratego.movePiece(69,30,41, 'a')).to.be.revertedWith("cannot jump squares");
        await expect(aliceStratego.movePiece(69,30,44, 'a')).to.be.revertedWith("cannot jump squares");
        await expect(aliceStratego.movePiece(69,30,49, 'a')).to.be.revertedWith("cannot jump squares");
      });
      
      // move works and battle occurs when move to enemy square
      it("Multiple players move and the board updates accordingly", async function () {
        await aliceStratego.movePiece(69,39,49, 'a');
        await bobStratego.movePiece(69, 69,59, 'a');
      });
      
      it("When a player attacks another player, the gamestate updates to battle", async function () {
        await aliceStratego.movePiece(69,39,49, 'a');
        await bobStratego.movePiece(69,69,59, 'a');
        await expect(aliceStratego.movePiece(69,49,59, 'a'))
          .to.emit(aliceStratego, 'battleSquares')
          .withArgs(69, 49, 59, 'a');
      });
      
      describe("battle", function () {
        beforeEach(async function () {
          await aliceStratego.movePiece(69,39,49, 'a');
          await bobStratego.movePiece(69,69,59, 'a');
          await aliceStratego.movePiece(69,49,59, 'a');
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
          await expect(cindyStratego.battle(69,1)).to.be.reverted;       
        });
        
        it("player hasn't already declared battle piece", async function () {
          await aliceStratego.battle(69,1);
          await expect(aliceStratego.battle(69, 1)).to.be.revertedWith("already received piece");
        });
        
        it("player hasn't already declared battle piece", async function () {
          await bobStratego.battle(69,1);
          await expect(bobStratego.battle(69, 1)).to.be.revertedWith("already received piece");
        });
        // phase is correct
        
        describe("resolve battle", function () {          
          it("1 vs 2", async function() {
            await aliceStratego.battle(69,1);
            await expect(bobStratego.battle(69, 2))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, 59, 1, 49, 0);
          });
          
          it("1 vs 1", async function() {
            await aliceStratego.battle(69,1);
            await expect(bobStratego.battle(69, 1))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, 49, 0, 59, 0);
          });
          
          it("Other standard battles", async function() {
            await aliceStratego.battle(69,1);
            await expect(bobStratego.battle(69, 3))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, 59, 1, 49, 0);
          });
          
          it("Std Piece vs Bomb", async function() {
            await aliceStratego.battle(69,1);
            await expect(bobStratego.battle(69, 10))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, 49, 0, 59, 10);
          });
      
          it("Miner vs Bomb", async function() {
            await aliceStratego.battle(69,8);
            await expect(bobStratego.battle(69, 10))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, 59, 8, 49, 0);
          });
          
          it("1 vs Spy", async function() {
            await aliceStratego.battle(69,1);
            await expect(bobStratego.battle(69, 9))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, 59, 1, 49, 0);
          });
          
          it("Spy vs 1", async function() {
            await aliceStratego.battle(69,9);
            await expect(bobStratego.battle(69, 1))
            .to.emit(bobStratego, "battleResolved")
            .withArgs(69, 59, 9, 49, 0);
          });
          
          it("1 vs Flag", async function() {
            await aliceStratego.battle(69,1);
            await expect(bobStratego.battle(69, 11))
            .to.emit(bobStratego, "GameoverLog")
            .withArgs(69, false);
          });
        });
      });
    });
  });
});


/*
QUESTIONS
  SHOULD AN INPUT VALUE ALWAYS BE A uint?
*/