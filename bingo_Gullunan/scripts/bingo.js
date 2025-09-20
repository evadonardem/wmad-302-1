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
        
        /**
         * Initialize bingo ball instances from 1 to 75.
         * Breakdown:
         *     B - 1 to 15
         *     I - 16 to 30
         *     N - 31 to 45
         *     G - 46 to 60
         *     O - 61 to 75
         */
        const letters = ['B', 'I', 'N', 'G', 'O'];
        let start = 1;
        for (let i = 0; i < letters.length; i++) {
            for (let n = start; n < start + 15; n++) {
                this.#balls.push(new BingoBall(letters[i], n));
            }
            start += 15;
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
        ['B', _.range(1, 16)],
        ['I', _.range(16, 31)],
        ['N', _.range(31, 46)],
        ['G', _.range(46, 61)],
        ['O', _.range(61, 76)],
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
                this.#cells[i].push({
                    value: randomCellValues.get(j)[i],
                    isMarked: false
                });
            }
        }
        // Free space in the middle
        this.#cells[2][2] = { value: "FREE", isMarked: true };
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
    cards.forEach((card) => {
        let matchedCells = [];
        card.rows.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.isMarked) {
                    matchedCells.push(`${i}-${j}`);
                }
            });
        });
        matchedCells.sort();

        // compare with templates
        card.luckyCard = luckyCardsCellMatches.some((template) =>
            template.every((pos) => matchedCells.includes(pos))
        );
    });
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
    
    cardsPlaceholderElem.innerHTML = `<div class="row">
        ${cards.map((card) => {
            const rows = card.rows;
            return `<div class="col-md-4">
                <table class="table table-bordered text-center">
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
                            <td class="${row[0].isMarked ? 'bg-danger' : ''}">${row[0].value}</td>
                            <td class="${row[1].isMarked ? 'bg-danger' : ''}">${row[1].value}</td>
                            <td class="${row[2].isMarked ? 'bg-danger' : ''}">${row[2].value}</td>
                            <td class="${row[3].isMarked ? 'bg-danger' : ''}">${row[3].value}</td>
                            <td class="${row[4].isMarked ? 'bg-danger' : ''}">${row[4].value}</td>
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
        return `<table class="table table-bordered text-center">
            <thead class="table-primary">
                <th>B</th>
                <th>I</th>
                <th>N</th>
                <th>G</th>
                <th>O</th>
            </thead>
            <tbody>
                ${luckyCard.map((row) => {
                    return `<tr>
                        <td class="${row[0] ? 'bg-danger' : ''}">&nbsp;</td>
                        <td class="${row[1] ? 'bg-danger' : ''}">&nbsp;</td>
                        <td class="${row[2] ? 'bg-danger' : ''}">&nbsp;</td>
                        <td class="${row[3] ? 'bg-danger' : ''}">&nbsp;</td>
                        <td class="${row[4] ? 'bg-danger' : ''}">&nbsp;</td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
    }).join('');
    
    document.getElementById('drawnBallsPlaceholder')
    .innerHTML = nabola.map((bola) => `<span class="badge bg-primary mb-1">
    ${bola.letter}<br>${bola.number}</span>`).join(' ');
}

/**
 * Events
 */
/**
 * Events
 */
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');
const playAgainBtn = document.getElementById('playAgain'); // 🔄 RESET button

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

drawBtn.addEventListener('click', () => {
    // 1. draw a ball
    let bola = tambiolo.draw();
    if (!bola) {
        alert("No more balls left!");
        return;
    }

    // 2. add drawn ball to nabola
    nabola.push(bola);

    // 3. check all cards with cells is marked
    cards.forEach((card) => {
        card.rows.forEach((row) => {
            row.forEach((cell) => {
                if (cell.value === bola.number) {
                    cell.isMarked = true;
                }
            });
        });
    });

    // 4. check lucky cards BINGO (if any)
    checkLuckyCards();

    // 5. render the page
    render();

    // Stop drawing if someone wins
    if (cards.some(card => card.luckyCard)) {
        drawBtn.setAttribute('disabled', true);
    }
});

// 🔄 RESET: Play Again button logic
playAgainBtn.addEventListener('click', () => {
    // Reset global state
    cards = [];
    nabola = [];
    tambiolo.reset();

    // Clear UI
    numberOfCardsInput.value = "";
    document.getElementById('cardsPlaceholder').innerHTML = "";
    document.getElementById('drawnBallsPlaceholder').innerHTML = "";
    document.getElementById('luckyCardsPlaceholder').innerHTML = "";

    // Enable draw again (wait for user to enter cards)
    drawBtn.setAttribute('disabled', true);
});

render();

