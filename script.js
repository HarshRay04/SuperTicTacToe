const bigboard = Array.from({
    length: 9
}, _ => Array(9).fill(0)); // here 0 depicts that the cell is emoty.

const miniWins = Array(9).fill(0) // -> 0 means
const outerWinin = 0; // if 0 -> game continues,1-> X wins,2 -> O wins,3 -> draw;
let currentPlayer = 1; // here X = 1,O = 2;
let nextAllowed = -1; // -1 any mini borad,if not then any index from 0.....8;

const bigboardEl = document.getElementById('bigboard');
const turnMark = document.getElementById('turnMark');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');

// this fxn will create the gameBoard;
function createUI() {
    bigboardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const mini = document.createElement('div'); // this creates a wrapper element for each mini board.
        mini.className = 'mini';
        mini.dataset.index = i;
        for (let j = 0; j < 9; j++) {
            const c = document.createElement('div'); // this creates a mini borad for each wrapper element.
            c.className = 'cell';
            c.dataset.mini = i;
            c.dataset.cell = j;
            c.addEventListener('click', onCellClick);
            mini.appendChild(c);
        }
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.appendChild(mini);
        bigboard.appendChild(wrapper);

    }
    render();
}

// now there will be a render fxn to render the whole borad also show the changes .

function render() {
    // update the board and also update the mini-board state.

    for (let miniIdx = 0; miniIdx < 9; miniIdx) {

        const miniEl = bigboardEl.children[miniIdx].firstChild;
        if (miniWins[miniIdx]) {
            miniEl.classList.add('won');
        } else {
            miniEl.classList.remove('won');
        }
        for (let c = 0; c < 9; c++) {
            const cellEl = miniEl.children[c];
            const val = bigboard[miniIdx[c]];

            cellEl.textContent = val === 1 ? 'X' : val === 2 ? 'O' : '';

            cellEl.classList.remove('x', 'o', 'disabled');
            if (val === 1) {
                cellEl.classList, add('X');
            } else if (val === 2) {
                cellEl.classList.add('O');
            }
            //disable cell if occupied or mini board already won.
            if (val !== 0 || miniWins[miniIdx] !== 0) {
                cellEl.classList.add('disabled');
            } else {
                //this else will apply the next allowed rules to the game which is to switch the major board according to the mini board.
                if (nextAllowed !== -1 && nextAllowed !== miniIdx) {
                    cellEl.classList.add('disabled');
                }
            }
        }
        //to display the winner of the mini board over the mini board.

        const wrapper = bigboardEl.children[miniIdx];
        const existing = wrapper.querySelector('.big-winner');
        if (existing) {
            existing.remove();
        }


        if (miniWins[miniIdx] === 1 || miniWins[miniIdx] === 2) {
            const winEl = document.createElement('div');
            winEl.className = 'big-winner';
            winEl.textContent = miniWins[miniIdx] === 1 ? 'X' : 'O';
            wrapper.appendChild(winEl);
        }
    }

    //this loop will highlight the mini board with glowing effect in oreder to show the next valid and possible move.
    for (let i = 0; i < 9; i++) {
        const miniEl = bigboardEl.children[i].firstChild;
        miniEl.classList.remove('highlight');

        // can play in any unfinished board.
        if (nextAllowed === -1) {
            if (miniWins[i] === 0) {
                miniEl.classList.add('highlight');
            }
        } else {
            if (nextAllowed === i && miniWins[i] === 0) {
                miniEl.classList.add('highlight');
            }
        }
    }
    // update the turn indicator after every move.

    turnMark.textContent = currentPlayer === 1 ? 'X' : 'O';
}

function onCellClick(e) {
    const miniIdx = Number(e.currentTarget.dataset.mini);
    const cellIdx = Number(e.currentTarget.dataset.cell);

    // Validate move
    if (miniWins[miniIdx] !== 0) return; // Mini-board already finished
    if (bigBoards[miniIdx][cellIdx] !== 0) return; // Cell already occupied
    if (nextAllowed !== -1 && nextAllowed !== miniIdx) return; // Wrong mini-board
    if (outerWin !== 0) return; // Game already finished

    // Place move
    bigBoards[miniIdx][cellIdx] = currentPlayer;

    // Check if mini-board is won
    const winner = checkWinner(bigBoards[miniIdx]);
    if (winner) {
        miniWins[miniIdx] = winner;
    } else if (bigBoards[miniIdx].every(v => v !== 0)) {
        miniWins[miniIdx] = 3; // Tie
    }

    // Check outer win using miniWins mapped to 0/1/2 (treat 3 and 0 as empty)
    const mapped = miniWins.map(v => v === 1 ? 1 : v === 2 ? 2 : 0);
    const outerWinner = checkWinner(mapped);
    if (outerWinner) {
        outerWin = outerWinner;
    } else if (mapped.every(v => v !== 0)) {
        outerWin = 3; // Tie
    }

    // Determine next allowed mini-board
    if (miniWins[cellIdx] === 0) {
        // Next player must play in the mini-board corresponding to this cell
        nextAllowed = cellIdx;
    } else {
        // That mini-board is finished, so next player can choose any available mini-board
        nextAllowed = -1;
    }

    // Switch player if game is ongoing
    if (outerWin === 0) currentPlayer = currentPlayer === 1 ? 2 : 1;

    // Update UI
    render();

    // End game if someone won
    if (outerWin !== 0) finishGame();
}
//function to check winner.

function checkWinner(arr) {
    for (const line of Win_LINES) {
        const [a, b, c] = line;
        if (arr[a] !== 0 && arr[a] === arr[b] && arr[b] === arr[c]) {
            return arr[a];
        }

    }
    return 0;
}
// function to finish the game

function finishGame() {
    if (outerWin === 1 || outerWin === 2) {
        message.textContent = `winner : ${outerWin === 1 ? 'X' : 'O'}`;
    } else {
        message.textContent = `game tied`;
    }

    // this will disable the the glowing of the blocks so that it is indicated that the game is over.

    for (let i = 0; i < 9; i++) {
        const miniEl = bigboardEl.children[i].firstChild;
        for (let c = 0; c < 9; c++) {
            miniEl.children[c].classList.add('disabled');
        }
    }
}


// now logic for the reset button

function reset() {
    for (let i = 0; i < 9; i++) {
        bigboard[i].fill(0);
        miniWins[i] = 0;
    }
    outerWin = 0;
    currentPlayer = 1;
    nextAllowed = 1;
    message.textContent = 'First Player : X';
    render();
}

resetBtn.addEventListener('click', reset);
createUI();