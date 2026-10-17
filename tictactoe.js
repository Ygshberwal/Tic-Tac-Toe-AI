const EMPTY = 0, X = 1, O = -1;
let board = Array(9).fill(EMPTY);
let next = X;
let gState = 0;
let isSinglePlayer = false;
let aiPlayer = X;
let alternateStarter = false;
let humanName = "";

// Improved mapping functions
const i2c = (i) => (i === X ? "X" : i === O ? "O" : "b");
const p2c = (i) => (i === X ? person1 : i === O ? person2 : "");

function resetBoard(nextRound = false) {
    if (isSinglePlayer) {
        if (alternateStarter && nextRound) aiPlayer = -aiPlayer;
        person1 = aiPlayer === X ? "AI Player X" : humanName;
        person2 = aiPlayer === O ? "AI Player O" : humanName;
    }
    board.fill(EMPTY);
    next = X;
    gState = 0;
    if (isSinglePlayer && next === aiPlayer) {
        bestMove(); // AI makes the first move
        gState = checkState();
    }
    updatePage();
}

function updatePage() {
    document.getElementById("player-info").textContent = isSinglePlayer
        ? `You: ${i2c(-aiPlayer)} | AI: ${i2c(aiPlayer)}${alternateStarter ? " | Alternating starters" : ""}`
        : `X: ${person1} | O: ${person2}`;
    const e = document.getElementById("next");
    const status = document.createElement("h3");
    if (gState === 0) {
        status.textContent = `Next Move: ${p2c(next)} (${i2c(next)})`;
    } else if (gState === 1) {
        status.textContent = `${person1} wins!`;
    } else if (gState === -1) {
        status.textContent = `${person2} wins!`;
    } else {
        status.textContent = "It's a draw!";
    }
    e.replaceChildren(status);
    if (gState !== 0) {
        const playAgain = document.createElement("button");
        playAgain.textContent = "Play Again";
        playAgain.onclick = () => resetBoard(true);
        e.appendChild(playAgain);
    }

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
        if (isSinglePlayer && gState === 0 && next === aiPlayer) {
            bestMove(); // AI makes its move
            gState = checkState();
            updatePage();
        }
    }
}

// Mode selection logic with buttons
function selectMode(singlePlayer, humanFirst) {
    if (singlePlayer && humanFirst === undefined) {
        document.getElementById("mode-selection").innerHTML = `
            <h3>Who plays first?</h3>
            <button onclick="selectMode(true, true)">You first (X)</button>
            <button onclick="selectMode(true, false)">AI first (X)</button>
            <button onclick="selectMode(true, 'alternate')">Alternate (you start)</button>
            <button onclick="displayModeSelection()">Back</button>
        `;
        return;
    }
    isSinglePlayer = singlePlayer;
    alternateStarter = singlePlayer && humanFirst === "alternate";
    if (singlePlayer) {
        aiPlayer = humanFirst ? O : X;
        humanName = prompt(`Enter name for ${i2c(-aiPlayer)}: `) || `Player ${i2c(-aiPlayer)}`;
    } else {
        person1 = prompt("Enter name for X: ") || "Player X";
        person2 = prompt("Enter name for O: ") || "Player O";
    }
    displayModeSelection();
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
