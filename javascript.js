function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];


  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (row,column, player) => {
    if (board[row][column].getValue() === "") {
      board[row][column].addToken(player);
      return true;
  }
  return false;
  };

const checkWinner = () => {
  for (let i = 0; i < rows; i++) {
    if (board[i][0].getValue() !== "" && board[i][0].getValue() === board[i][1].getValue() && board[i][0].getValue() === board[i][2].getValue()) {
      return true;
    }
    if (board[0][i].getValue() !== "" && board[0][i].getValue() === board[1][i].getValue() && board[0][i].getValue() === board[2][i].getValue()) {
      return true;
    }
  }
  // Check diagonals
  if (board[0][0].getValue() !== "" && board[0][0].getValue() === board[1][1].getValue() && board[0][0].getValue() === board[2][2].getValue()) {
    return true;
  }
  if (board[0][2].getValue() !== "" && board[0][2].getValue() === board[1][1].getValue() && board[0][2].getValue() === board[2][0].getValue()) {
    return true;
  }
  return false;
  };


  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };

  return { getBoard, dropToken, checkWinner, printBoard };
}

function Cell() {
  let value = "";

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

function GameController(
  playerOneName = "X",
  playerTwoName = "O"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token:"X"
    },
    {
      name: playerTwoName,
      token: "O"
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    const error = document.querySelector('.error');
    console.log(
      `Dropping ${getActivePlayer().name}'s token into row ${row}, column ${column}...`
    );
    if (board.dropToken(row, column, getActivePlayer().token)) {
      error.textContent = ""
      if(board.checkWinner()){
        error.textContent = `'${getActivePlayer().name} Wins!'`
        }
        else{
      switchPlayerTurn();
      printNewRound();
      }
    } else {
      error.textContent = "Invalid move. Try again."

    }
  };
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');

  const boardDiv = document.querySelector('.board');

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";
  
    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
  
    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
  

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {

        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  }

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    // Make sure I've clicked a cell and not the gaps in between
    if (selectedRow !== undefined && selectedColumn !== undefined) {
      game.playRound(parseInt(selectedRow), parseInt(selectedColumn));
      updateScreen();
    }
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();

  // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

ScreenController();