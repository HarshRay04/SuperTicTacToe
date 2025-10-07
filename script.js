// ---------------- Super Tic Tac Toe -----------------

// Winning combinations (for mini and outer boards)
const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Data initialization
const bigboard = Array.from({
    length: 9
}, () => Array(9).fill(0)); // 0 = empty
const miniWins = Array(9).fill(0); // 0 = ongoing, 1 = X, 2 = O, 3 = draw
let outerWin = 0;
let currentPlayer = 1; // 1 = X, 2 = O
let nextAllowed = -1; // -1 = any mini-board

// DOM references
const bigboardEl = document.getElementById('bigboard');
const turnMark = document.getElementById('turnMark');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');

// Create full 9x9 UI
function createUI() {
    bigboardEl.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const mini = document.createElement('div');
        mini.className = 'mini';
        mini.dataset.index = i;

        for (let j = 0; j < 9; j++) {
            const c = document.createElement('div');
            c.className = 'cell';
            c.dataset.mini = i;
            c.dataset.cell = j;
            c.addEventListener('click', onCellClick);
            mini.appendChild(c);
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'mini-wrapper';
        wrapper.style.position = 'relative';
        wrapper.appendChild(mini);
        bigboardEl.appendChild(wrapper);
    }

    render();
}

// Render entire game board
function render() {
    for (let miniIdx = 0; miniIdx < 9; miniIdx++) {
        const miniEl = bigboardEl.children[miniIdx].firstChild;

        // mini board win highlight
        if (miniWins[miniIdx]) miniEl.classList.add('won');
        else miniEl.classList.remove('won');

        for (let c = 0; c < 9; c++) {
            const cellEl = miniEl.children[c];
            const val = bigboard[miniIdx][c];

            // text and class
            cellEl.textContent = val === 1 ? 'X' : val === 2 ? 'O' : '';
            cellEl.classList.remove('x', 'o', 'disabled');
            if (val === 1) cellEl.classList.add('x');
            else if (val === 2) cellEl.classList.add('o');

            // disable if occupied or not allowed
            if (val !== 0 || miniWins[miniIdx] !== 0)
                cellEl.classList.add('disabled');
            else if (nextAllowed !== -1 && nextAllowed !== miniIdx)
                cellEl.classList.add('disabled');
        }

        // show big winner if exists
        const wrapper = bigboardEl.children[miniIdx];
        const existing = wrapper.querySelector('.big-winner');
        if (existing) existing.remove();

        if (miniWins[miniIdx] === 1 || miniWins[miniIdx] === 2) {
            const winEl = document.createElement('div');
            winEl.className = 'big-winner';
            winEl.textContent = miniWins[miniIdx] === 1 ? 'X' : 'O';
            wrapper.appendChild(winEl);
        }
    }

    // highlight next playable mini boards
    for (let i = 0; i < 9; i++) {
        const miniEl = bigboardEl.children[i].firstChild;
        miniEl.classList.remove('highlight');

        if (nextAllowed === -1 && miniWins[i] === 0)
            miniEl.classList.add('highlight');
        else if (nextAllowed === i && miniWins[i] === 0)
            miniEl.classList.add('highlight');
    }

    // update turn text
    if (turnMark)
        turnMark.textContent = `Current Turn: ${currentPlayer === 1 ? 'X' : 'O'}`;
}

// Handle cell clicks
function onCellClick(e) {
    const miniIdx = Number(e.currentTarget.dataset.mini);
    const cellIdx = Number(e.currentTarget.dataset.cell);

    // validation
    if (miniWins[miniIdx] !== 0) return;
    if (bigboard[miniIdx][cellIdx] !== 0) return;
    if (nextAllowed !== -1 && nextAllowed !== miniIdx) return;
    if (outerWin !== 0) return;

    // place move
    bigboard[miniIdx][cellIdx] = currentPlayer;

    // check mini board winner
    const winner = checkWinner(bigboard[miniIdx]);
    if (winner) miniWins[miniIdx] = winner;
    else if (bigboard[miniIdx].every(v => v !== 0)) miniWins[miniIdx] = 3;

    // check overall winner
    const mapped = miniWins.map(v => (v === 1 ? 1 : v === 2 ? 2 : 0));
    const outerWinner = checkWinner(mapped);
    if (outerWinner) outerWin = outerWinner;
    else if (mapped.every(v => v !== 0)) outerWin = 3;

    // next allowed mini board
    nextAllowed = miniWins[cellIdx] === 0 ? cellIdx : -1;

    // switch player if game not finished
    if (outerWin === 0) currentPlayer = currentPlayer === 1 ? 2 : 1;

    render();
    if (outerWin !== 0) finishGame();
}

// Check winner logic
function checkWinner(arr) {
    for (const [a, b, c] of WIN_LINES)
        if (arr[a] && arr[a] === arr[b] && arr[a] === arr[c])
            return arr[a];
    return 0;
}

// Game finished
function finishGame() {
    if (outerWin === 3)
        message.textContent = 'Game tied!';
    else
        message.textContent = `Winner: ${outerWin === 1 ? 'X' : 'O'}`;

    for (let i = 0; i < 9; i++) {
        const miniEl = bigboardEl.children[i].firstChild;
        for (let c = 0; c < 9; c++)
            miniEl.children[c].classList.add('disabled');
    }
}

// Reset button handler
function reset() {
    for (let i = 0; i < 9; i++) {
        bigboard[i].fill(0);
        miniWins[i] = 0;
    }
    outerWin = 0;
    currentPlayer = 1;
    nextAllowed = -1;
    message.textContent = 'First Player: X';
    render();
}

// Event listener and init
resetBtn.addEventListener('click', reset);
createUI();