// Snakes & Ladders — fixed and working with the provided index.html
class Die {
    constructor(sides = 6) {
        this.sides = sides;
        this.value = 1;
    }
    roll() {
        this.value = Math.floor(Math.random() * this.sides) + 1;
        return this.value;
    }
    getIcon() {
        return `<i class="fa fa-dice-${this.getWord()}"></i>`;
    }
    getWord() {
        const map = {1:'one',2:'two',3:'three',4:'four',5:'five',6:'six'};
        return map[this.value];
    }
}

class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.position = 0;
    }
    move(steps) {
        if (this.position + steps > 100) {
            return false;
        } else {
            this.position += steps;
            return true;
        }
    }
}

const ladders = {
    7: 30,
    16: 33,
    20: 38,
    36: 83,
    50: 68,
    63: 81,
    71: 89,
    86: 97
};

const snakes = {
    25: 3,
    42: 1,
    56: 48,
    61: 43,
    94: 12,
    92: 67,
    98: 80
};

const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const startGameBtn = document.getElementById('startGameBtn');
const playerCountSelect = document.getElementById('playerCount');
const currentTurnDiv = document.getElementById('currentTurn');
const rolledValueDiv = document.getElementById('rolledValue');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerColorListDiv = document.getElementById('playerColorList');
const winnerDisplayDiv = document.getElementById('winnerDisplay');

const dice = new Die();
const ALL_COLORS = ['Red','Blue','Green','Yellow','Purple','Orange'];

let players = [];
let currentPlayer = 0;
let gameOver = false;

function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

startGameBtn.addEventListener('click', () => {
    const count = parseInt(playerCountSelect.value) || 2;
    const colors = shuffleArray(ALL_COLORS).slice(0, count);

    players = [];
    for (let i = 0; i < count; i++) {
        players.push(new Player(`Player ${i + 1}`, colors[i]));
    }

    currentPlayer = 0;
    gameOver = false;
    rolledValueDiv.textContent = "Roll to start!";
    currentTurnDiv.textContent = `${players[currentPlayer].name}'s Turn`;
    winnerDisplayDiv.style.display = 'none';
    winnerDisplayDiv.textContent = '';
    rollDiceButton.disabled = false;

    displayPlayerColors();
    drawPlayers();
    updateTurnText();
});

rollDiceButton.addEventListener('click', () => {
    if (players.length === 0) {
        alert("Please start the game first!");
        return;
    }
    if (gameOver) {
        alert("The game is over. Start a new game.");
        return;
    }

    const value = dice.roll();
    diceElement.innerHTML = dice.getIcon();

    const player = players[currentPlayer];
    const oldPos = player.position;

    const moved = player.move(value);

    let landed = player.position;

    if (!moved) {
        rolledValueDiv.innerHTML = `${player.name} rolled a ${value} 🎲 but needs exactly ${100 - oldPos} to win. No move!`;
        drawPlayers();
        currentPlayer = (currentPlayer + 1) % players.length;
        updateTurnText();
        return;
    }

    if (ladders[landed]) {
        player.position = ladders[landed];
        rolledValueDiv.innerHTML = `${player.name} rolled a ${value} 🎲 and climbed a ladder from ${landed} → ${player.position}! 🪜`;
    }
    else if (snakes[landed]) {
        player.position = snakes[landed];
        rolledValueDiv.innerHTML = `${player.name} rolled a ${value} 🎲 and was bitten by a snake from ${landed} → ${player.position}. 🐍`;
    } else {
        rolledValueDiv.innerHTML = `${player.name} rolled a ${value} 🎲 and moved from ${oldPos} → ${player.position}.`;
    }

    drawPlayers();

    if (player.position >= 100) {
        gameOver = true;
        winnerDisplayDiv.style.display = 'block';
        winnerDisplayDiv.textContent = `🎉 ${player.name} wins the game! 🎉`;
        currentTurnDiv.innerHTML = `<span style="color:${player.color.toLowerCase()}; font-weight:bold;">${player.name}</span> has won!`;
        rollDiceButton.disabled = true;
        return;
    }

    currentPlayer = (currentPlayer + 1) % players.length;
    updateTurnText();
});

function updateTurnText() {
    if (!gameOver && players.length > 0) {
        const p = players[currentPlayer];
        currentTurnDiv.innerHTML = `${p.name}'s Turn <span style="color:${p.color.toLowerCase()}">●</span>`;
    }
}

function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (players.length === 0) return;

    const groups = {};
    players.forEach((p, idx) => {
        const pos = p.position;
        if (!groups[pos]) groups[pos] = [];
        groups[pos].push({ player: p, idx });
    });

    for (const posStr in groups) {
        const pos = parseInt(posStr, 10);
        const group = groups[pos];
        const center = getBoardCoordinates(Math.max(1, pos));

        const n = group.length;
        for (let i = 0; i < n; i++) {
            const entry = group[i];
            const offsetX = (i - (n - 1) / 2) * 18;
            const x = center.x + offsetX;
            const y = center.y;

            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fillStyle = entry.player.color.toLowerCase();
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#222';
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const parts = entry.player.name.split(' ');
            const numLabel = parts.length > 1 ? parts[1] : entry.idx + 1;
            ctx.fillText(numLabel, x, y);
        }
    }
}

function getBoardCoordinates(position) {
    const tile = 74;
    if (position <= 0) position = 1;

    const row = Math.floor((position - 1) / 10); 
    let col = (position - 1) % 10; 
    if (row % 2 === 1) col = 9 - col;

    const x = col * tile + tile / 2; 
    const y = canvas.height - row * tile - tile / 2; 
    return { x, y };
}

function displayPlayerColors() {
    if (!players || players.length === 0) {
        playerColorListDiv.innerHTML = '';
        return;
    }
    let html = `<h6>Player Colors:</h6>`;
    players.forEach(p => {
        const colorLower = p.color.toLowerCase();
        html += `<div style="margin-top:6px; display:flex; align-items:center;">
            <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${colorLower};margin-right:8px;border:1px solid #333;"></span>
            <span style="flex:1;">${p.name}</span>
            <span style="font-weight:bold;color:${colorLower};margin-left:8px;">${p.color}</span>
        </div>`;
    });
    playerColorListDiv.innerHTML = html;
}

ctx.clearRect(0, 0, canvas.width, canvas.height);