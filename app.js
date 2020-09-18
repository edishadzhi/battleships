// get all DOM elements that will be needed
const gameBoardContainer = document.querySelector(".gameboard");
const progress = document.querySelector(".progress");
const result = document.querySelector(".result");
const btnFire = document.querySelector(".btn-fire");
const btnShow = document.querySelector(".btn-show");
const userInput = document.querySelector(".input");

// set grid rows and columns and the size of each square
let rows = 10;
let cols = 10;
let divSize = 50;

// count the shots taken and keep the location of the ships
let shots = 0;
let battleshipLocation = [];
let destroyerOneLocation = [];
let destroyerTwoLocation = [];

// starting with an empty board of 0s
// later, we will fill this 2d array with 1s, 2s and 3s, according to the following rules
// 0 = empty, 1 = part of a ship, 2 = a sunken part of a ship, 3 = a missed shot
let gameBoard = {
  A: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  B: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  C: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  D: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  E: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  F: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  G: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  H: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  I: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  J: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

// valid letter inputs
let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

// make the grid columns and rows
for (i = 0; i < cols; i++) {
  for (j = 0; j < rows; j++) {
    // create a new div element for each grid cell
    let cell = document.createElement("div");
    gameBoardContainer.appendChild(cell);

    // give each div element a unique id based on its row and column, like "A1"
    switch (j) {
      case 0:
        cell.id = "A" + (i + 1);
        break;
      case 1:
        cell.id = "B" + (i + 1);
        break;
      case 2:
        cell.id = "C" + (i + 1);
        break;
      case 3:
        cell.id = "D" + (i + 1);
        break;
      case 4:
        cell.id = "E" + (i + 1);
        break;
      case 5:
        cell.id = "F" + (i + 1);
        break;
      case 6:
        cell.id = "G" + (i + 1);
        break;
      case 7:
        cell.id = "H" + (i + 1);
        break;
      case 8:
        cell.id = "I" + (i + 1);
        break;
      case 9:
        cell.id = "J" + (i + 1);
        break;
    }

    // set each cell's coordinates: multiples of the current row or column number
    let topPosition = j * divSize;
    let leftPosition = i * divSize;

    // use CSS absolute positioning to place each grid square on the page
    cell.style.top = topPosition + "px";
    cell.style.left = leftPosition + "px";
  }
}

function shoot(row, col) {
  shots++;
  // get the id of the cell so that we can get the div element itself
  let id = row + col;
  let target = document.getElementById(`${id}`);

  col = col - 1;

  // if the player selects a cell with no ship, set the text value of the div element to '-'
  // and report the 'miss' to the user
  if (gameBoard[row][col] == 0) {
    target.innerText = "-";
    result.innerText = `Miss`;

    // set this cell's value to 3 to indicate that the player shot and missed
    gameBoard[row][col] = 3;

    // if the player selects a cell with a ship, set the text value of the div element to 'x',
    // change the background color and report the 'hit' to the user
  } else if (gameBoard[row][col] == 1) {
    target.innerText = "x";
    target.style.backgroundColor = "#ccc";
    result.innerText = `A ship has been hit`;

    // set this cell's value to 2 to indicate the ship has been hit
    gameBoard[row][col] = 2;

    // if the player selects a cell that's been previously hit, let them know
  } else if (gameBoard[row][col] > 1) {
    result.innerText = `You already shot at this location and are now wasting shots`;
  }

  // check if a particular ship has been destroyed entirely

  let battleshipSunk = battleshipLocation.every((location) =>
    checkIfHit(location)
  );
  let destroyerOneSunk = destroyerOneLocation.every((location) =>
    checkIfHit(location)
  );
  let destroyerTwoSunk = destroyerTwoLocation.every((location) =>
    checkIfHit(location)
  );

  // give feedback to the user depending on the number of ships destroyed

  if (
    battleshipSunk == true ||
    destroyerOneSunk == true ||
    destroyerTwoSunk == true
  ) {
    progress.innerText = `You sank a ship`;
  }

  if (
    (battleshipSunk == true && destroyerOneSunk == true) ||
    (battleshipSunk == true && destroyerTwoSunk == true) ||
    (destroyerOneSunk == true && destroyerTwoSunk == true)
  ) {
    progress.innerText = `You sank a second ship`;
  }

  // if all ships have been destroyed, signal to the player that he has won,
  // as well as the number of shots taken, and after 5 seconds reload the page
  if (
    battleshipSunk == true &&
    destroyerOneSunk == true &&
    destroyerTwoSunk == true
  ) {
    progress.innerText = `Well done! You completed the game in ${shots} shots!`;

    setTimeout(() => {
      alert("The game is about to reload so that you can play again!");
      location.reload();
    }, 5000);
  }
}

// check if the user's input is of a valid format
function parseGuess(guess) {
  if (guess === null || guess.length > 3 || guess.length < 2) {
    alert(
      "Wrong format, please enter a letter and a number to indicate a cell."
    );
  } else {
    let firstChar = guess.charAt(0);
    let row = alphabet.indexOf(firstChar);
    let column = guess.charAt(1) + guess.charAt(2);
    if (isNaN(row) || isNaN(column)) {
      alert("Wrong input, that is not on the board");
      return false;
    } else if (row < 0 || row > rows - 1 || column < 1 || column > cols) {
      alert("Wrong input, that is not on the board");
      return false;
    } else {
      return true;
    }
  }
}

// generate a new ship of given length at a random location
// and make sure it does not overlap with an existing one
function generateRandomLocationShip(shipLength) {
  let newShip;

  // generate the location at a random direction and
  // with random coordinates
  function generator() {
    let direction = Math.floor(Math.random() * 2);
    let row, col;

    if (direction === 1) {
      // horizontal
      row = Math.floor(Math.random() * rows);
      col = Math.floor(Math.random() * (cols - shipLength));
    } else {
      // vertical
      row = Math.floor(Math.random() * (rows - shipLength));
      col = Math.floor(Math.random() * cols);
    }

    row = alphabet[row];

    // starting with an empty 2d array following the model of the gameboard
    newShip = {
      A: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      B: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      C: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      D: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      E: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      F: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      G: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      H: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      I: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      J: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };

    // fill the 2d array with 1s to indicate the ship's location
    for (let i = 0; i < shipLength; i++) {
      if (direction === 1) {
        newShip[row][col + i] = 1;
      } else {
        let rowIndex = alphabet.indexOf(row) + 1;
        row = alphabet[rowIndex];
        newShip[row][col] = 1;
      }
    }
  }

  generator();

  // check to see if the new ship overlaps with an existing one
  function checkForOverlapping() {
    let overlaps = false;
    for (let row in gameBoard) {
      for (let i = 0; i < 10; i++) {
        if (gameBoard[row][i] == 1 && newShip[row][i] == 1) {
          overlaps = true;
          return overlaps;
        }
      }
    }
  }

  // keep generating the ship at a new location by running the
  // 'generator' function until there is a ship that does not overlap
  while (checkForOverlapping() == true) {
    generator();
  }

  populateGameBoard();

  // fill the gameboard with 1s to indicate the new ship's location
  function populateGameBoard() {
    for (let row in gameBoard) {
      for (let i = 0; i < 10; i++) {
        if (newShip[row][i] == 1) {
          gameBoard[row][i] = 1;
        }
      }
    }
  }

  return newShip;
}

// specify each ship's length, generate it and save its location on a global variable
function generateShips() {
  let battleshipLength = 5;
  let destroyerLength = 4;

  let battleship = generateRandomLocationShip(battleshipLength);
  let destroyerOne = generateRandomLocationShip(destroyerLength);
  let destroyerTwo = generateRandomLocationShip(destroyerLength);

  battleshipLocation = getShipLocation(battleship);
  destroyerOneLocation = getShipLocation(destroyerOne);
  destroyerTwoLocation = getShipLocation(destroyerTwo);
}

// get an array of the specific cell's coordinates, like ['A1', 'A2', 'A3', 'A4']
function getShipLocation(ship) {
  let location = [];

  for (let row in ship) {
    for (let i = 0; i < 10; i++) {
      if (ship[row][i] == 1) {
        location.push(row + (i + 1));
      }
    }
  }

  return location;
}

// check if a ship has taken a hit
function checkIfHit(location) {
  let row = location.charAt(0);
  let col = location.charAt(1) + location.charAt(2);
  if (gameBoard[row][col - 1] == 2) {
    return true;
  } else {
    return false;
  }
}

// show command to aid debugging and backdoor cheat
function show() {
  for (let row in gameBoard) {
    for (let i = 0; i < 10; i++) {
      if (gameBoard[row][i] == 1) {
        let id = row + (i + 1);
        let cell = document.getElementById(`${id}`);
        cell.innerText = "x";
      }
    }
  }
}

// event listeners

// get user input and run a check to see if it is valid
btnFire.addEventListener("click", () => {
  let guess = userInput.value.toUpperCase();
  userInput.value = "";
  let correctGuess = parseGuess(guess);
  if (correctGuess) {
    shoot(guess.charAt(0), guess.charAt(1) + guess.charAt(2));
  }
});

// provide the backdoor cheat to make sure everything works correctly
btnShow.addEventListener("click", () => {
  show();
});

//init game
generateShips();
