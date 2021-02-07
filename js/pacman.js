'use strict';

var gPacman;
var PACMAN = '<img class="pac" src="img/pacman.png" />';

function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 5
        },
        isSuper: false
    };
    board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(eventKeyboard) {
    if (!gGame.isOn) return;
    // console.log('eventKeyboard:', eventKeyboard);

    var nextLocation = getNextLocation(eventKeyboard);
    // User pressed none-relevant key in the keyboard
    if (!nextLocation) return;

    var nextCell = gBoard[nextLocation.i][nextLocation.j];

    // Hitting a WALL, not moving anywhere
    if (nextCell === WALL) return;

    // Hitting FOOD? update score
    if (nextCell === FOOD) {
        updateScore(1);
        var audioEat = new Audio('sounds/bite.wav');
        audioEat.play();
    }

    if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper) return;
        updateScore(1);
        handleSuperFood();

    }

    if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            var currGhostIdx;
            var isEatenGhost = false;
            for (var i = 0; i < gGhosts.length; i++) {
                var currGhost = gGhosts[i];
                if (isEatenGhost) {
                    currGhost.Idx--;
                }
                if (currGhost.location.i === nextLocation.i && currGhost.location.j === nextLocation.j) {
                    currGhostIdx = currGhost.Idx;
                    isEatenGhost = true;
                    renderCell(currGhost.location, EMPTY);
                    //  console.log('Ghost EATEN:' ,currGhost);
                }
            }

            if (currGhostIdx !== null) {
                gGhosts.splice(currGhostIdx, 1);
            }

        } else {
            gameOver();
            renderCell(gPacman.location, EMPTY);
            return;
        }

    }
    if (nextCell === CHERRY) {
        updateScore(10);
    }

    // Update the model to reflect movement
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    // Update the DOM
    renderCell(gPacman.location, EMPTY);

    // Update the pacman MODEL to new location  
    gPacman.location = nextLocation;

    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
    // Render updated model to the DOM
    renderCell(gPacman.location, PACMAN);

    if (gGame.score >= FOODS_COUNT) {
        victory();
    }
}

function getNextLocation(keyboardEvent) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    };
    // transform: rotate(90deg);
    switch (keyboardEvent.code) {
        case 'ArrowUp':
            if (gPacman.isSuper) {
                PACMAN = '<img class="pac" src="img/super.png" style = "transform: rotate(270deg)" />';
                nextLocation.i--;
            } else {
                PACMAN = '<img class="pac" src="img/pacman.png" style = "transform: rotate(270deg)" />';
                nextLocation.i--;
            }
            break;
        case 'ArrowDown':
            if (gPacman.isSuper) {
                PACMAN = '<img class="pac" src="img/super.png" style = "transform: rotate(90deg)" />';
                nextLocation.i++;
            } else {
                PACMAN = '<img class="pac" src="img/pacman.png" style = "transform: rotate(90deg)" />';
                nextLocation.i++;
            }
            break;
        case 'ArrowLeft':
            if (gPacman.isSuper) {
                PACMAN = '<img class="pac" src="img/super.png" style = "transform: scaleX(-1);" />';
                nextLocation.j--;
            } else {
                PACMAN = '<img class="pac" src="img/pacman.png" style = "transform: scaleX(-1);" />';
                nextLocation.j--;
            }
            break;
        case 'ArrowRight':
            if (gPacman.isSuper) {
                PACMAN = '<img class="super-pac" src="img/super.png" />';
                nextLocation.j++;
            } else {
                PACMAN = '<img class="pac" src="img/pacman.png"/>';
                nextLocation.j++;
            }
            break;
        default:
            return null;
    }
    return nextLocation;
}

function handleSuperFood() {
    gPacman.isSuper = true;
    PACMAN = '<img class="super-pac" src="img/super.png" />'
    console.log('SUPER-ON')
    setTimeout(function() {
        gPacman.isSuper = false;
        PACMAN = '&#128513';
        console.log('SUPER-OFF')
        for (var i = 0; i < gGhosts.length; i++) {
            var currGhost = gGhosts[i];
            currGhost.color = getRandomColor();
            renderCell(currGhost.location, getGhostHTML(currGhost));
        }

        // This creates ghosts after they were eaten
        // ghostNumCount is the number of ghosts that we have in the array after they were eaten during the SUPER ON
        var ghostNumCount = gGhosts.length;
        var maxNumOfGhosts = 3;
        for (var i = 0; i < maxNumOfGhosts; i++) {
            // this checks when the number of ghosts is smaller then 3 and creates more until the total amount of ghosts is 3
            if (i >= ghostNumCount) {
                createGhost(gBoard);
            }
        }
    }, 5000)

    for (var i = 0; i < gGhosts.length; i++) {
        var currGhost = gGhosts[i];
        currGhost.color = 'blue';
        renderCell(currGhost.location, getGhostHTML(currGhost));
    }
}