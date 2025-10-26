class Die {
    static sidesToIcon = {
        1: 'dice-one',
        2: 'dice-two',
        3: 'dice-three',
        4: 'dice-four',
        5: 'dice-five',
        6: 'dice-six',
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
        const iconName = Die.sidesToIcon[this.currentValue];
        return `<i class="fa fa-${iconName}"></i>`;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        const colors = ['red', 'blue', 'green', 'purple', 'pink'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.position = 0;
    }

    move(steps) {
        this.position += steps;
    }
}

const ladders = {
    7: 30, 16: 33, 20: 38, 36: 83,
    50: 68, 63: 81, 71: 89, 86: 97
};

const snakes = {
    25: 3, 42: 1, 56: 48, 61: 43,
    92: 67, 94: 12, 98: 80
};

let players = [];
let currentPlayerIndex = 0;
let gameStarted = false;

const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const dice = new Die(6);
const diceSound = document.getElementById('diceSound');

function initializeGame() {
    let numPlayers;
    while (true) {
        const input = prompt('How many players?');
        if (input === null) return;
        numPlayers = parseInt(input);
        if (numPlayers >= 2 && numPlayers <= 10) break;
        alert(' Enter number between 2 and 10.');
    }

    for (let i = 0; i < numPlayers; i++) {
        let name = prompt(`Player Name # ${i + 1}:`);
        if (!name || name.trim() === '') name = `Player ${i + 1}`;
        players.push(new Player(name.trim()));
    }

    gameStarted = true;
    drawPlayers();
    updateGameStatus();
}

function getCoordinates(position) {
    if (position === 0) return { x: -50, y: -50 };
    const row = Math.floor((position - 1) / 10);
    const col = (position - 1) % 10;
    const actualRow = 9 - row;
    const actualCol = (row % 2 === 0) ? col : (9 - col);
    return {
        x: actualCol * 74 + 40,
        y: actualRow * 74 + 40
    };
}

function drawPlayers() {
    const canvas = document.querySelector('#boardPlaceholder canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const positionGroups = {};
    players.forEach((player, index) => {
        if (!positionGroups[player.position]) {
            positionGroups[player.position] = [];
        }
        positionGroups[player.position].push({ player, index });
    });

    players.forEach((player, index) => {
        const coords = getCoordinates(player.position);
        const playersAtPosition = positionGroups[player.position];
        const playerIndexAtPosition = playersAtPosition.findIndex(p => p.index === index);

        const offsetX = (playerIndexAtPosition % 2) * 25 - 12;
        const offsetY = Math.floor(playerIndexAtPosition / 2) * 25 - 12;

        const isCurrent = index === currentPlayerIndex;
        const radius = isCurrent ? 22 : 18;

        ctx.beginPath();
        ctx.arc(coords.x + offsetX, coords.y + offsetY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.strokeStyle = isCurrent ? '#dfe61aff' : '#000';
        ctx.lineWidth = isCurrent ? 4 : 2;
        ctx.stroke();

        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(player.name.charAt(0).toUpperCase(), coords.x + offsetX, coords.y + offsetY);
    });
}

function updateGameStatus(message = '') {
    if (players.length === 0) return;
    const currentPlayer = players[currentPlayerIndex];

    let playersHtml = '<div class="mt-2"><strong>PLAYERS:</strong><br>';
    players.forEach((player, index) => {
        const isCurrentStyle = index === currentPlayerIndex ? 'font-weight: bold; font-size: 1.1em;' : '';
        playersHtml += `<span style="${isCurrentStyle}">
            <span style="display: inline-block; width: 15px; height: 15px; background-color: ${player.color}; border-radius: 50%; border: 2px solid black;"></span>
            ${player.name}: SPOT ${player.position}
            ${index === currentPlayerIndex ? '✋' : ''}
        </span><br>`;
    });
    playersHtml += '</div>';

    const statusHtml = `
        <div class="alert alert-info mb-2" style="font-size: 0.9em;">
            <strong>Current Turn:</strong> ${currentPlayer.name} 
            <span style="display: inline-block; width: 20px; height: 20px; background-color: ${currentPlayer.color}; border-radius: 50%; border: 2px solid black; vertical-align: middle;"></span>
            ${message ? `<br><small style="white-space: pre-line;">${message}</small>` : ''}
        </div>
        ${playersHtml}
    `;

    let statusElement = document.getElementById('gameStatus');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'gameStatus';
        const cardBody = document.querySelector('.card-body');
        cardBody.insertBefore(statusElement, cardBody.firstChild);
    }
    statusElement.innerHTML = statusHtml;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateDiceRoll(die, element, duration = 800, interval = 100) {
    const icons = Object.values(Die.sidesToIcon);
    diceSound.play();
    const startTime = Date.now();
    while (Date.now() - startTime < duration) {
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        element.innerHTML = `<i class="fa fa-${randomIcon}"></i>`;
        await sleep(interval);
    }
    const finalRoll = die.roll();
    element.innerHTML = die.getIcon();
    return finalRoll;
}

window.addEventListener('DOMContentLoaded', () => {
    diceElement.innerHTML = dice.getIcon();
    initializeGame();
});

rollDiceButton.addEventListener('click', async () => {
    if (!gameStarted) return;
    rollDiceButton.disabled = true;

    const currentPlayer = players[currentPlayerIndex];
    const roll = await animateDiceRoll(dice, diceElement);

    let newPosition = currentPlayer.position + roll;
    if (newPosition > 100) {
        updateGameStatus(`${currentPlayer.name} rolled ${roll}. You exceeded 100. Stay at ${currentPlayer.position}`);
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        drawPlayers();
        rollDiceButton.disabled = false;
        return;
    }

    for (let i = 0; i < roll; i++) {
        await sleep(300);
        currentPlayer.move(1);
        drawPlayers();
    }

    let message = `${currentPlayer.name} moved to ${currentPlayer.position}`;

    if (ladders[currentPlayer.position]) {
        await sleep(500);
        currentPlayer.position = ladders[currentPlayer.position];
        message += ` 🪜 Ladder! Climb to ${currentPlayer.position}`;
        drawPlayers();
    }

    if (snakes[currentPlayer.position]) {
        await sleep(500);
        currentPlayer.position = snakes[currentPlayer.position];
        message += ` 🐍 Snake! Slide to ${currentPlayer.position}`;
        drawPlayers();
    }

    if (currentPlayer.position === 100) {
        message += `\n\n🎉🎉🎉 Congratulations ${currentPlayer.name}, you win! 🎉🎉🎉`;
        gameStarted = false;
        setTimeout(() => alert(`🎉 ${currentPlayer.name} WINNER! 🎉`), 500);
    }
    const restartButton = document.getElementById('restartButton');

    restartButton.addEventListener('click', () => {
        if (confirm("Are you sure you want to restart the game?")) {
            players = [];
            currentPlayerIndex = 0;
            gameStarted = false;
            diceElement.innerHTML = dice.getIcon();
            document.getElementById('playersList').innerHTML = '';
            document.getElementById('gameStatus').innerHTML = 'Click \'Roll Dice\' to start!';
            document.getElementById('currentPlayerDisplay').textContent = '';
            const canvas = document.querySelector('#boardPlaceholder canvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            initializeGame();
        }
    });
        updateGameStatus(message);
        if (gameStarted) {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            drawPlayers();
        }
        rollDiceButton.disabled = false;
});