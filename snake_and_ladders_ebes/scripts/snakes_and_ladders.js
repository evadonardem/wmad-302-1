const SNAKES_AND_LADDERS = {
    // Ladders (Go Up)
    7: 30,
    16: 33,
    20: 38,
    36: 83,
    50: 68,
    63: 81,
    71: 89,
    86: 97,
    // Snakes (Go Down)
    25: 3,
    42: 1,
    56: 48,
    61: 43,
    92: 67,
    94: 12,
    98: 80
};

class Die {

    static #sidesToIcon = {
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
        this.value = 1;
    }

    roll() {
        this.value = Math.floor(Math.random() * this.sides) + 1;
        return this.value;
    }

    getIcon() {
        const iconName = Die.#sidesToIcon[this.value] || 'dice-one';
        return `<i class="fa fa-2xl fa-${iconName}"></i>`;
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
        const colors = ['red', 'blue', 'green', 'yellow'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        this.color = colors[randomIndex];
        this.position = 0;
        this.isMoving = false;
    }

    move(steps) {

    }
}

const canvas = document.querySelector('#boardPlaceholder canvas');
const ctx = canvas.getContext('2d');
const squareSize = canvas.width / 10; 

const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const dice = new Die(6);

const players = [new Player('P1'), new Player('P2')];
let currentPlayerIndex = 0;

function getCoordsFromPosition(pos) {
    if (pos === 0) return { x: -squareSize / 2, y: canvas.height - squareSize / 2 }; 
    
    const col0 = (pos - 1) % 10;
    const row0 = Math.floor((pos - 1) / 10);
    
    let y = canvas.height - (row0 + 0.5) * squareSize;

    let x;
    if (row0 % 2 === 0) { 
        x = (col0 + 0.5) * squareSize;
    } 
    else { 
        x = canvas.width - (col0 + 0.5) * squareSize;
    }

    return { x, y };
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    players.forEach((player, index) => {
        const { x, y } = getCoordsFromPosition(player.position);
        
        const offset = (index - (players.length - 1) / 2) * (squareSize * 0.15);
        
        ctx.beginPath();
        ctx.arc(x + offset, y, squareSize * 0.15, 0, 2 * Math.PI); 
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#333';
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(index + 1, x + offset, y); 
    });
}

function animateMove(player, totalSteps) {
    player.isMoving = true;
    rollDiceButton.disabled = true; 
    
    const path = [];
    let currentPos = player.position;

    for (let i = 0; i < totalSteps; i++) {
        currentPos++;
        if (currentPos > 100) {
            currentPos = 100 - (currentPos - 100);

            for (let j = 0; j < totalSteps - (i + 1); j++) {
                 path.push(currentPos--);
            }
            break; 
        }
        path.push(currentPos);
    }

    let stepIndex = 0;

    function stepAnimation() {
        if (stepIndex < path.length) {
            player.position = path[stepIndex];
            drawBoard();
            stepIndex++;
            setTimeout(stepAnimation, 200); 
        } else {
            player.isMoving = false;
            
            if (SNAKES_AND_LADDERS.hasOwnProperty(player.position)) {
                const finalPosition = SNAKES_AND_LADDERS[player.position];
                
                if (finalPosition > player.position) {
                    alert(`${player.name} found a LADDER! Moving from ${player.position} to ${finalPosition}!`);
                } else {
                    alert(`${player.name} was bit by a SNAKE! Moving from ${player.position} to ${finalPosition}!`);
                }
                
                player.position = finalPosition;
                drawBoard();
            }

            if (player.position === 100) {
                alert(`${player.name} wins the game! 🎉`); 
                rollDiceButton.disabled = true; 
                return;
            }

            currentPlayerIndex = (currentPlayerIndex + 1) % players.length; 
            rollDiceButton.textContent = `Roll Dice - ${players[currentPlayerIndex].name}'s turn`;
            rollDiceButton.style.backgroundColor = players[currentPlayerIndex].color;
            rollDiceButton.disabled = false;
        }
    }
    
    stepAnimation();
}

rollDiceButton.addEventListener('click', () => {
    
    const currentPlayer = players[currentPlayerIndex];
    const result = dice.roll();
    
    diceElement.innerHTML = dice.getIcon();
    
    animateMove(currentPlayer, result);
    
});

drawBoard(); 
rollDiceButton.textContent = `Roll Dice - ${players[currentPlayerIndex].name}'s turn`;
rollDiceButton.style.backgroundColor = players[currentPlayerIndex].color;


