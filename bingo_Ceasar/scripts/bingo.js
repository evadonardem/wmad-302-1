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
        // Loop through numbers 1 to 75
        for (let num = 1; num <= 75; num++) {
            let letter = '';

            // Check the range and assign the corresponding letter
            if (num >= 1 && num <= 15) {
                letter = 'B';
            } else if (num >= 16 && num <= 30) {
                letter = 'I';
            } else if (num >= 31 && num <= 45) {
                letter = 'N';
            } else if (num >= 46 && num <= 60) {
                letter = 'G';
            } else if (num >= 61 && num <= 75) {
                letter = 'O';
            }

            // Push the ball to the array with the corresponding letter and number
            this.#balls.push(new BingoBall(letter, num));
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
        ['B', _.range(1, 16)], // Corrected range to be inclusive
        ['I', _.range(16, 31)],// Corrected range to be inclusive
        ['N', _.range(31, 46)],// Corrected range to be inclusive
        ['G', _.range(46, 61)],// Corrected range to be inclusive
        ['O', _.range(61, 76)],// Corrected range to be inclusive
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

        /**
         * Complete this loop condition block to complete
         * random BINGO card generator.
         */
        this.#cells = [];
        for (let i = 0; i < 5; i++) {
            this.#cells[i] = [];
            for (let j = 0; j < 5; j++) {
                let value = randomCellValues.get(j)[i];
                if (i === 2 && j === 2) {
                    value = "FREE";
                }
                this.#cells[i].push({
                    value: value,
                    isMarked: value === "FREE"
                });
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
    ],
    [
        [false, false, true, false, false],
        [true, true, true, true, true],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [true, false, true, false, true],
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
    let winnerFound = false;
    // Iterate through each player card
    cards.forEach(card => {
        // Skip if this card has already been marked as a winner
        if (card.luckyCard) {
            winnerFound = true;
            return;
        }

        // Iterate through each lucky card template
        luckyCards.forEach(template => {
            let isMatch = true; // Assume it's a match until proven otherwise
            // Check the card against the current template
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    // If the template requires a mark and the card's cell is not marked, it's not a match.
                    if (template[i][j] && !card.rows[i][j].isMarked) {
                        isMatch = false;
                        break; // Exit inner loop
                    }
                }
                if (!isMatch) {
                    break; // Exit outer loop
                }
            }
            // If we've checked all cells and it's still a match, we have a winner.
            if (isMatch) {
                card.luckyCard = true;
                winnerFound = true;
            }
        });
    });
    return winnerFound;
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');

    cardsPlaceholderElem.innerHTML = `<div class="row">
        ${cards.map((card) => {
        const rows = card.rows;
        return `<div class="col-md-4 mb-3">
                <table class="table table-bordered text-center">
                    <thead class="table-primary">
                        <tr>
                            <th>B</th>
                            <th>I</th>
                            <th>N</th>
                            <th>G</th>
                            <th>O</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${rows.map((row) => {
            return `<tr>
                            <td class="${row[0].isMarked ? 'bg-danger text-white' : ''}">${row[0].value}</td>
                            <td class="${row[1].isMarked ? 'bg-danger text-white' : ''}">${row[1].value}</td>
                            <td class="${row[2].isMarked ? 'bg-danger text-white' : ''}">${row[2].value}</td>
                            <td class="${row[3].isMarked ? 'bg-danger text-white' : ''}">${row[3].value}</td>
                            <td class="${row[4].isMarked ? 'bg-danger text-white' : ''}">${row[4].value}</td>
                        </tr>`;
        }).join('')}
                    </tbody>
                    <tfoot class="${card.luckyCard ? 'table-success' : ''}">
                        <tr>
                           <td colspan=5>${card.luckyCard ? 'BINGO!' : '&nbsp;'}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>`;
    }).join('')}
    </div>`;

    // Replace the luckyCardsPlaceholderElem.innerHTML assignment in render() with this:
    luckyCardsPlaceholderElem.innerHTML = luckyCards.map((luckyCard) => {
        return `<table class="table table-bordered text-center mb-0">
          <thead class="table-primary">
            <tr>   
                <th>B</th>
                <th>I</th>
                <th>N</th>
                <th>G</th>
                <th>O</th>
            </tr>
          </thead>
          <tbody>
            ${luckyCard.map((row) => `<tr>
               <td class="${row[0] ? 'bg-danger' : ''}">&nbsp;</td>
               <td class="${row[1] ? 'bg-danger' : ''}">&nbsp;</td>
               <td class="${row[2] ? 'bg-danger' : ''}">&nbsp;</td>
               <td class="${row[3] ? 'bg-danger' : ''}">&nbsp;</td>
               <td class="${row[4] ? 'bg-danger' : ''}">&nbsp;</td>
            </tr>`).join('')}
          </tbody>
        </table>`;
    }).join('');
    document.getElementById('drawnBallsPlaceholder').innerHTML = nabola.map((bola) => `<span class="badge bg-primary fs-5 m-1 p-2">${bola.letter}<br>${bola.number}</span>`).join(' ');
}

/**
 * Events
 */
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');

numberOfCardsInput.addEventListener('change', (event) => {
    const numberOfCards = event.target.value;
    cards = generateCards(numberOfCards);
    nabola = [];
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    render();
});


rollBtn.addEventListener('click', () => {
    tambiolo.roll();
});

drawBtn.addEventListener('click', () => {
    // 1. draw a ball from tambiolo
    const drawnBall = tambiolo.draw();

    if (!drawnBall) {
        alert('Game over! No more balls to draw.');
        drawBtn.setAttribute('disabled', 'disabled');
        return;
    }

    // 2. add drawn ball to nabola
    nabola.push(drawnBall);

    // 3. check all cards with cells is marked
    cards.forEach(card => {
        card.rows.forEach(row => {
            row.forEach(cell => {
                if (cell.value === drawnBall.number) {
                    cell.isMarked = true;
                }
            });
        });
    });

    // 4. check lucky cards BINGO (if any)
    const winnerExists = checkLuckyCards();

    // 5. render the page
    render();

    if (winnerExists) {
        setTimeout(() => {
        }, 100);
        drawBtn.setAttribute('disabled', 'disabled');
    } else if (tambiolo.isEmpty()) {
        setTimeout(() => {
            alert('Game Over! No more balls left in the machine.');
        }, 100);
        drawBtn.setAttribute('disabled', 'disabled');
    }
});

render();