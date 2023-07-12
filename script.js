const gameBoard = (function createGameBoard() {
  const gameBoardArray = [];
  return { gameBoardArray };
})();

const playerFactory = (name) => {
  return { name };
};

const playerOne = playerFactory("X");
const playerTwo = playerFactory("O");
