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
      return true;
    } else {
      console.log("This cell is already marked, choose a new cell");
      return false;
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

  let activePlayer = playerTwo;

  const checkForPatternMatch = (player, board) => {
    const locationOfPlayerTokensOnBoard = [[], [], []];

    board.forEach((row, row_index) => {
      row.forEach((cell, cell_index) => {
        if (cell == player.token)
          locationOfPlayerTokensOnBoard[row_index][cell_index] = cell_index;
      });
    });

    console.log(locationOfPlayerTokensOnBoard);

    let patternMatch = false;

    for (let i = 0; i < locationOfPlayerTokensOnBoard.length; i++) {
      let tokenCountHorizontal = 0,
        tokenCountVertical = 0,
        tokenCountDiagonal = 0;

      if (locationOfPlayerTokensOnBoard[i].length) {
        tokenCountHorizontal = locationOfPlayerTokensOnBoard[i].reduce((count) => {
          return count + 1;
        }, 0);
        if (tokenCountHorizontal == 3) {
          player.score++;
          patternMatch = true;
        }

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
                patternMatch = true;
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
                patternMatch = true;
              }
            }
          }
        }
      }
    }
    return patternMatch;
  };

  const playRound = (row, column) => {
    activePlayer = activePlayer == playerOne ? playerTwo : playerOne;

    let isTokenAdded = gameBoard.addToken(activePlayer, { row, column });
    while (!isTokenAdded) {
      isTokenAdded = gameBoard.addToken(activePlayer, { row, column });
    }
    gameBoard.printGameBoardArrayToConsole();
    const patternMatch = checkForPatternMatch(activePlayer, gameBoard.getBoard());
    const isBoardFull = checkIfGameBoardArrayIsFull();
    return `${Number(patternMatch)}${Number(isBoardFull)}`;
  };

  const checkIfGameBoardArrayIsFull = () => {
    let isBoardFull = true;

    const board = gameBoard.getBoard();

    for (let i = 0; i < board.length; i++) {
      let tokensInRow = board[i].reduce((count, value) => {
        if (value == playerOne.token || value == playerTwo.token) return count + 1;
        else return count;
      }, 0);

      if (tokensInRow < 3) {
        isBoardFull = false;
        break;
      }
    }

    return isBoardFull;
  };

  const getActivePlayer = () => activePlayer;

  return { playRound, getActivePlayer };
})();

const displayController = (function () {
  const createBoard = () => {
    const boardDiv = document.querySelector(".tic-tac-toe-grid");
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement("button");
        cell.setAttribute("data-row", `${i}`);
        cell.setAttribute("data-column", `${j}`);
        cell.classList.add("cell");
        cell.addEventListener("click", boardClickHandler);
        boardDiv.appendChild(cell);
      }
    }
  };

  const updateScore = () => {
    if (gameController.getActivePlayer().name == "Declan") {
      const playerScore = document.querySelector(".player-one-score");
      playerScore.textContent = gameController.getActivePlayer().score;
    } else {
      const playerScore = document.querySelector(".player-two-score");
      playerScore.textContent = gameController.getActivePlayer().score;
    }
  };

  const highlightNextPlayer = () => {
    if (gameController.getActivePlayer().name == "Declan") {
      const activePlayerHighlight = document.querySelector(".player:last-of-type");
      activePlayerHighlight.classList.add("player-highlight");
    } else {
      const activePlayerHighlight = document.querySelector(".player:first-of-type");
      activePlayerHighlight.classList.add("player-highlight");
    }
  };

  const unhighlightActivePlayer = () => {
    if (gameController.getActivePlayer().name == "Declan") {
      const activePlayerHighlight = document.querySelector(".player:first-of-type");
      activePlayerHighlight.style.backgroundColor = "white";
    } else {
      const activePlayerHighlight = document.querySelector(".player:last-of-type");
      activePlayerHighlight.style.backgroundColor = "white";
    }
  };

  const updateBoard = (row, column) => {
    const cell = document.querySelector(
      `button[data-row="${row}"][data-column="${column}"]`
    );
    cell.textContent = gameController.getActivePlayer().token;
  };

  const boardClickHandler = (e) => {
    if (!e.target.textContent) {
      const gameOver = gameController.playRound(
        e.target.getAttribute("data-row"),
        e.target.getAttribute("data-column")
      );

      updateBoard(
        e.target.getAttribute("data-row"),
        e.target.getAttribute("data-column")
      );

      unhighlightActivePlayer();

      updateScore();

      if (Number(gameOver)) {
        const body = document.querySelector("body");

        const dialog = document.createElement("dialog");
        const gameResultMessage = document.createElement("div");
        gameResultMessage.classList.add("game-result-message");

        if (Number(gameOver[0]) && Number(gameOver[1])) {
          gameResultMessage.textContent = `${
            gameController.getActivePlayer().name
          } won`;
        } else {
          if (Number(gameOver[0]) == 1)
            gameResultMessage.textContent = `${
              gameController.getActivePlayer().name
            } won`;

          if (Number(gameOver[1]) == 1)
            gameResultMessage.textContent = "A Tie has occurred";
        }

        const playNewGameButton = document.createElement("a");
        playNewGameButton.classList.add("play-again-button");
        playNewGameButton.setAttribute("href", "index.html");
        playNewGameButton.textContent = "Play New Game";

        dialog.appendChild(gameResultMessage);
        dialog.appendChild(playNewGameButton);
        body.appendChild(dialog);
        dialog.showModal();
      } else {
        setTimeout(highlightNextPlayer, 200);
      }
    }
  };

  createBoard();

  highlightNextPlayer();
})();
