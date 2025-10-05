class Die {

    static sidesToIcon = {
        1: 'dice-one',
        2: 'dice-two',
        3: 'dice-three',
        4: 'dice-four',
        5: 'dice-five',
        6: 'dice-six',
    };

    /**
     * Complete the Die class to meet the following requirements:
     * 
     * 1. The constructor should accept a single parameter, sides, which represents the number of sides on the die (by default 6).
     * 2. The class should have a method named roll that returns a random integer between 1 and the number of sides (inclusive).
     * 3. The class should hava a method getting icon that returns a string representing a die icon using font-awesome.
     *    - For example, if the die has 6 sides, the method should return '<i class="fa fa-dice-six"></i>'.
     *    - If the die has 4 sides, it should return '<i class="fa fa-dice-four"></i>', and so on.
     * 
     * Example usage:
     * const die = new Die(6);
     */
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
    /**
     * Complete the Player class to meet the following requirements:
     * 
     * 1. The constructor should accept a single parameter, name, which represents the player's name.
     * 2. The class should have a property named color that is initialized to a random color from the following array: ['red', 'blue', 'green', 'yellow'].
     * 2. The class should have a property named position that is initialized to 0.
     * 3. The class should have a method named move that accepts a single parameter, steps, and updates the player's position by adding the steps to the current position.
     * 
     * Example usage:
     * const player = new Player('Alice');
     */
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
    /** Game Configuration on Ladders and Snakes */
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
    92: 67,
    94: 12,
    98: 80
};

let players = [];
let currentPlayerIndex = 0;
let gameStarted = false;


const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const dice = new Die(6);

/**Initialize the game */
function initializeGame() {

    /**Prompt the user to enter how many will be playing */
    let numPlayers;
    while (true) {
        const input = prompt('How many players? (2-10)');
        if (input === null) return;
        numPlayers = parseInt(input);
        if (numPlayers >= 2 && numPlayers <= 10) 
        break;
        alert('Please enter a number between 2 and 10');
    }
/**Prompt the user to enter their names */
    for (let i = 0; i < numPlayers; i++) {
        let name = prompt(`Enter name for Player ${i + 1}:`);
        if (name === null || name.trim() === '') {
            name = `Player ${i + 1}`;
        }
        players.push(new Player(name.trim()));
    }

    gameStarted = true;
    drawPlayers();
    updateGameStatus();
}

/**Get canvas coordinates for positioning */
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

/**Draw all players on canvas */
function drawPlayers() {
    const canvas = document.querySelector('#boardPlaceholder canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Group players by position
    const positionGroups = {};
    players.forEach((player, index) => {
        if (!positionGroups[player.position]) {
            positionGroups[player.position] = [];
        }
        positionGroups[player.position].push({ player, index });
    });

    // Draw each player with offsets if multiple players are on the same position
    players.forEach((player, index) => {
        const coords = getCoordinates(player.position);
        const playersAtPosition = positionGroups[player.position];
        const playerIndexAtPosition = playersAtPosition.findIndex(p => p.index === index);

        const offsetX = (playerIndexAtPosition % 2) * 25 - 12;
        const offsetY = Math.floor(playerIndexAtPosition / 2) * 25 - 12;

        const isCurrent = index === currentPlayerIndex;
        const radius = isCurrent ? 22 : 18;

        // Draw player's chip
        ctx.beginPath();
        ctx.arc(coords.x + offsetX, coords.y + offsetY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = player.color;
        ctx.fill();

        // Highlight current player
        ctx.strokeStyle = isCurrent ? '#dfe61aff' : '#000';
        ctx.lineWidth = isCurrent ? 4 : 2;
        ctx.stroke();

        //Write player's initial
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(player.name.charAt(0).toUpperCase(), coords.x + offsetX, coords.y + offsetY);
    });
}

// Update game status display
function updateGameStatus(message = '') {
    if (players.length === 0) return;

    const currentPlayer = players[currentPlayerIndex];

    let playersHtml = '<div class="mt-2"><strong>Players:</strong><br>';
    players.forEach((player, index) => {
        const isCurrentStyle = index === currentPlayerIndex ? 'font-weight: bold; font-size: 1.1em;' : '';
        playersHtml += `<span style="${isCurrentStyle}">
            <span style="display: inline-block; width: 15px; height: 15px; background-color: ${player.color}; border-radius: 50%; border: 2px solid black;"></span>
            ${player.name}: Position ${player.position}
            ${index === currentPlayerIndex ? '👈' : ''}
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

// Sleep function for delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Make dice bigger
    diceElement.innerHTML = dice.getIcon().replace('fa-', 'fa-5x fa-');
    initializeGame();
});


rollDiceButton.addEventListener('click', async () => {
    /**
     * Complete the event listener to meet the following requirements:
     * render the icon of the die in the diceElement when the button is clicked.
     * Use the getIcon method of the Die class to get the appropriate icon based on the number of sides.
     * For example, if the die has 6 sides, it should render '<i class="fa fa-dice-six"></i>'.
     */

        if (!gameStarted) return;
        rollDiceButton.disabled = true;
        const currentPlayer = players[currentPlayerIndex];
        const roll = dice.roll();

        // Update dice display (bigger)
        diceElement.innerHTML = dice.getIcon().replace('fa-', 'fa-5x fa-');
        let newPosition = currentPlayer.position + roll;

        // Check if exceeds 100
        if (newPosition > 100) {
            updateGameStatus(`${currentPlayer.name} rolled ${roll}. You Exceeded. Stay with your Current Position ${currentPlayer.position}`);
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            drawPlayers();
            rollDiceButton.disabled = false;
            return;
        }
        // Move step by step based on dice value
        for (let i = 0; i < roll; i++) {
            await sleep(300);
            currentPlayer.move(1);
            drawPlayers();
        }
        let message = `${currentPlayer.name}  moved to ${currentPlayer.position}`;

        // Check if bottom of ladder reached (Climb up)
        if (ladders[currentPlayer.position]) {
            await sleep(500);
            const ladderTop = ladders[currentPlayer.position];
            message += ` Yay! 🪜 Ladder! Climbing up`;
            currentPlayer.position = ladderTop;
            drawPlayers();
        }
        // Check if eaten by snake (go down to the tail)
        if (snakes[currentPlayer.position]) {
            await sleep(500);
            const snakeTail = snakes[currentPlayer.position];
            message += ` 🐍 Snake! You have been eaten, go back to ${snakeTail}`;
            currentPlayer.position = snakeTail;
            drawPlayers();
        }
        // Check for the winner
        if (currentPlayer.position === 100) {
            message += `\n\n🎉🎉🎉 Congratulations ${currentPlayer.name} You Win the Game! 🎉🎉🎉`;
            gameStarted = false;
            setTimeout(() => alert(`🎉 ${currentPlayer.name} WINS! 🎉`), 500);
        }
        updateGameStatus(message);
        if (gameStarted) {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            drawPlayers();
        }
        rollDiceButton.disabled = false;
});

