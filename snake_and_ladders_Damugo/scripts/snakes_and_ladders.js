class Die {

    static #sidesToIcon = {
        1: 'dice-one', 2: 'dice-two', 3: 'dice-three',
        4: 'dice-four', 5: 'dice-five', 6: 'dice-six', 
    };

    /**
     * Complete the Die class to meet the following requirements:
     * * 1. The constructor should accept a single parameter, sides, which represents the number of sides on the die (by default 6).
     * 2. The class should have a method named roll that returns a random integer between 1 and the number of sides (inclusive).
     * 3. The class should hava a method getting icon that returns a string representing a die icon using font-awesome.
     *    - For example, if the die has 6 sides, the method should return '<i class="fa fa-dice-six"></i>'.
     *    - If the die has 4 sides, it should return '<i class="fa fa-dice-four"></i>', and so on.
     * * Example usage:
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
        const iconName = Die.#sidesToIcon[this.currentValue] || 'dice'; 
        return `<i class="fa fa-${iconName}"></i>`;
    }
}

//---

class Player {
    /**
     * Complete the Player class to meet the following requirements:
     * * 1. The constructor should accept a single parameter, name, which represents the player's name.
     * 2. The class should have a property named color that is initialized to a random color from the following array: ['red', 'blue', 'green', 'yellow'].
     * 2. The class should have a property named position that is initialized to 0.
     * 3. The class should have a method named move that accepts a single parameter, steps, and updates the player's position by adding the steps to the current position.
     * * Example usage:
     * const player = new Player('Alice');
     */
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.position = 0; 
    }

    move(steps) {
      
        this.position += steps; 
    }
}


/**
 * --- GAME LOGIC AND CANVAS RENDERING ---
 */


const FINAL_SL_MAP = {
    // 🪜 Ladders: Start → End
    7: 30,
    16: 33,
    20: 38,
    36: 83,
    50: 68,
    63: 81,
    71: 89,
    86: 97,

    // 🐍 Snakes: Head → Tail
    25: 3,
    42: 1,
    56: 48,
    61: 43,
    92: 67,
    94: 12,
    98: 80
};


const BOARD_SIZE = 740; 
const TILE_SIZE = BOARD_SIZE / 10; 
const PLAYER_COLORS = ['blue', 'red', 'green', 'yellow'];

let game;
let canvas;
let ctx;

/**
 * Maps a board position (1-100) to pixel coordinates (x, y) on the canvas.
 */
function getTileCoordinates(position, playerIndex = 0) {
    if (position < 1 || position > 100) return { x: -1, y: -1 };

    const index = position - 1;
    let row = Math.floor(index / 10); 
    let col = index % 10; 

    // Zig-zag logic: Odd rows go right-to-left
    if (row % 2 !== 0) { 
        col = 9 - col;
    }
    
    // Flip Y-axis: row 0 (top) is number 91-100; row 9 (bottom) is number 1-10
    const boardRow = 9 - row;

    // Base coordinates (center of the tile)
    let x = col * TILE_SIZE + TILE_SIZE / 2;
    let y = boardRow * TILE_SIZE + TILE_SIZE / 2;
    
    // Offset for multiple players on the same tile
    const offsetMap = [
        [-5, -5], // Top-left
        [ 5, -5], // Top-right
        [-5,  5], // Bottom-left
        [ 5,  5]  // Bottom-right
    ];

    x += offsetMap[playerIndex][0];
    y += offsetMap[playerIndex][1];

    return { x, y };
}

/**
 * Draws a player piece as a colored circle on the canvas.
 */
