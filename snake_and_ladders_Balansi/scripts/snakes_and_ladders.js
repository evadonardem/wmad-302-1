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
    }

    roll() {
        return Math.floor(Math.random() * this.sides) + 1;
    }

    getIcon(value) {
        const icon = Die.#sidesToIcon[value] || 'dice-six';
        return `<i class="fa fa-${icon}"></i>`;
    }
}

// Snakes and ladders positions
Die.snakes = {
    98: 80,
    94: 12,
    92: 67,
    61: 43,
    56: 48,
    42: 1,
    25: 3
};

Die.ladders = {
    7: 30,
    16: 33,
    20: 38,
    36: 83,
    50: 68,
    63: 81,
    71: 89,
    86: 97
};

class Player {
    constructor(name, idx = 0) {
        const colors = ['#704e2e', '#709176'];
        this.name = name;
        this.color = colors[idx % colors.length];
        this.position = 0;
    }
    move(steps) {
        this.position += steps;
    }
}

// Game state
const players = [
    new Player('Player 1', 0),
    new Player('Player 2', 1)
];
const die = new Die();
let currentPlayerIndex = 0;
let gameOver = false;

// UI Elements
const dicePlaceholder = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const restartButton = document.getElementById('restartButton');
const boardPlaceholder = document.getElementById('boardPlaceholder');
const canvas = boardPlaceholder.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Draw board (just clear, no grid lines)
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Convert board position (1-100) to canvas x,y
function positionToXY(pos) {
    if (pos < 1) pos = 1;
    if (pos > 100) pos = 100;
    const size = 74;
    let row = Math.floor((pos - 1) / 10);
    let col = (pos - 1) % 10;
    if (row % 2 === 1) col = 9 - col;
    return {
        x: col * size + size / 2,
        y: 740 - (row * size + size / 2)
    };
}

// Draw player tokens
function drawPlayers() {
    players.forEach((player, idx) => {
        if (player.position === 0) return;
        const { x, y } = positionToXY(player.position);
        ctx.beginPath();
        ctx.arc(x, y, 22 - idx * 6, 0, 2 * Math.PI);
        ctx.fillStyle = player.color;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(player.name[0], x, y);
    });
}

// Show player positions and scores
function updatePlayerScores() {
    // Remove old scores
    document.querySelectorAll('.player-score').forEach(e => e.remove());
    let html = '';
    players.forEach((player, idx) => {
        html += `<div class="player-score" style="background:${player.color};color:#fff;">
            ${player.name}: Square ${player.position}
            ${currentPlayerIndex === idx && !gameOver ? ' <b>Your Turn</b>' : ''}
        </div>`;
    });
    dicePlaceholder.insertAdjacentHTML('beforebegin', html);
}

// Main render
function render() {
    drawBoard();
    drawPlayers();
    updatePlayerScores();
}

// Animate dice roll
function animateDiceRoll(finalValue, callback) {
    let rolls = 10;
    let current = 0;
    function rollStep() {
        if (current < rolls) {
            const fakeValue = Math.floor(Math.random() * 6) + 1;
            dicePlaceholder.innerHTML = die.getIcon(fakeValue);
            current++;
            setTimeout(rollStep, 60);
        } else {
            dicePlaceholder.innerHTML = die.getIcon(finalValue) + ` <span style="font-size:1.2rem;">${finalValue}</span>`;
            if (callback) callback();
        }
    }
    rollStep();
}

// Animate player step-by-step
function animatePlayerMove(player, start, end, callback) {
    const path = [];
    for (let i = start + 1; i <= end; i++) {
        path.push(i);
    }
    let idx = 0;
    function step() {
        if (idx < path.length) {
            player.position = path[idx];
            render();
            idx++;
            setTimeout(step, 120);
        } else {
            callback();
        }
    }
    step();
}

// Handle dice roll and player move
function handleRoll() {
    if (gameOver) return;
    const player = players[currentPlayerIndex];
    const roll = die.roll();

    animateDiceRoll(roll, () => {
        let startPos = player.position;
        let targetPos = player.position + roll;

        // Only move if the player lands exactly on 100 or less
        if (targetPos > 100) {
            setTimeout(() => {
                currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
                render();
            }, 700);
            return;
        }

        let finalPos = targetPos;
        let isSnake = Die.snakes[finalPos];
        let isLadder = Die.ladders[finalPos];

        if (isSnake) {
            animatePlayerMove(player, startPos, finalPos, () => {
                player.position = Die.snakes[finalPos];
                render();
                afterMove();
            });
        } else if (isLadder) {
            animatePlayerMove(player, startPos, finalPos, () => {
                player.position = Die.ladders[finalPos];
                render();
                afterMove();
            });
        } else {
            animatePlayerMove(player, startPos, finalPos, afterMove);
        }

        function afterMove() {
            if (player.position === 100) {
                dicePlaceholder.innerHTML = `<b>${player.name} wins! 🎉</b>`;
                gameOver = true;
                rollDiceButton.disabled = true;
                restartButton.style.display = 'inline-block';
                return;
            }
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            render();
        }
    });
}

// Restart button logic
restartButton.addEventListener('click', () => {
    players.forEach(p => p.position = 0);
    currentPlayerIndex = 0;
    gameOver = false;
    rollDiceButton.disabled = false;
    dicePlaceholder.innerHTML = '';
    restartButton.style.display = 'none';
    render();
});

// Button event
rollDiceButton.addEventListener('click', handleRoll);

// Initial render
render();
