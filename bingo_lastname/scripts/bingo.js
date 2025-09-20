Try AI directly in your favorite apps … Use Gemini to generate drafts and refine content, plus get Gemini Pro with access to Google's next-gen AI for ₱1,100 ₱0 for 1 month
class BingoBall {
    constructor(letter, number) {
        this.letter = letter;
        this.number = number;
    }
}

class BingoMachine {
    #balls;

    constructor() {
        this.#initBalls();
    }
    
    #initBalls() {
        this.#balls = [];

        // Add balls for each letter with their respective ranges
        for (let i = 1; i <= 15; i++) {
            this.#balls.push(new BingoBall('B', i));
        }
        for (let i = 16; i <= 30; i++) {
            this.#balls.push(new BingoBall('I', i));
        }
        for (let i = 31; i <= 45; i++) {
            this.#balls.push(new BingoBall('N', i));
        }
        for (let i = 46; i <= 60; i++) {
            this.#balls.push(new BingoBall('G', i));
        }
        for (let i = 61; i <= 75; i++) {
            this.#balls.push(new BingoBall('O', i));
        }
    }

    isEmpty() {
        return this.#balls.length === 0;
    }

    roll() {
        this.#balls = _.shuffle(this.#balls);
    }

    draw() {
        if (this.#balls.length === 0) {
            return null;
        }

        let index = _.random(0, this.#balls.length - 1);
        return _.pullAt(this.#balls, index)[0];
    }

    reset() {
        this.#initBalls();
    }
}

class BingoCard {
    static #cellValueLookup = new Map([
        ['B', _.range(1, 15)],
        ['I', _.range(16, 30)],
        ['N', _.range(31, 45)],
        ['G', _.range(46, 60)],
        ['O', _.range(61, 75)],
    ]);

    #cells;
    #luckyCard = false;
    
    constructor() {
        this.#initCells();    
    }

    #initCells() {
        let randomCellValues = new Map([
            [0, _.sampleSize(BingoCard.#cellValueLookup.get('B'), 5)],
            [1, _.sampleSize(BingoCard.#cellValueLookup.get('I'), 5)],
            [2, _.sampleSize(BingoCard.#cellValueLookup.get('N'), 5)],
            [3, _.sampleSize(BingoCard.#cellValueLookup.get('G'), 5)],
            [4, _.sampleSize(BingoCard.#cellValueLookup.get('O'), 5)],
        ]);

        this.#cells = [];
        for (let i = 0; i < 5; i++) {
            this.#cells[i] = [];
            for (let j = 0; j < 5; j++) {
                // Assign "Free" to the center cell
                if (i === 2 && j === 2) {
                    this.#cells[i].push({
                        value: "Free",
                        isMarked: true, // Mark the "Free" cell by default
                    });
                } else {
                    this.#cells[i].push({
                        value: randomCellValues.get(j)[i],
                        isMarked: false,
                    });
                }
            }
        }
    }

    get rows() {
        return this.#cells;
    }

    set luckyCard(value) {
        this.#luckyCard = value;
    }

    get luckyCard() {
        return this.#luckyCard;
    }
}

/**
 * Lucky cards templates
 */
const luckyCards = [
    [
        [true, false, false, true, true],
        [true, false, true, false, false],
        [true, true, false, false, false],
        [true, false, true, false, false],
        [true, false, false, true, true],
    ],
    [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [true, false, false, false, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
    ],
    [
        [true, true, true, true, false],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, true, true, true, false],
        [true, false, false, false, false],
    ]
];

/**
 * Lucky cards cell matches lookup
 */
const luckyCardsCellMatches = luckyCards.map((rows) => {
    let cellMatches = [];
    rows.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell) {
                cellMatches.push(`${i}-${j}`);
            }
        });
    });
    cellMatches.sort();
    return cellMatches;
});


let cards = [];
let nabola = [];
const tambiolo = new BingoMachine();

function generateCards(count = 1) {
    let newCards = [];
    // generate cards using loops
    for (let i = 0; i < count; i++) {
        newCards.push(new BingoCard());
    }

    return newCards;
}