function drawPlayerPiece(player, playerIndex) {
    if (player.position === 0) return; 

    const { x, y } = getTileCoordinates(player.position, playerIndex);
    const radius = TILE_SIZE / 6; 

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    
    // Add player initial
    ctx.fillStyle = 'white';
    ctx.font = `${radius}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player.name.charAt(0).toUpperCase(), x, y);
}

/**
 * Clears the canvas and redraws all game elements (all players).
 */
function renderGame() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    // Draw all players
    game.players.forEach((player, index) => {
        drawPlayerPiece(player, index);
    });
    
    // Update turn indicator
    const turnMessage = game.gameOver ? 
        `Game Over! ${game.currentPlayer.name} Wins!` : 
        `It's ${game.currentPlayer.name}'s turn (Color: ${game.currentPlayer.color})` ;

    // Update the card title (h5 element)
    const titleElement = document.getElementById('dicePlaceholder').previousElementSibling;
    if (titleElement && titleElement.tagName === 'H5') {
         titleElement.innerHTML = turnMessage;
    }
}


class Game {
    constructor(playerNames) {
        this.players = playerNames.map((name, index) => new Player(name, PLAYER_COLORS[index]));
        this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[0];
        this.gameOver = false;
    }

    nextTurn() {
        if (this.players.length > 1) {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            this.currentPlayer = this.players[this.currentPlayerIndex];
        }
    }

    processMove(steps) {
        const previousPosition = this.currentPlayer.position;
        let newPosition = previousPosition + steps;

        
        if (newPosition > 100) {
           
            const stepsToHundred = 100 - previousPosition;
            
          
            const overshootSteps = steps - stepsToHundred; 
        
            newPosition = 100 - overshootSteps; 
        }

    
        this.currentPlayer.position = newPosition;

        if (this.currentPlayer.position !== 100) {
            const finalPosition = FINAL_SL_MAP[this.currentPlayer.position];
            if (finalPosition) {
                this.currentPlayer.position = finalPosition;
            }
        }
        
      
        if (this.currentPlayer.position === 100) {
            this.gameOver = true;
            alert(`🎉 ${this.currentPlayer.name} wins the game! 🎉`);
        }
    }
}

/**
 * Prompts the user for the number of players and their names.
 */
function initializePlayers() {
    let numPlayers = 0;
    while (numPlayers < 1 || numPlayers > 4 || isNaN(numPlayers)) {
        const input = prompt("Welcome to Snakes and Ladders!\nHow many players are playing? (1-4)", 1);
        numPlayers = parseInt(input);
        if (input === null || numPlayers < 1 || numPlayers > 4 || isNaN(numPlayers)) {
             // If user cancels or enters invalid input, default to 1 player
             numPlayers = 1;
             break;
        }
    }

    const names = [];
    for (let i = 0; i < numPlayers; i++) {
        let name = prompt(`Enter name for Player ${i + 1}:`, `Player ${i + 1}`);
        names.push(name || `Player ${i + 1}`); // Use default if prompt is cancelled/empty
    }
    return names;
}


const dice = new Die(6); 

// --- MAIN INITIALIZATION AND EVENT LISTENER ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get DOM elements
    const diceElement = document.getElementById('dicePlaceholder');
    const rollDiceButton = document.getElementById('rollDiceButton');

    // **Canvas Initialization**
    canvas = document.querySelector('#boardPlaceholder canvas');
    ctx = canvas.getContext('2d');

    // **2. Start Game: This is where the prompt will now appear reliably**
    const playerNames = initializePlayers();
    game = new Game(playerNames); 

    // Initial render of the die
    diceElement.innerHTML = `<i class="fa fa-2xl fa-dice-one"></i>`;
    renderGame();


    rollDiceButton.addEventListener('click', () => {
        /**
         * Complete the event listener to meet the following requirements:
         * render the icon of the die in the diceElement when the button is clicked.
         * Use the getIcon method of the Die class to get the appropriate icon based on the number of sides.
         * For example, if the die has 6 sides, it should render '<i class="fa fa-dice-six"></i>'.
         */
        if (game.gameOver) {
            alert('Game Over! Refresh to play again.');
            return;
        }

        // Roll the dice and display the icon
        const rollValue = dice.roll();
        const iconHTML = dice.getIcon();
        diceElement.innerHTML = iconHTML.replace('<i class="fa fa-', '<i class="fa fa-2xl fa-'); 

        // Process the player's move
        game.processMove(rollValue);

        // Redraw the board to show the new position
        renderGame();
        
        // Move to the next player's turn 
        if (!game.gameOver) {
            game.nextTurn();
            renderGame(); // Re-render to update the turn message for the next player
        }
    });
});