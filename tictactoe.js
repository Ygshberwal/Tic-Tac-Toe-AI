const EMPTY = 0, X = 1, O = -1;
let board = Array(9).fill(EMPTY);
let next = X;
let gState = 0;
let isSinglePlayer = false;

// Improved mapping functions
const i2c = (i) => (i === X ? "X" : i === O ? "O" : "B");
const p2c = (i) => (i === X ? person1 : i === O ? person2 : "");

function resetBoard() {
    board.fill(EMPTY);
    next = X;
    gState = 0;
    if (isSinglePlayer && next === X) {
        bestMove(); // AI makes the first move
        gState = checkState();
    }
    updatePage();
}

function updatePage() {
    const e = document.getElementById("next");
    if (gState === 0) {
        e.innerHTML = `<h3>Next Move: ${p2c(next)} (${i2c(next)})</h3>`;
    } else if (gState === 1) {
        e.innerHTML = `<h3>${person1} wins!</h3>`;
    } else if (gState === -1) {
        e.innerHTML = `<h3>${person2} wins!</h3>`;
    } else {
        e.innerHTML = `<h3>It's a draw!</h3>`;
    }
    e.innerHTML += gState !== 0 ? `<button onclick='resetBoard()'>Play Again</button>` : "";

    board.forEach((val, i) => {
        const cell = document.getElementById("td" + i);
        cell.innerHTML = `<img src='${i2c(val)}.png' />`;
        cell.onclick = () => updateEntry(i);
    });
}

function checkState() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (const pattern of winPatterns) {
        const sum = pattern.reduce((acc, idx) => acc + board[idx], 0);
        if (sum === 3 * X) return 1;
        if (sum === 3 * O) return -1;
    }
    return board.includes(EMPTY) ? 0 : 2;
}

function updateEntry(i) {
    if (gState === 0 && board[i] === EMPTY) {
        board[i] = next;
        next = -next;
        gState = checkState();
        updatePage();
        if (isSinglePlayer && gState === 0 && next === X) {
            bestMove(); // AI makes its move
            gState = checkState();
            updatePage();
        }
    }
}

// Mode selection logic with buttons
function selectMode(singlePlayer) {
    isSinglePlayer = singlePlayer;
    if (singlePlayer) {
        person1 = "AI Player X";
        person2 = prompt("Enter name for O: ") || "Player O";
    } else {
        person1 = prompt("Enter name for X: ") || "Player X";
        person2 = prompt("Enter name for O: ") || "Player O";
    }
    resetBoard();
}

// Display mode selection buttons
function displayModeSelection() {
    const container = document.getElementById("mode-selection");
    container.innerHTML = `
        <button onclick="selectMode(true)">Single Player</button>
        <button onclick="selectMode(false)">Multiplayer</button>
    `;
}

// Initialize game
let person1, person2;
displayModeSelection();

