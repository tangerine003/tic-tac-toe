const gameBoard = (function createGameBoard() {
  const gameBoardArray = [
    ["X", "X", "O"],
    ["X", "O", "O"],
    ["X", "O", "X"],
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
    return { name, token };
  };

  const playerOne = playerFactory("Declan", "X");
  const playerTwo = playerFactory("Theo", "O");

  let activePlayer = playerOne;

  let row = prompt("Enter the row, the cell you want to add token to,lies in");

  let column = prompt("Enter the column, the cell you want to add token to,lies in");

  gameBoard.addToken(activePlayer, { row, column });

  return {};
})();
