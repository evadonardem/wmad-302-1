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

    getIcon(rollValue = null) {
        const value = rollValue || this.roll();
        const iconClass = Die.#sidesToIcon[value];
        return `<i class="fa fa-2xl fa-${iconClass}"></i>`;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.color = ['red', 'blue', 'green', 'yellow'][Math.floor(Math.random() * 4)];
        this.position = 0;
        this.hasWon = false;
    }

    move(steps) {
        this.position += steps;
        
        if (this.position >= 100) {
            this.hasWon = true;
            this.position = 100;
        }
        
        return this.position;
    }
}

const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const boardPlaceholder = document.getElementById('boardPlaceholder');
const dice = new Die(6);

const player1 = new Player('Player 1');
const player2 = new Player('Player 2');
let currentPlayer = player1;
let gameOver = false;

const winMessageElement = document.createElement('div');
winMessageElement.id = 'winMessage';
winMessageElement.className = 'alert alert-success mt-3';
winMessageElement.style.display = 'none';
document.querySelector('.container').appendChild(winMessageElement);

diceElement.innerHTML = '<i class="fa fa-2xl fa-dice"></i>';

rollDiceButton.addEventListener('click', () => {
    if (gameOver) return;
    
    const rollResult = dice.roll();
    const icon = dice.getIcon(rollResult);
    diceElement.innerHTML = icon;
    
    const newPosition = currentPlayer.move(rollResult);
    
    updatePlayerPosition(currentPlayer, newPosition);
    
    if (currentPlayer.hasWon) {
        gameOver = true;
        displayWinner(currentPlayer);
        rollDiceButton.disabled = true;
        rollDiceButton.textContent = 'Game Over!';
        return;
    }
    
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    updateTurnIndicator();
});

function displayWinner(winner) {
    winMessageElement.innerHTML = `
        <h4 class="alert-heading">🎉 Congratulations! 🎉</h4>
        <p><strong>${winner.name}</strong> wins the game!</p>
        <hr>
        <p class="mb-0">Final position: ${winner.position}</p>
    `;
    winMessageElement.style.display = 'block';
    let alertClass = 'alert-success';
    if (winner.color === 'red') alertClass = 'alert-danger';
    if (winner.color === 'blue') alertClass = 'alert-primary';
    if (winner.color === 'green') alertClass = 'alert-success';
    if (winner.color === 'yellow') alertClass = 'alert-warning';
    winMessageElement.className = `alert ${alertClass} mt-3`;
}

function updateTurnIndicator() {
    const cardTitle = document.querySelector('.card-title');
    cardTitle.innerHTML = `<span style="color: ${currentPlayer.color}">${currentPlayer.name}'s Turn</span>`;
}

function updatePlayerPosition(player, position) {
    const canvas = boardPlaceholder.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const coords1 = calculateCoordinates(player1.position);
    const coords2 = calculateCoordinates(player2.position);
    
    ctx.fillStyle = player1.color;
    ctx.beginPath();
    ctx.arc(coords1.x, coords1.y, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(player1.name, coords1.x - 15, coords1.y - 20);
    
    ctx.fillStyle = player2.color;
    ctx.beginPath();
    ctx.arc(coords2.x, coords2.y, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(player2.name, coords2.x - 15, coords2.y - 20);
    
    const currentCoords = player === player1 ? coords1 : coords2;
    ctx.strokeStyle = 'gold';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(currentCoords.x, currentCoords.y, 20, 0, 2 * Math.PI);
    ctx.stroke();
}

function calculateCoordinates(position) {
    const row = Math.floor((position - 1) / 10);
    const col = (position - 1) % 10;
    
    let x;
    if (row % 2 === 0) {
        x = 50 + col * 64;
    } else {
        x = 50 + (9 - col) * 64;
    }
    
    const y = 650 - row * 64;
    return { x, y };
}

document.addEventListener('DOMContentLoaded', function() {
    updatePlayerPosition(player1, player1.position);
    updateTurnIndicator();
    
    const gameInfo = document.createElement('div');
    gameInfo.className = 'card mt-3';
    gameInfo.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">Game Info</h5>
            <p><strong>Player 1:</strong> <span style="color: ${player1.color}">${player1.color}</span></p>
            <p><strong>Player 2:</strong> <span style="color: ${player2.color}">${player2.color}</span></p>
            <p><strong>Goal:</strong> Reach position 100 to win!</p>
        </div>
    `;
    document.querySelector('.col-md-3').appendChild(gameInfo);
});