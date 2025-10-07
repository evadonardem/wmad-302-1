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
        const iconName = Die.sidesToIcon[this.currentValue] || 'dice'; 
        return `<i class="fa fa-${iconName}"></i>`;
    }
}

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

const leSnakesAndLadders = {
    // Snakes
    25: 3,
    42: 1,
    56: 48,
    61: 43,
    92: 67,
    94: 12,
    98: 80,

    // Ladders
    7: 30,
    16: 33,
    20: 38,
    36: 83,
    50: 68,
    63: 81,
    71: 89,
    86: 97
};


const boardSize = 740; 
const tileSize = boardSize / 10.2; 
const playerColors = ['#0079FF', '#00DFA2', '#F6FA70', '#FF0060'];
const colorName = ['BLUE', 'GREEN', 'YELLOW', 'RED'];

let game;
let canvas;
let ctx;

// tile positions
function cords(position, playerIndex = 0) {
    if (position < 1 || position > 100) return { x: -1, y: -1 };

    const index = position - 1;
    let row = Math.floor(index / 10); 
    let col = index % 10; 

    if (row % 2 !== 0) { 
        col = 9 - col;
    }

    const boardRow = 9 - row;

    let x = col * tileSize + tileSize / 2;
    let y = boardRow * tileSize + tileSize / 2;

    const offsetMap = [
        [-4.8, -4.8], 
        [ 4.8, -4.8], 
        [-4.8,  4.8], 
        [ 4.8,  4.8]  
    ];

    x += offsetMap[playerIndex][0];
    y += offsetMap[playerIndex][1];

    return { x, y };
}

function drawPlayerPiece(player, playerIndex) {
    if (player.position === 0) return; 

    const { x, y } = cords(player.position, playerIndex);
    const radius = tileSize / 6; 
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.closePath();
}

// Display player pieces
function renderElements() {
    ctx.clearRect(0, 0, boardSize, boardSize);

    game.players.forEach((player, index) => {
        drawPlayerPiece(player, index);
    });

    // Display that there is a winner and the games over
    const turnMessage = game.gameOver ? 
        `Game Over! ${colorName[game.currentPlayerIndex]} Wins!` : 
        `TURN: ${colorName[game.currentPlayerIndex]}` ;

    const titleElement = document.getElementById('dicePlaceholder').previousElementSibling;
    if (titleElement && titleElement.tagName === 'H5') {
         titleElement.innerHTML = turnMessage;
    }
}

// Game logics
class Game {
    constructor(players) {
        this.players = players.map((name, index) => new Player(name, playerColors[index]));
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
            const finalPosition = leSnakesAndLadders[this.currentPlayer.position];
            if (finalPosition) {
                this.currentPlayer.position = finalPosition;
            }
        }

        if (this.currentPlayer.position === 100) {
            this.gameOver = true;
            alert(`👏 ${colorName[game.currentPlayerIndex]} is the WINNER! 👏`);
        }
    }
}

// Prompts the user for the number of players and their names.
function generatePlayers() {
    let numberOfPlayers = 0;
    const userInput = prompt("How many players are playing? (1-4)", 1);
    numberOfPlayers = parseInt(userInput);

    if (numberOfPlayers == 1 || numberOfPlayers < 1 || numberOfPlayers > 4 || isNaN(numberOfPlayers) || userInput === null) {
         // Default to 2 players
         numberOfPlayers = 2;
    }

    alert("COLORS:\nPLAYER 1 : BLUE      🔵\nPLAYER 2 : GREEN   🟢\nPLAYER 3 : YELLOW 🟡\nPLAYER 4 : RED        🔴")
    const players = [];
    let player = '';
    for (let i = 0; i < numberOfPlayers; i++) {
        players.push(player || ` `); // Default player
    }
    return players;
}

const dice = new Die(6); 

document.addEventListener('DOMContentLoaded', () => {
    const diceElement = document.getElementById('dicePlaceholder');
    const rollDiceButton = document.getElementById('rollDiceButton');

    canvas = document.querySelector('#boardPlaceholder canvas');
    ctx = canvas.getContext('2d');

    alert("Welcome to Snakes and Ladders!");
    const players = generatePlayers();
    game = new Game(players); 

    diceElement.innerHTML = `<i class="fa fa-2xl fa-dice-one"></i>`;
    renderElements();


    rollDiceButton.addEventListener('click', () => {
        /**
         * Complete the event listener to meet the following requirements:
         * render the icon of the die in the diceElement when the button is clicked.
         * Use the getIcon method of the Die class to get the appropriate icon based on the number of sides.
         * For example, if the die has 6 sides, it should render '<i class="fa fa-dice-six"></i>'.
         */
        if (game.gameOver) {
            alert('Refresh to play again 🔄');
            return;
        }

        const rollValue = dice.roll();
        const iconHTML = dice.getIcon();
        diceElement.innerHTML = iconHTML.replace('<i class="fa fa-', '<i class="fa fa-2xl fa-'); 

        game.processMove(rollValue);

        renderElements();

        if (!game.gameOver) {
            game.nextTurn();
            renderElements();
        }
    });
});