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

    getIcon() {
        const iconName = Die.#sidesToIcon[this.value];
        return `<i class="fa fa-${iconName}"></i>`;
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
        if (this.position > 100) {
            this.position = 100;
        }
    }
}


const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const dice = new Die(6);

const players = [
    new Player("Player 1"),
    new Player("Player 2")
];
let currentPlayerIndex = 0;


const snakesAndLadders = {
    // ladders
    20: 38,
    16: 33,
    7: 30,
    36: 83,
    50: 68,
    63: 81,
    71: 89,
    86: 97,
    // snakes
    25: 3,
    42: 1,
    56: 48,
    61: 43,
    92: 67,
    94: 12,
    98: 80,
};

rollDiceButton.addEventListener('click', () => {
    dice.roll();
    diceElement.innerHTML = dice.getIcon();

    const currentPlayer = players[currentPlayerIndex];
    currentPlayer.move(dice.value);


    if (snakesAndLadders[currentPlayer.position]) {
        const oldPosition = currentPlayer.position;
        currentPlayer.position = snakesAndLadders[oldPosition];

        if (currentPlayer.position > oldPosition) {
            alert(`${currentPlayer.name} climbed a ladder! 🎉`);
        } else {
            alert(`${currentPlayer.name} got bitten by a snake! 🐍`);
        }
    }

    console.log(`${currentPlayer.name} rolled ${dice.value} → position ${currentPlayer.position}`);


    const canvas = document.querySelector('#boardPlaceholder canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 74;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    players.forEach((player, index) => {
        const pos = player.position;
        if (pos > 0) {
            const row = Math.floor((pos - 1) / 10);
            const col = (row % 2 === 0)
                ? (pos - 1) % 10
                : 9 - ((pos - 1) % 10);
            const x = col * cellSize + cellSize / 2;
            const y = 740 - (row * cellSize + cellSize / 2);


            ctx.beginPath();
            ctx.arc(x, y, 25, 0, 2 * Math.PI);
            ctx.fillStyle = player.color;
            ctx.fill();

            // Label with "P1" or "P2"
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`P${index + 1}`, x, y);
        }
    });

    // 🏁 Check for win
    if (currentPlayer.position >= 100) {
        alert(`${currentPlayer.name} wins the game! 🏆`);
        players.forEach(p => p.position = 0); // reset
    } else {

        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
});
