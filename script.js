const gameBoard = (function createGameBoard() {
  const gameBoardArray = [
    ["X", "X", "O"],
    ["X", "O", "O"],
    ["X", "O", "X"],
  ];

  const printGameBoardArrayToConsole = () => {
    console.log(gameBoardArray);
  };

  return { gameBoardArray, printGameBoardArrayToConsole };
})();

const gameController = (function () {
  const playerFactory = (name, token) => {
    return { name, token };
  };

  const playerOne = playerFactory("Declan", "X");
  const playerTwo = playerFactory("Theo", "O");

  return {};
})();
