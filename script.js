const gameBoard = (function createGameBoard() {
  const gameBoardArray = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ];

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

  return { getBoard, addToken };
})();

const gameController = (function () {
  const _playerFactory = (name, token) => {
    let score = 0;
    return { name, token, score };
  };

  const playerOne = _playerFactory("Player X", "X");
  const playerTwo = _playerFactory("Player O", "O");

  let activePlayer = playerTwo;

  const _checkForPatternMatch = (player, board) => {
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
    const patternMatch = _checkForPatternMatch(activePlayer, gameBoard.getBoard());
    const isBoardFull = _checkIfGameBoardArrayIsFull();
    return `${Number(patternMatch)}${Number(isBoardFull)}`;
  };

  const _checkIfGameBoardArrayIsFull = () => {
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

  const getPlayerOne = () => playerOne;

  const getPlayerTwo = () => playerTwo;

  return { playRound, getActivePlayer, getPlayerOne, getPlayerTwo };
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
        if ((j == 1) & (i == 1)) {
          cell.style.borderWidth = "8px 8px";
        } else {
          if (j == 1) cell.style.borderWidth = "0px 8px";

          if (i == 1) cell.style.borderWidth = "8px 0px";
        }
        cell.addEventListener("click", boardClickHandler);
        boardDiv.appendChild(cell);
      }
    }
  };

  const updateScore = () => {
    if (gameController.getActivePlayer().name == "Player X") {
      const playerScore = document.querySelector(".player-one-score");
      playerScore.textContent = gameController.getActivePlayer().score;
    } else {
      const playerScore = document.querySelector(".player-two-score");
      playerScore.textContent = gameController.getActivePlayer().score;
    }
  };

  const highlightNextPlayer = () => {
    if (gameController.getActivePlayer().name == "Player X") {
      const activePlayerHighlight = document.querySelector(".player:last-of-type");
      activePlayerHighlight.style.backgroundColor = "rgb(255 122 245)";
    } else {
      const activePlayerHighlight = document.querySelector(".player:first-of-type");
      activePlayerHighlight.style.backgroundColor = "rgb(212 143 255)";
    }
  };

  const unhighlightActivePlayer = () => {
    if (gameController.getActivePlayer().name == "Player X") {
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
    if (gameController.getActivePlayer().name == "Player X") {
      cell.style.color = "rgb(170 60 238)";
    } else {
      cell.style.color = "rgb(203 37 191)";
    }
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
        dialog.classList.add("game-result");

        const gameResultMessage = document.createElement("div");
        gameResultMessage.classList.add("game-result-message");

        if (Number(gameOver[0]) && Number(gameOver[1])) {
          gameResultMessage.textContent = `${
            gameController.getActivePlayer().userEnteredName
          } won !`;
        } else {
          if (Number(gameOver[0]) == 1)
            gameResultMessage.textContent = `${
              gameController.getActivePlayer().userEnteredName
            } won !`;

          if (Number(gameOver[1]) == 1)
            gameResultMessage.textContent = "A tie has occurred";
        }

        const playNewGameButton = document.createElement("a");
        playNewGameButton.classList.add("play-again-button");
        playNewGameButton.setAttribute("href", "index.html");
        playNewGameButton.textContent = "PLAY NEW GAME";

        dialog.appendChild(gameResultMessage);
        dialog.appendChild(playNewGameButton);
        body.appendChild(dialog);
        dialog.showModal();
      } else {
        setTimeout(highlightNextPlayer, 200);
      }
    }
  };

  const storePlayerNames = (playerX, playerO) => {
    gameController.getPlayerOne().userEnteredName = playerX;
    gameController.getPlayerTwo().userEnteredName = playerO;
  };

  const startGame = () => {
    const enterUserDetailsDialogBox = document.querySelector(
      ".player-details-dialog"
    );
    enterUserDetailsDialogBox.showModal();
    const startGameButton = document.querySelector(".start-game-button");
    startGameButton.addEventListener("click", () => {
      const playerXName = document.querySelector("input#player-x-name");
      const playerOName = document.querySelector("input#player-o-name");
      storePlayerNames(playerXName.value, playerOName.value);
      enterUserDetailsDialogBox.close();

      const header = document.querySelector("header");

      const gameName = document.createElement("h1");
      gameName.textContent = "Tic Tac Toe";

      header.appendChild(gameName);

      const playerXDiv = document.querySelector(".player:first-of-type");

      const playerXNameElement = document.createElement("h3");
      playerXNameElement.textContent = `Player One(X): ${playerXName.value}`;

      const playerXScoreElement = document.createElement("h3");
      playerXScoreElement.textContent = `Score: `;

      const playerXScore = document.createElement("span");
      playerXScore.textContent = `0`;
      playerXScore.classList.add("player-one-score");

      playerXScoreElement.appendChild(playerXScore);

      playerXDiv.appendChild(playerXNameElement);
      playerXDiv.appendChild(playerXScoreElement);

      const playerODiv = document.querySelector(".player:last-of-type");

      const playerONameElement = document.createElement("h3");
      playerONameElement.textContent = `Player Two(O): ${playerOName.value}`;

      const playerOScoreElement = document.createElement("h3");
      playerOScoreElement.textContent = `Score: `;

      const playerOScore = document.createElement("span");
      playerOScore.textContent = `0`;
      playerOScore.classList.add("player-two-score");

      playerOScoreElement.appendChild(playerOScore);

      playerODiv.appendChild(playerONameElement);
      playerODiv.appendChild(playerOScoreElement);

      createBoard();

      highlightNextPlayer();
    });
  };

  startGame();
})();
