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

        // Initialize B column (1-15)
        for (let i = 1; i <= 15; i++) {
            this.#balls.push(new BingoBall('B', i));
        }

        // Initialize I column (16-30)
        for (let i = 16; i <= 30; i++) {
            this.#balls.push(new BingoBall('I', i));
        }

        // Initialize N column (31-45)
        for (let i = 31; i <= 45; i++) {
            this.#balls.push(new BingoBall('N', i));
        }

        // Initialize G column (46-60)
        for (let i = 46; i <= 60; i++) {
            this.#balls.push(new BingoBall('G', i));
        }

        // Initialize O column (61-75)
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

        /**
         * Complete this loop condition block to complete
         * random BINGO card generator.
         */
        this.#cells = [];

        for (let i = 0; i < 5; i++) {
            this.#cells[i] = [];
            for (let j = 0; j < 5; j++) {
                if (i === 2 && j=== 2) {
                    this.#cells[i].push({
                        value: "&nbsp;",
                        isMarked: true
                    });
                }
                else {
                    this.#cells[i].push({
                        value: randomCellValues.get(j).pop(),
                        isMarked: false 
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

    #winner = false;
    #winningCells = [];

    get winner() {
        return this.#winner;
    }

    get winningCells() {
        return this.#winningCells;
    }

    set winner(value) {
        this.#winner = value;
    }

    checkWinner() {
        this.#winningCells = []; 

        for (let i = 0; i < 5; i++) {
            if (this.#cells[i].every(cell => cell.isMarked)) {
                this.#winner = true;
                this.#winningCells = Array.from({length: 5}, (_, j) => `${i}-${j}`);
                return true;
            }
        }

        for (let j = 0; j < 5; j++) {
            if (this.#cells.every(row => row[j].isMarked)) {
                this.#winner = true;
                this.#winningCells = Array.from({length: 5}, (_, i) => `${i}-${j}`);
                return true;
            }
        }

        if (this.#cells.every((row, i) => row[i].isMarked)) {
            this.#winner = true;
            this.#winningCells = Array.from({length: 5}, (_, i) => `${i}-${i}`);
            return true;
        }
       
        if (this.#cells.every((row, i) => row[4 - i].isMarked)) {
            this.#winner = true;
            this.#winningCells = Array.from({length: 5}, (_, i) => `${i}-${4 - i}`);
            return true;
        }

        return false;
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
        let markedPositions = [];

        card.rows.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.isMarked) {
                    markedPositions.push(`${i}-${j}`);
                }
            });
        });

        markedPositions.sort();

        for (let template of luckyCardsCellMatches) {
            if (template.every(pos => markedPositions.includes(pos))) {
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
            return `<div class="col-md-4 mb-3">
                <h5 class="text-center">#${index + 1}</h5>
                <table class="table table-bordered text-center">
                    <thead class="table-primary">
                        <th>B</th>
                        <th>I</th>
                        <th>N</th>
                        <th>G</th>
                        <th>O</th>
                    </thead>
                    <tbody>
                    ${rows.map((row, i) => {
                        return `<tr>
                            ${row.map((cell, j) => {
                                let cellKey = `${i}-${j}`;
                                let cellClass = '';

                                if (card.winner && card.winningCells.includes(cellKey)) {
                                    cellClass = 'bg-success'; 
                                } else if (cell.isMarked) {
                                    cellClass = 'bg-danger';
                                }
                                
                                return `<td class="${cellClass}">${cell.value}</td>`;
                            }).join('')}
                        </tr>`;
                    }).join('')}
                    </tbody>
                    <tfoot class="${card.luckyCard ? 'table-success' : card.winner ? 'table-warning' : ''}">
                        <td colspan=5>
                            ${card.luckyCard ? 'Lucky Card!' : card.winner ? 'Winner!' : '&nbsp;'}
                        </td>
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
    
    document.getElementById('drawnBallsPlaceholder').innerHTML = nabola.map((bola) => `<span class="badge bg-primary mb-1">${bola.letter}<br>${bola.number}</span>`).join(' ');
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
    render();
});


rollBtn.addEventListener('click', () => {
    tambiolo.roll();
});

drawBtn.addEventListener('click', () => {
    const drawnBall = tambiolo.draw();

    if (!drawnBall) {
        alert("No balls to be drawn.");
        return;
    }
    
    nabola.push(drawnBall);

    cards.forEach((card) => {
        card.rows.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.value === drawnBall.number) {
                    cell.isMarked = true;
                }
            });
        });
        if (card.checkWinner()) {
            drawBtn.setAttribute('disabled', true);
        }
    });
    checkLuckyCards();
    render();
});

render();


