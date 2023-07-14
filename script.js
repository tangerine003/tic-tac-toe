const gameBoard = (function createGameBoard() {
  const gameBoardArray = [
    ["X", "X", "O"],
    ["X", "O", "O"],
    ["X", "O", "X"],
  ];
  return { gameBoardArray };
})();

const playerFactory = (name) => {
  return { name };
};

const playerOne = playerFactory("X");
const playerTwo = playerFactory("O");
