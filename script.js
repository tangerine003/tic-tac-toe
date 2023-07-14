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

const playerFactory = (name) => {
  return { name };
};

const playerOne = playerFactory("X");
const playerTwo = playerFactory("O");
