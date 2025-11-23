// DICE CLASS
class Dice {
    static #sidesToIcon = {
        1: 'dice-one',
        2: 'dice-two',
        3: 'dice-three',
        4: 'dice-four',
        5: 'dice-five',
        6: 'dice-six'
    };

    constructor(sides = 6) {
        this.sides = sides;
        this.value = 1;
    }

    roll() {
        this.value = Math.floor(Math.random() * this.sides) + 1;
        return this.value;
    }

    getIcon() {
        return `<i class="fa-solid fa-${Dice.#sidesToIcon[this.value]}"></i>`;
    }
}

// PLAYER CLASS
class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.position = 0;
    }

    move(steps) {
        this.position += steps;
    }
}

// GAME DATA
const ladders = { 7: 30, 16: 33, 20: 38, 36: 83, 50: 68, 63: 81, 71: 89, 86: 97 };
const snakes = { 25: 3, 42: 1, 56: 48, 61: 43, 92: 67, 94: 12, 98: 80 };

// DOM ELEMENTS
const diceSpot = document.getElementById('dicePlaceholder');
const rollBtn = document.getElementById('rollDiceButton');
const startBtn = document.getElementById('startGameBtn');
const playerCountSelect = document.getElementById('playerCount');
const turnDisplay = document.getElementById('currentTurn');
const resultText = document.getElementById('rolledValue');
const colorList = document.getElementById('playerColorList');
const winnerBox = document.getElementById('winnerDisplay');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const dice = new Dice();
const COLORS = ['red', 'blue', 'green', 'purple', 'orange', 'cyan', 'magenta', 'lime', 'pink', 'teal', 'lavender'];

let players = [];
let turn = 0;
let gameOver = false;

// Shuffle function
function shuffle(arr) {
    let temp = [...arr];
    for (let i = temp.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    return temp;
}

// Start new game
startBtn.addEventListener('click', () => {
    // Show the game panel
    document.getElementById('gamePanel').style.display = 'block';
    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset UI
    diceSpot.innerHTML = `<i class="fa fa-dice-one"></i>`;
    resultText.textContent = "Roll to start!";
    winnerBox.style.display = 'none';

    // Get new players
    const num = parseInt(playerCountSelect.value);
    const colors = shuffle(COLORS).slice(0, num).map(c => c.toLowerCase());

    players = colors.map((c, i) => {
        const p = new Player(`Player ${i + 1}`, c);
        p.position = 0; // Ensure position resets
        return p;
    });

    // Reset game state
    turn = 0;
    gameOver = false;
    rollBtn.disabled = false;

    // Update interface
    showColorList();
    updateTurn();
    drawPlayers();
});


// Roll dice
rollBtn.addEventListener('click', () => {
    if (players.length === 0) {
        alert("Start the game first!");
        return;
    }
    if (gameOver) {
        alert("Game already finished!");
        return;
    }

    const roll = dice.roll();
    diceSpot.innerHTML = dice.getIcon();

    const current = players[turn];
    const oldPos = current.position;
    current.move(roll);
    let newPos = current.position;

    //climbed ladder
    if (ladders[newPos]) {
        current.position = ladders[newPos];
        resultText.innerHTML = `${current.name} rolled ${roll} 🎲 climbed ladder ${newPos} → ${current.position}! 🪜`;
    }
    //bitten by snake
    else if (snakes[newPos]) {
        current.position = snakes[newPos];
        resultText.innerHTML = `${current.name} rolled ${roll} 🎲 got bitten ${newPos} → ${current.position}. 🐍`;
    }
    //no snake or ladder
    else {
        resultText.innerHTML = `${current.name} rolled ${roll} 🎲 moved ${oldPos} → ${current.position}.`;
    }

    drawPlayers();
    // Check win condition
    if (current.position >= 100) {
    gameOver = true;
    winnerBox.style.display = 'block';
    winnerBox.textContent = `🎉 ${current.name} wins! 🎉`;
    turnDisplay.innerHTML = `<b style="color:${current.color}">${current.name}</b> won the game!`;
    rollBtn.disabled = true;

    celebrateWin(current.color);
    return;
}
    // Next turn

    turn = (turn + 1) % players.length;
    updateTurn();
});

// Update turn
function updateTurn() {
    const p = players[turn];
    turnDisplay.innerHTML = `${p.name}'s Turn <span style="color:${p.color}">●</span>`;
}

// Draw players
function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const groups = {};

    players.forEach((p, i) => {
        const pos = p.position;
        if (!groups[pos]) groups[pos] = [];
        groups[pos].push({ p, index: i });
    });

    for (let pos in groups) {
        let list = groups[pos];
        const { x, y } = getTileCenter(Math.max(1, pos));
        const count = list.length;

        list.forEach((obj, i) => {
            const offX = (i - (count - 1) / 2) * 18;
            const px = x + offX;

            ctx.beginPath();
            ctx.arc(px, y, 12, 0, Math.PI * 2);
            ctx.fillStyle = obj.p.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#222';
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const num = obj.p.name.split(' ')[1] || obj.index + 1;
            ctx.fillText(num, px, y);
        });
    }
}

// Tile center
function getTileCenter(pos) {
    const size = 74;
    if (pos <= 0) pos = 1;
    const row = Math.floor((pos - 1) / 10);
    let col = (pos - 1) % 10;
    if (row % 2 === 1) col = 9 - col;

    return {
        x: col * size + size / 2,
        y: canvas.height - row * size - size / 2
    };
}

// Show players and colors
function showColorList() {
    if (!players.length) {
        colorList.innerHTML = '';
        return;
    }

    let html = `<h6>Players:</h6>`;
    players.forEach(p => {
        html += `
        <div style="margin-top:6px; display:flex; align-items:center;">
            <span style="width:14px;height:14px;border-radius:50%;background:${p.color};margin-right:8px;border:1px solid #333;"></span>
            <span>${p.name}</span>
            <span style="margin-left:auto; font-weight:bold; color:${p.color}">${p.color}</span>
        </div>`;
    });
    colorList.innerHTML = html;
}

function celebrateWin(playerColor) {
    winnerBox.classList.add('winner-pulse');

    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            startVelocity: 50,
            spread: 70,
            scalar: 1.2,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}


// Initial clear
ctx.clearRect(0, 0, canvas.width, canvas.height);