function checkLuckyCards() {
    
    /**
     * Complete this function to check if any
     * of the cards matches the lucky cards templates.
     */
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
    const playAgainBtn = document.getElementById('playAgain');
    const drawBtn = document.getElementById('draw');

    cardsPlaceholderElem.innerHTML = `<div class="row">
        ${cards.map((card) => {
            const rows = card.rows;
            return `<div class="col-md-4">
                <table class="table table-bordered text-center bingo-card"> <!-- Add bingo-card class -->
                    <thead class="table-primary">
                        <th>B</th>
                        <th>I</th>
                        <th>N</th>
                        <th>G</th>
                        <th>O</th>
                    </thead>
                    <tbody>
                    ${rows.map((row) => {
                        return `<tr>
                            ${row.map((cell) => {
                                return `<td class="${cell.isMarked ? 'bg-danger text-white' : ''}">
                                    ${cell.value}
                                </td>`;
                            }).join('')}
                        </tr>`;
                    }).join('')}
                    </tbody>
                    <tfoot class="${card.luckyCard ? 'table-success' : ''}">
                        <td colspan=5>${card.luckyCard ? 'Lucky Card!' : '&nbsp;'}</td>
                    </tfoot>
                </table>
            </div>`;
        }).join('')}
    </div>`;

    luckyCardsPlaceholderElem.innerHTML = luckyCards.map((luckyCard) => {
        return `<div class="mb-3">
            <table class="table table-bordered text-center bingo-card"> <!-- Add bingo-card class -->
                <tbody>
                ${luckyCard.map((row) => {
                    return `<tr>
                        ${row.map((cell) => `<td class="${cell ? 'bg-danger text-white' : ''}">&nbsp;</td>`).join('')}
                    </tr>`;
                }).join('')}
                </tbody>
            </table>
        </div>`;
    }).join('');

    document.getElementById('drawnBallsPlaceholder').innerHTML = nabola.map((bola) => `<span class="badge bg-primary mb-1">${bola.letter}<br>${bola.number}</span>`).join(' ');

    // Check if a lucky card is revealed
    const hasLuckyCard = cards.some((card) => card.luckyCard);
    if (hasLuckyCard) {
        playAgainBtn.style.display = 'block';
        drawBtn.setAttribute('disabled', 'true'); // Disable the "Draw" button
    } else {
        playAgainBtn.style.display = 'none';
        drawBtn.removeAttribute('disabled'); // Enable the "Draw" button
    }
}

/**
 * Events
 */
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');
const playAgainBtn = document.getElementById('playAgain');

numberOfCardsInput.addEventListener('change', (event) => {
    const numberOfCards = event.target.value;
    cards  = generateCards(numberOfCards);
    nabola = [];
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    render();
});


rollBtn.addEventListener('click', () => {
    tambiolo.roll();
});

let drawInterval = null; // Variable to store the interval ID

drawBtn.addEventListener('click', () => {
    // Disable the "Draw" button to prevent multiple intervals
    drawBtn.setAttribute('disabled', 'true');

    // Start automatic drawing with a 1-second interval
    drawInterval = setInterval(() => {
        // Draw a ball
        const drawnBall = tambiolo.draw();
        if (!drawnBall) {
            alert('No more balls to draw!');
            clearInterval(drawInterval); // Stop the interval if no balls are left
            return;
        }

        // Add the drawn ball to nabola
        nabola.push(drawnBall);

        // Check all cards and mark matching cells
        cards.forEach((card) => {
            card.rows.forEach((row) => {
                row.forEach((cell) => {
                    if (cell.value === drawnBall.number) {
                        cell.isMarked = true;
                    }
                });
            });

            // Check if the card is a lucky card
            const markedCells = [];
            card.rows.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    if (cell.isMarked) {
                        markedCells.push(`${rowIndex}-${colIndex}`);
                    }
                });
            });

            markedCells.sort();
            card.luckyCard = luckyCardsCellMatches.some((luckyCard) =>
                luckyCard.every((cell) => markedCells.includes(cell))
            );
        });

        // Check if a lucky card is revealed
        const hasLuckyCard = cards.some((card) => card.luckyCard);
        if (hasLuckyCard) {
            clearInterval(drawInterval); // Stop the interval
            render(); // Update the UI to show the lucky card
            return;
        }

        // Render the page after each draw
        render();
    }, 1000); // 1-second interval
});

playAgainBtn.addEventListener('click', () => {
    // Get the number of cards from the input
    const numberOfCards = numberOfCardsInput.value || 1; // Default to 1 card if no input

    // Generate a new set of cards
    cards = generateCards(numberOfCards);

    // Reset the game state
    nabola = [];
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');

    // Re-render the page with the new cards
    render();
});

render();
