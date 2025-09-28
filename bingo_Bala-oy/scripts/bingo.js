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
        
        const ranges = {
            'B': [1, 15],
            'I': [16, 30],
            'N': [31, 45],
            'G': [46, 60],
            'O': [61, 75],
        };

        for (let [letter, [start, end]] of Object.entries(ranges)) {
            for (let num = start; num <= end; num++) {
                this.#balls.push(new BingoBall(letter, num));
            }
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

        // Free space in the center
        this.#cells[2][2] = {
            value: 'FREE',
            isMarked: true
        };
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
    for (let i = 0; i < count; i++) {
        newCards.push(new BingoCard());
    }
    return newCards;
}

function checkLuckyCards() {
    cards.forEach(card => {
        const markedCells = [];
        card.rows.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.isMarked) {
                    markedCells.push(`${i}-${j}`);
                }
            });
        });
        markedCells.sort();

        for (let lucky of luckyCardsCellMatches) {
            const isMatch = lucky.every(cell => markedCells.includes(cell));
            if (isMatch) {
                card.luckyCard = true;
                return;
            }
        }
        card.luckyCard = false;
    });
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
    
    cardsPlaceholderElem.innerHTML = `<div class="row">
        ${cards.map((card, index) => {
            const rows = card.rows;
            return `<div class="col-md-4">
                <table class="table table-bordered text-center">
                    <thead class="table-primary">
                        <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
                    </thead>
                    <tbody>
                    ${rows.map((row) => {
                        return `<tr>
                            ${row.map(cell => `<td class="${cell.isMarked ? 'bg-danger' : ''}">${cell.value}</td>`).join('')}
                        </tr>`;
                    }).join('')}
                    </tbody>
                    <tfoot class="${card.luckyCard ? 'table-success' : ''}">
                        <td colspan=5>${card.luckyCard ? `Lucky Card! (Card #${index+1})` : '&nbsp;'}</td>
                    </tfoot>
                </table>
            </div>`;
        }).join('')}
    </div>`;

    luckyCardsPlaceholderElem.innerHTML = luckyCards.map((luckyCard) => {
        return `<table class="table table-bordered text-center">
            <thead class="table-primary">
                <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
            </thead>
            <tbody>
                ${luckyCard.map((row) => {
                    return `<tr>
                        ${row.map(cell => `<td class="${cell ? 'bg-danger' : ''}">&nbsp;</td>`).join('')}
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
    }).join('');

    document.getElementById('drawnBallsPlaceholder').innerHTML = nabola.map((bola) => 
        `<span class="badge bg-primary mb-1">${bola.letter}<br>${bola.number}</span>`
    ).join(' ');
}

/**
 * Events
 */
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');

numberOfCardsInput.addEventListener('change', (event) => {
    const numberOfCards = event.target.value;
    cards  = generateCards(numberOfCards);
    nabola = [];
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    rollBtn.removeAttribute('disabled');
    numberOfCardsInput.removeAttribute('disabled');
    render();
});

rollBtn.addEventListener('click', () => {
    tambiolo.roll();
});

drawBtn.addEventListener('click', () => {
    const ball = tambiolo.draw();

    if (!ball) {
        alert("No more balls to draw.");
        drawBtn.setAttribute("disabled", true);
        return;
    }

    nabola.push(ball);

    const columnMap = { B: 0, I: 1, N: 2, G: 3, O: 4 };
    const colIndex = columnMap[ball.letter];

    cards.forEach(card => {
        for (let i = 0; i < 5; i++) {
            const cell = card.rows[i][colIndex];
            if (cell.value === ball.number) {
                cell.isMarked = true;
            }
        }
    });

    checkLuckyCards();
    render();

    const winnerIndex = cards.findIndex(card => card.luckyCard);
    if (winnerIndex !== -1) {
        alert(`🎉 We have a winner! Card #${winnerIndex + 1}`);
        drawBtn.setAttribute("disabled", true);
        rollBtn.setAttribute("disabled", true);
        numberOfCardsInput.setAttribute("disabled", true);
    }
});

render();