// DICE CLASS
class Die {
    static sidesToIcon = {
        1: 'dice-one',
        2: 'dice-two',
        3: 'dice-three',
        4: 'dice-four',
        5: 'dice-five',
        6: 'dice-six'
    };

    /**
     * Die class for rolling and displaying dice.
     * @param {number} sides - Number of sides on the die (default 6).
     */
    constructor(sides = 6) {
        this.sides = sides;
        this.value = 1;
    }

    /**
     * Rolls the die and returns the result.
     * @returns {number} - The rolled value.
     */
    roll() {
        this.value = Math.floor(Math.random() * this.sides) + 1;
        return this.value;
    }

    /**
     * Returns the FontAwesome icon HTML for the current die value.
     * @returns {string}
     */
    getIcon() {
        return `<i class="fa-solid fa-${Die.sidesToIcon[this.value]} fa-2xl" style="color:#333;"></i>`;
    }
}

// PLAYER CLASS
class Player {
    /**
     * Player class for Snakes and Ladders.
     * @param {string} name - Player's name.
     * @param {string} color - Player's color.
     */
    static COLORS = ['#e74c3c', '#2980b9', '#27ae60', '#f1c40f', '#8e44ad', '#e67e22', '#16a085', '#d35400', '#2c3e50', '#00b894'];

    constructor(name, color = null) {
        this.name = name;
        this.color = color || Player.COLORS[Math.floor(Math.random() * Player.COLORS.length)];
        this.position = 0;
    }

    /**
     * Moves the player forward by a number of steps.
     * @param {number} steps
     */
    move(steps) {
        this.position += steps;
        if (this.position > 100) this.position = 100;
    }
}

// GAME DATA
const ladders = { 7: 30, 16: 33, 20: 38, 36: 83, 50: 68, 63: 81, 71: 89, 86: 97 };
const snakes = { 25: 3, 42: 1, 56: 48, 61: 43, 92: 67, 94: 12, 98: 80 };

// DOM ELEMENTS
const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const canvas = document.querySelector('#boardPlaceholder canvas');
const ctx = canvas.getContext('2d');

// Add a display for current player
let playerTurnDisplay = document.getElementById('playerTurnDisplay');
if (!playerTurnDisplay) {
    playerTurnDisplay = document.createElement('div');
    playerTurnDisplay.id = 'playerTurnDisplay';
    playerTurnDisplay.style.fontWeight = 'bold';
    playerTurnDisplay.style.fontSize = '1.2rem';
    playerTurnDisplay.style.margin = '16px 0 0 0';
    playerTurnDisplay.style.textAlign = 'center';
    document.querySelector('.col-md-3 .card-body').insertBefore(playerTurnDisplay, diceElement);
}

// Add or move the game message above the dice and roll button
let msgBox = document.getElementById('gameMessage');
if (!msgBox) {
    msgBox = document.createElement('div');
    msgBox.id = 'gameMessage';
    msgBox.className = 'alert alert-info mt-3';
    msgBox.style.fontSize = '1.1rem';
    msgBox.style.textAlign = 'center';
    msgBox.style.transition = 'background 0.3s';
    msgBox.style.background = 'linear-gradient(90deg,#e0e7ff 0%,#fff 100%)';
    msgBox.style.border = '1.5px solid #b2bec3';
    msgBox.style.boxShadow = '0 2px 12px #0001';
    msgBox.style.borderRadius = '8px';
    msgBox.style.padding = '12px 0';
    // Insert above dice and roll button
    document.querySelector('.col-md-3 .card-body').insertBefore(msgBox, playerTurnDisplay);
}

// Ask for number of players (max 10)
let numPlayers = 0;
let players = [];
let turn = 0;
let gameOver = false;
const die = new Die(6);

/**
 * Prompts for number of players and initializes the game.
 */
function askPlayers() {
    let valid = false;
    while (!valid) {
        let input = prompt("How many players? (1-10)", "2");
        if (input === null) input = "2";
        numPlayers = parseInt(input);
        if (!isNaN(numPlayers) && numPlayers >= 1 && numPlayers <= 10) valid = true;
    }
    // Assign unique colors to each player
    players = [];
    for (let i = 0; i < numPlayers; i++) {
        players.push(new Player(`Player ${i + 1}`, Player.COLORS[i % Player.COLORS.length]));
    }
    turn = 0;
    gameOver = false;
    drawPlayers();
    showMessage(`${players[turn].name}'s turn!`);
    updatePlayerTurnDisplay();
    diceElement.innerHTML = '';
}
askPlayers();

