const gameBoard = (function createGameBoard() {
  const gameBoardArray = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ];

  const printGameBoardArrayToConsole = () => {
    console.log(gameBoardArray);
  };

  const addToken = (player, location) => {
    if (gameBoardArray[location.row][location.column] == "-") {
      gameBoardArray[location.row][location.column] = player.token;
    } else {
      console.log("This cell is already marked, choose a new cell");
    }
  };

  return { gameBoardArray, printGameBoardArrayToConsole, addToken };
})();

const gameController = (function () {
  const playerFactory = (name, token) => {
    let score = 0;
    return { name, token, score };
  };

  const playerOne = playerFactory("Declan", "X");
  const playerTwo = playerFactory("Theo", "O");

  let activePlayer = playerOne;

  let row, column;

  const promptLocation = () => {
    row = prompt("Enter the row, the cell you want to add token to,lies in");
    column = prompt("Enter the column, the cell you want to add token to,lies in");
  };

  gameBoard.addToken(activePlayer, { row, column });

  const playInitialRound = () => {
    promptLocation();
    gameBoard.addToken(activePlayer, { row, column });
    gameBoard.printGameBoardArrayToConsole();
  };

  return {};
})();
