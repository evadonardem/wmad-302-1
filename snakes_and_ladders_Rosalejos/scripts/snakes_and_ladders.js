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
            const iconName = Die.sidesToIcon[this.currentValue] || 'dice'; 
            return `<i class="fa fa-${iconName}"></i>`;
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
const playerColors = ['#00f7ffff', '#00ff22ff', '#eeff00ff', '#ff0000ff'];
const colorName = ['BLUE', 'GREEN', 'YELLOW', 'RED'];

let game;
let canvas;
let ctx;

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
    const size = tileSize / 3;
    const startX = x - size / 2;
    const startY = y - size / 2;

    ctx.save();

    ctx.shadowColor = player.color;
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = player.color;
    ctx.fillRect(startX, startY, size, size);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(startX, startY, size, size);

    ctx.restore();
}

function renderElements() {
    ctx.clearRect(0, 0, boardSize, boardSize);

    game.players.forEach((player, index) => {
        drawPlayerPiece(player, index);
    });
    
    const turnMessage = game.gameOver ? 
        `Game Over! ${colorName[game.currentPlayerIndex]} Wins!` : 
        `TURN: ${colorName[game.currentPlayerIndex]}` ;

    const titleElement = document.getElementById('dicePlaceholder').previousElementSibling;
    if (titleElement && titleElement.tagName === 'H5') {
         titleElement.innerHTML = turnMessage;
    }
    updatePlayerPositions();
}

function logEvent(message, colorIndex) {
    const eventBox = document.getElementById('eventLog');
    const eventItem = document.createElement('div');
    eventItem.innerHTML = message;
    eventItem.style.color = playerColors[colorIndex];
    eventItem.style.marginBottom = '4px';
    eventBox.appendChild(eventItem);
    eventBox.scrollTop = eventBox.scrollHeight; 
}

function updatePlayerPositions() {
    const positionList = document.getElementById('playerPositions');
    positionList.innerHTML = ''; 

    game.players.forEach((player, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${colorName[index]}: ${player.position}`;
        listItem.style.color = playerColors[index];
        positionList.appendChild(listItem);
    });
}

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
            const fromPos = this.currentPlayer.position;
            const toPos = finalPosition;
            this.currentPlayer.position = finalPosition;

            const eventType = toPos > fromPos ? 'Ladder' : 'Snake';
            logEvent(`${colorName[this.currentPlayerIndex]} went from ${fromPos} ➜ ${toPos} by a ${eventType}!`, this.currentPlayerIndex);
        } else {
            logEvent(`${colorName[this.currentPlayerIndex]} moved to ${this.currentPlayer.position}.`, this.currentPlayerIndex);
        }
    }
        
        if (this.currentPlayer.position === 100) {
            this.gameOver = true;
            alert(`👏 ${colorName[game.currentPlayerIndex]} is the WINNER! 👏`);
            logEvent(`${colorName[this.currentPlayerIndex]} reached 100 and WON the game!`, this.currentPlayerIndex);
}
    }
}

function generatePlayers() {
    let numberOfPlayers = 0;
    const userInput = prompt("How many players are playing? (1-4)", 1);
    numberOfPlayers = parseInt(userInput);
    
    if (numberOfPlayers == 1 || numberOfPlayers < 1 || numberOfPlayers > 4 || isNaN(numberOfPlayers) || userInput === null) {
         numberOfPlayers = 2;
    }

    alert("COLORS:\nPLAYER 1 : BLUE      🟦\nPLAYER 2 : GREEN   🟩\nPLAYER 3 : YELLOW 🟨\nPLAYER 4 : RED        🟥")
    const players = [];
    let player = '';
    for (let i = 0; i < numberOfPlayers; i++) {
        players.push(player || ` `); 
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
        if (game.gameOver) {
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