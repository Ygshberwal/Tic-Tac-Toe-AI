const EMPTY = 0, X = 1, O = -1;
const WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];
let board = Array(9).fill(EMPTY);
let next = X;
let gState = 0;
let isSinglePlayer = false;
let aiPlayer = X;
let alternateStarter = false;
let humanName = "";
let setupSinglePlayer = true;
let scores = { first: 0, second: 0, draws: 0 };
let roundCounted = false;

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
    roundCounted = false;
    if (isSinglePlayer && next === aiPlayer) {
        bestMove(); // AI makes the first move
        updateGameState();
    }
    updatePage();
    const firstEmpty = board.indexOf(EMPTY);
    if (firstEmpty !== -1) document.getElementById("td" + firstEmpty).firstElementChild.focus();
}

function updatePage() {
    const scoreboard = document.getElementById("scoreboard");
    const labels = isSinglePlayer ? [`${humanName} (You)`, "AI", "Draws"] : [`${person1} (X)`, `${person2} (O)`, "Draws"];
    scoreboard.replaceChildren();
    [scores.first, scores.second, scores.draws].forEach((score, i) => {
        const item = document.createElement("div");
        const label = document.createElement("span");
        label.textContent = labels[i];
        const value = document.createElement("strong");
        value.textContent = String(score);
        item.appendChild(label);
        item.appendChild(value);
        scoreboard.appendChild(item);
    });
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

    const winningCells = new Set(
        gState === X || gState === O
            ? WIN_PATTERNS.filter(pattern => pattern.every(i => board[i] === gState)).flat()
            : []
    );
    board.forEach((val, i) => {
        const cell = document.getElementById("td" + i);
        cell.classList.toggle("winning-cell", winningCells.has(i));
        let button = cell.firstElementChild;
        if (!button) {
            button = document.createElement("button");
            button.type = "button";
            button.className = "cell-button";
            const image = document.createElement("img");
            image.alt = "";
            button.appendChild(image);
            button.onclick = () => updateEntry(i);
            button.onkeydown = event => navigateBoard(event, i);
            cell.appendChild(button);
        }
        button.firstElementChild.src = `${i2c(val)}.png`;
        button.setAttribute("aria-label", `Row ${Math.floor(i / 3) + 1}, column ${i % 3 + 1}: ${val === EMPTY ? "empty" : i2c(val)}${winningCells.has(i) ? ", winning cell" : ""}`);
        button.setAttribute("aria-disabled", String(gState !== 0 || val !== EMPTY));
    });
}

function navigateBoard(event, i) {
    const row = Math.floor(i / 3);
    const column = i % 3;
    let target;
    switch (event.key) {
        case "ArrowUp": target = Math.max(0, row - 1) * 3 + column; break;
        case "ArrowDown": target = Math.min(2, row + 1) * 3 + column; break;
        case "ArrowLeft": target = row * 3 + Math.max(0, column - 1); break;
        case "ArrowRight": target = row * 3 + Math.min(2, column + 1); break;
        case "Home": target = row * 3; break;
        case "End": target = row * 3 + 2; break;
        default: return;
    }
    event.preventDefault();
    document.getElementById("td" + target).firstElementChild.focus();
}

function checkState() {
    for (const pattern of WIN_PATTERNS) {
        const sum = pattern.reduce((acc, idx) => acc + board[idx], 0);
        if (sum === 3 * X) return 1;
        if (sum === 3 * O) return -1;
    }
    return board.includes(EMPTY) ? 0 : 2;
}

function updateGameState() {
    gState = checkState();
    if (gState === 0 || roundCounted) return;
    if (gState === 2) {
        scores.draws++;
    } else if (isSinglePlayer ? gState === -aiPlayer : gState === X) {
        scores.first++;
    } else {
        scores.second++;
    }
    roundCounted = true;
}

function updateEntry(i) {
    if (!document.getElementById("game-setup").hidden || document.getElementById("game-area").hidden) return;
    if (gState === 0 && board[i] === EMPTY) {
        board[i] = next;
        next = -next;
        updateGameState();
        updatePage();
        if (isSinglePlayer && gState === 0 && next === aiPlayer) {
            bestMove(); // AI makes its move
            updateGameState();
            updatePage();
        }
    }
}

// Mode selection logic with buttons
function selectMode(singlePlayer) {
    setupSinglePlayer = singlePlayer;
    document.getElementById("setup-title").textContent = singlePlayer ? "Single-player setup" : "Multiplayer setup";
    document.getElementById("player-name-label").textContent = singlePlayer ? "Your name" : "Player X name";
    document.getElementById("player-name").value = singlePlayer ? humanName : (!isSinglePlayer ? person1 || "" : "");
    document.getElementById("second-player-name").value = !isSinglePlayer ? person2 || "" : "";
    document.getElementById("second-player-field").hidden = singlePlayer;
    document.getElementById("starter-field").hidden = !singlePlayer;
    document.getElementById("mode-selection").hidden = true;
    document.getElementById("game-setup").hidden = false;
    document.getElementById("game-area").hidden = true;
    document.getElementById("player-name").focus();
}

function startGame(event) {
    event.preventDefault();
    isSinglePlayer = setupSinglePlayer;
    const starter = document.getElementById("starter").value;
    const firstName = document.getElementById("player-name").value.trim();
    alternateStarter = isSinglePlayer && starter === "alternate";
    if (isSinglePlayer) {
        aiPlayer = starter === "ai" ? X : O;
        humanName = firstName || "Player";
    } else {
        person1 = firstName || "Player X";
        person2 = document.getElementById("second-player-name").value.trim() || "Player O";
    }
    scores = { first: 0, second: 0, draws: 0 };
    cancelSetup();
    document.getElementById("game-area").hidden = false;
    resetBoard();
}

function cancelSetup() {
    document.getElementById("game-setup").hidden = true;
    document.getElementById("mode-selection").hidden = false;
    document.getElementById("game-area").hidden = person1 === undefined;
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
document.getElementById("game-setup").onsubmit = startGame;
displayModeSelection();
