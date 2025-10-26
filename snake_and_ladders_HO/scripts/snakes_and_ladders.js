class Die {
    static #sidesToIcon = {
        1: 'dice-one',
        2: 'dice-two',
        3: 'dice-three',
        4: 'dice-four',
        5: 'dice-five',
        6: 'dice-six',
    };

    constructor(sides = 6) {
        this.sides = sides;
        this.value = 1;
    }

    roll() {
        this.value = Math.floor(Math.random() * this.sides) + 1;
        return this.value;
    }

    get icon() {
        const iconClass = Die.#sidesToIcon[this.value] || 'dice';
        return `<i class="fa fa-2xl fa-${iconClass}"></i>`;
    }
}

class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.position = 0;
    }

    move(steps) {
        this.position += steps;
        if (this.position > 100) this.position = 100;
    }

    reset() {
        this.position = 0;
    }
}

// DOM references
const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// ✅ Explicitly set board and cell size
const BOARD_SIZE = 740;
const CELL_SIZE = BOARD_SIZE / 10;

// Set canvas size
canvas.width = BOARD_SIZE;
canvas.height = BOARD_SIZE;

// 🎯 Create and append Turn Indicator
const turnIndicator = document.createElement('div');
turnIndicator.id = 'turnIndicator';
turnIndicator.style.textAlign = 'center';
turnIndicator.style.marginTop = '10px';
turnIndicator.style.fontWeight = 'bold';
turnIndicator.style.fontSize = '18px';
document.querySelector('.card-body').appendChild(turnIndicator);

const die = new Die(6);

// ✅ Each player now has a fixed color
const players = [
    new Player('Player 1', 'red'),
    new Player('Player 2', 'blue'),
];
let currentPlayerIndex = 0;

// Snakes and ladders
const snakes = {
    25: 3,
    42: 1,
    56: 48,
    61: 43,
    92: 67,
    94: 12,
    98: 80,

};

const ladders = {
    7: 30,
    16: 33,
    20: 38,
    36: 83,
    50: 68,
    63: 81,
    71: 89,
    86: 97,
};

// Convert board number to canvas coordinates
function getCoordinates(position) {
    if (position === 0) return { x: CELL_SIZE / 2, y: BOARD_SIZE - CELL_SIZE / 2 };
    const row = Math.floor((position - 1) / 10);
    const col = (position - 1) % 10;
    const x = (row % 2 === 0 ? col : 9 - col) * CELL_SIZE + CELL_SIZE / 2;
    const y = BOARD_SIZE - (row * CELL_SIZE + CELL_SIZE / 2);
    return { x, y };
}

// Draw all players
function drawPlayers() {
    ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    players.forEach((player, index) => {
        const { x, y } = getCoordinates(player.position);
        ctx.beginPath();
        ctx.arc(x, y - index * 20, 15, 0, 2 * Math.PI);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.stroke();
    });
}

// 🎯 Update turn indicator visually
function updateTurnIndicator() {
    const currentPlayer = players[currentPlayerIndex];
    turnIndicator.innerHTML = `🎲 <span style="color:${currentPlayer.color}">${currentPlayer.name}'s Turn</span>`;
}

// Handle dice rolls
rollDiceButton.addEventListener('click', () => {

    rollDiceButton.disabled = true;

    const currentPlayer = players[currentPlayerIndex];
    const roll = die.roll();
    diceElement.innerHTML = die.icon;

    setTimeout(() => {
        currentPlayer.move(roll);

  
        if (ladders[currentPlayer.position]) {
            currentPlayer.position = ladders[currentPlayer.position];
            alert(`🎉 ${currentPlayer.name} climbed a ladder to ${currentPlayer.position}!`);
        }

        if (snakes[currentPlayer.position]) {
            currentPlayer.position = snakes[currentPlayer.position];
            alert(`🐍 ${currentPlayer.name} was bitten by a snake and slid to ${currentPlayer.position}!`);
        }

        drawPlayers();


        if (currentPlayer.position === 100) {
            alert(`🏁 ${currentPlayer.name} wins the game! 🎉`);
            players.forEach(p => p.reset());
            drawPlayers();
            currentPlayerIndex = 0;
            updateTurnIndicator();

   
            rollDiceButton.disabled = false;
            return;
        }

 
        if (roll !== 6) {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        }

        updateTurnIndicator();

   
        rollDiceButton.disabled = false;
    }, 600); 
});


drawPlayers();
updateTurnIndicator();