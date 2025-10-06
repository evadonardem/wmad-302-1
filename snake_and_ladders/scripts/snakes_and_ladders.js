class Die {
    static #sidesToIcon = {
        1: 'dice-one', 2: 'dice-two', 3: 'dice-three',
        4: 'dice-four', 5: 'dice-five', 6: 'dice-six'
    };

    constructor(sides = 6) {
        this.sides = sides;
        this.currentValue = 1;
    }

    roll() {
        this.currentValue = Math.floor(Math.random() * this.sides) + 1;
        return this.currentValue;
    }

    getIcon() {
        const iconName = Die.#sidesToIcon[this.currentValue] || `dice-${this.currentValue}`;
        return `<i class="fa fa-2xl fa-${iconName}"></i>`;
    }
}
class Player {
    constructor(name) {
        this.name = name;
        const colors = ['red', 'blue', 'green', 'yellow'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.position = 0;
    }

    move(steps) {
        this.position += steps;
        if (this.position > 100) this.position = 100;
    }
}

const canvas = document.querySelector('#boardPlaceholder canvas');
const ctx = canvas.getContext('2d');
const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const turnInfo = document.getElementById('turnInfo');
const statusPanel = document.getElementById('statusPanel');

let players = [];
let currentPlayerIndex = 0;
const dice = new Die();
let gameStarted = false;

const snakes = { 25: 3, 42: 1, 56: 48, 61: 43, 92: 67, 94: 12, 98: 80 };
const ladders = { 7: 30, 16: 33, 20: 38, 36: 83, 50: 68, 63: 81, 71: 89, 86: 97 };

function getCoords(square) {
    if (square <= 0) return { x: -50, y: -50 };
    const cell = 74;
    const idx = square - 1;
    const row = Math.floor(idx / 10);
    let col = idx % 10;
    if (row % 2 === 1) col = 9 - col;
    return { x: col * cell + cell / 2, y: (9 - row) * cell + cell / 2 };
}

function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    players.forEach((p, i) => {
        const { x, y } = getCoords(p.position);
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.name.charAt(0).toUpperCase(), x, y);
    });
}

function updateUI(message = '') {
    if (!players.length) return;
    const cp = players[currentPlayerIndex];
    turnInfo.innerHTML = `<strong>Current Turn:</strong> ${cp.name} <span style="display:inline-block;width:16px;height:16px;background:${cp.color};border-radius:50%;margin-left:8px;"></span>`;
    let html = '';
    players.forEach((p, idx) => {
        html += `<div style="${idx === currentPlayerIndex ? 'font-weight:bold;' : ''}">${p.name}: ${p.position} ${idx === currentPlayerIndex ? '👈' : ''}</div>`;
    });
    if (message) html = `<div style="margin-bottom:8px;color:#0a58ca;">${message}</div>` + html;
    statusPanel.innerHTML = html;
}

function initializeGame() {
    const p1 = prompt("Enter Player 1 name:");
    if (p1 === null) return;

    const p2 = prompt("Enter Player 2 name:");
    if (p2 === null) return;

    players = [new Player(p1 || "Player 1"), new Player(p2 || "Player 2")];
    currentPlayerIndex = 0;
    gameStarted = true;
    drawPlayers();
    updateUI("Game started!");
    diceElement.innerHTML = dice.getIcon();
    rollDiceButton.disabled = false;
}

rollDiceButton.addEventListener('click', () => {
    if (!gameStarted) return initializeGame();

    const player = players[currentPlayerIndex];
    const roll = dice.roll();
    diceElement.innerHTML = dice.getIcon();

    player.move(roll);

    if (ladders[player.position]) player.position = ladders[player.position];
    if (snakes[player.position]) player.position = snakes[player.position];

    drawPlayers();
    updateUI(`${player.name} rolled a ${roll}`);

    if (player.position === 100) {
        alert(`${player.name} wins! 🎉`);
        rollDiceButton.disabled = true;
        return;
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
});

window.addEventListener('DOMContentLoaded', () => {
    diceElement.innerHTML = dice.getIcon();
    rollDiceButton.disabled = false;
});