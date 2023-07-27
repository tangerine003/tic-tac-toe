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

  const getBoard = () => gameBoardArray;

  return { getBoard, printGameBoardArrayToConsole, addToken };
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

  const checkForPatternMatch = (player, board) => {
    const locationOfPlayerTokensOnBoard = [[], [], []];

    board.forEach((row, row_index) => {
      row.forEach((cell, cell_index) => {
        if (cell == player.token)
          locationOfPlayerTokensOnBoard[row_index][cell_index] = cell_index;
      });
    });

    console.log(locationOfPlayerTokensOnBoard);

    for (let i = 0; i < locationOfPlayerTokensOnBoard.length; i++) {
      let tokenCountHorizontal = 0,
        tokenCountVertical = 0,
        tokenCountDiagonal = 0;

      if (locationOfPlayerTokensOnBoard[i].length) {
        tokenCountHorizontal = locationOfPlayerTokensOnBoard[i].reduce((count) => {
          return count + 1;
        }, 0);
        if (tokenCountHorizontal == 3) player.score++;

        for (let j = 0; j < locationOfPlayerTokensOnBoard[i].length; j++) {
          if (locationOfPlayerTokensOnBoard[i][j] != null) {
            if (
              locationOfPlayerTokensOnBoard[i + 1] != null &&
              locationOfPlayerTokensOnBoard[i + 2] != null
            ) {
              if (
                locationOfPlayerTokensOnBoard[i][j] == j &&
                locationOfPlayerTokensOnBoard[i + 1][j] == j &&
                locationOfPlayerTokensOnBoard[i + 2][j] == j
              ) {
                tokenCountVertical = 3;
                player.score++;
              }

              if (
                (locationOfPlayerTokensOnBoard[i][j] == j &&
                  locationOfPlayerTokensOnBoard[i + 1][j + 1] == j + 1 &&
                  locationOfPlayerTokensOnBoard[i + 2][j + 2] == j + 2) ||
                (locationOfPlayerTokensOnBoard[i][j] == j &&
                  locationOfPlayerTokensOnBoard[i + 1][j - 1] == j - 1 &&
                  locationOfPlayerTokensOnBoard[i + 2][j - 2] == j - 2)
              ) {
                tokenCountDiagonal = 3;
                player.score++;
              }
            }
          }
        }
      }
    }
  };

  const playInitialRound = () => {
    promptLocation();
    gameBoard.addToken(activePlayer, { row, column });
    gameBoard.printGameBoardArrayToConsole();
    checkForPatternMatch(activePlayer, gameBoard.getBoard());
  };

  const playNewRound = () => {
    activePlayer = activePlayer == playerOne ? playerTwo : playerOne;
    promptLocation();
    gameBoard.addToken(activePlayer, { row, column });
    gameBoard.printGameBoardArrayToConsole();
    checkForPatternMatch(activePlayer, gameBoard.getBoard());
  };

  const checkIfGameBoardArrayIsFull = () => {
    let isBoardFull = true;

    const board = gameBoard.getBoard();

    for (let i = 0; i < board.length; i++) {
      let tokensInRow = board[i].reduce((count, value) => {
        if (value == playerOne.token || value == playerTwo.token) return count + 1;
      }, 0);

      if (tokensInRow < 3) {
        isBoardFull = false;
        break;
      }
    }

    return isBoardFull;
  };

  playInitialRound();

  while (
    !(playerOne.score >= 1) &&
    !(playerTwo.score >= 1) &&
    !checkIfGameBoardArrayIsFull()
  ) {
    playNewRound();
  }

  if (playerOne.score >= 1)
    console.log(`${playerOne.name} wins and the score is ${playerOne.score}`);
  else if (playerTwo.score >= 1)
    console.log(`${playerTwo.name} wins and the score is ${playerTwo.score}`);
  else console.log("No player won and hence it's a tie");

  return {};
})();