/**
 * Draws all players on the board as colored chips.
 */
function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player chips, stacking if multiple on same tile
    const chipMap = {};
    players.forEach((player, idx) => {
        const pos = Math.max(1, player.position);
        if (!chipMap[pos]) chipMap[pos] = [];
        chipMap[pos].push({ player, idx });
    });

    Object.keys(chipMap).forEach(posStr => {
        const pos = parseInt(posStr);
        const size = 74;
        const row = Math.floor((pos - 1) / 10);
        let col = (pos - 1) % 10;
        if (row % 2 === 1) col = 9 - col;
        const x = col * size + size / 2;
        const y = canvas.height - row * size - size / 2;
        const chips = chipMap[pos];
        const total = chips.length;
        const chipRadius = 18;
        const spread = 22;

        chips.forEach((chip, i) => {
            // Offset chips if stacked
            const angle = (i / total) * Math.PI * 2;
            const offsetX = total > 1 ? Math.cos(angle) * spread : 0;
            const offsetY = total > 1 ? Math.sin(angle) * spread : 0;

            // Draw chip
            ctx.beginPath();
            ctx.arc(x + offsetX, y + offsetY, chipRadius, 0, Math.PI * 2);
            ctx.fillStyle = chip.player.color;
            ctx.shadowColor = "#222";
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            // Draw player number
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 15px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((chip.idx + 1).toString(), x + offsetX, y + offsetY);
        });
    });
}

/**
 * Updates the display to show whose turn it is.
 */
function updatePlayerTurnDisplay() {
    const current = players[turn];
    playerTurnDisplay.innerHTML = `Current Turn: <span style="color:${current.color};text-shadow:1px 1px 2px #222;">${current.name}</span>`;
}

/**
 * Handles the dice roll and player movement.
 */
rollDiceButton.addEventListener('click', () => {
    if (gameOver) return;

    const current = players[turn];
    const roll = die.roll();
    diceElement.innerHTML = die.getIcon();

    let oldPos = current.position;
    current.move(roll);

    // Check for ladders or snakes
    if (ladders[current.position]) {
        const ladderFrom = oldPos + roll;
        const ladderTo = ladders[current.position];
        showMessage(`<b>${current.name}</b> rolled <b>${roll}</b>: <span style="color:#888;">${oldPos} → ${ladderFrom}</span> <b>ladder</b> to <span style="color:#27ae60;">${ladderTo}</span>! 🪜`);
        current.position = ladderTo;
    } else if (snakes[current.position]) {
        const snakeFrom = oldPos + roll;
        const snakeTo = snakes[current.position];
        showMessage(`<b>${current.name}</b> rolled <b>${roll}</b>: <span style="color:#888;">${oldPos} → ${snakeFrom}</span> <b>snake</b> to <span style="color:#e74c3c;">${snakeTo}</span>. 🐍`);
        current.position = snakeTo;
    } else {
        showMessage(`<b>${current.name}</b> rolled <b>${roll}</b>: <span style="color:#888;">${oldPos} → ${current.position}</span>.`);
    }

    drawPlayers();

    // Win condition
    if (current.position >= 100) {
        gameOver = true;
        setTimeout(() => {
            showMessage(`🎉 <b>${current.name}</b> wins! 🎉`);
            diceElement.innerHTML = '';
            playerTurnDisplay.innerHTML = `<span style="color:${current.color};text-shadow:1px 1px 2px #222;">${current.name}</span> wins!`;
            setTimeout(() => {
                if (confirm("Game over! Start a new game?")) {
                    askPlayers();
                }
            }, 1200);
        }, 200);
        return;
    }

    // Next player's turn
    turn = (turn + 1) % players.length;
    updatePlayerTurnDisplay();
});

/**
 * Shows a message to the user in a styled alert box.
 * @param {string} msg
 */
function showMessage(msg) {
    msgBox.innerHTML = msg;
}

// Initial draw and message
drawPlayers();
showMessage(`${players[turn].name}'s turn!`);
updatePlayerTurnDisplay();