'use strict';

var WALL = '🟫';
var FOOD = '◽';
var EMPTY = ' ';
var SUPER_FOOD = '💪🏻';
var FOODS_COUNT = 120;
var CHERRY = '🍒';
var gSpawnCherryInterval = null;

var gBoard;
var gGame = {
    score: 0,
    isOn: false
};

function init() {

    gBoard = buildBoard();
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container');
    // console.table(gBoard);

    gGame.isOn = true;
    gGame.score = 0;
    updateScore(gGame.score);
    spawnRandomCherryRepeating();

    var restartBtn = document.querySelector(".restart");
    restartBtn.hidden = true;
    var dead = document.querySelector(".dead");
    dead.hidden = true;
    var victory = document.querySelector('.victory');
    victory.hidden = true;
}

function buildBoard() {
    var rows = 12;
    var cols = 14;
    var board = [];
    for (var i = 0; i < rows; i++) {
        board.push([]);
        for (var j = 0; j < cols; j++) {
            board[i][j] = FOOD;

            if (i === 0 || i === rows - 1 ||
                j === 0 || j === cols - 1 ||
                (i === 4 && j > 4 && j < cols - 5) ||
                (j === 3 && i > 4 && i < rows - 2) ||
                j === 10 && i > 4 && i < rows - 2) {

                board[i][j] = WALL;
            }
        }
    }
    board[1][1] = SUPER_FOOD;
    board[10][1] = SUPER_FOOD;
    board[1][12] = SUPER_FOOD;
    board[10][12] = SUPER_FOOD;


    // board[8][3] = CHERRY;
    return board;
}

function updateScore(value) {
    // Update both the model and the dom for the score
    gGame.score += value;
    document.querySelector('h3 span').innerText = gGame.score;
}


function gameOver() {
    console.log('Game Over');
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    clearInterval(gSpawnCherryInterval);
    gIntervalGhosts = null;
    gSpawnCherryInterval = null;
    var restartBtn = document.querySelector(".restart");
    restartBtn.hidden = false;
    var dead = document.querySelector('.dead');
    dead.hidden = false;
}

function victory() {
    console.log('VICTORY');
    var audioWin = new Audio('sounds/win.mp3');
    audioWin.play();
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    // clearInterval(gSpecialFoodInterval);
    gIntervalGhosts = null;
    var restartBtn = document.querySelector(".restart");
    restartBtn.hidden = false;
    var victory = document.querySelector('.victory');
    victory.hidden = false;
}

function findEmptyCells() {
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        var row = gBoard[i];
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            // console.log('CELL', cell)
            if (cell === EMPTY) {
                var location = {
                    i: i,
                    j: j
                };
                // console.log('LOCATION', location);
                emptyCells.push(location);
            }
        }
    }
    console.log('EMPTY CELLS: ', emptyCells)
    var randomEmptyCellIdx = getRandomIntInclusive(0, emptyCells.length - 1);
    return emptyCells[randomEmptyCellIdx];
}
// cell=gboard[i][j]

function spawnRandomCherry() {
    var randomEmptyCell = findEmptyCells();
    if (typeof randomEmptyCell !== 'undefined') {
        gBoard[randomEmptyCell.i][randomEmptyCell.j] = CHERRY;
        renderCell(randomEmptyCell, CHERRY);
    }
}

function spawnRandomCherryRepeating() {
    gSpawnCherryInterval = setInterval(function() {
        spawnRandomCherry();
    }, 6000);
}