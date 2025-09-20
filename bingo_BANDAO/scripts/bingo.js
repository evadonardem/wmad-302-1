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

    // Initialize bingo ball instances from 1 to 75
    const letters = ['B', 'I', 'N', 'G', 'O'];
    const ranges = [15, 15, 15, 15, 15]; 
    let start = 1;

    letters.forEach((letter, index) => {
        for (let i = start; i < start + ranges[index]; i++) {
            this.#balls.push(new BingoBall(letter, i));
        }
        start += ranges[index];
    });
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
            this.#cells[i].push({
                value: i === 2 && j === 2 ? "FREE" : randomCellValues.get(j)[i], 
                isMarked: i === 2 && j === 2 
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
    s
    for (let i = 0; i < count; i++) {
        newCards.push(new BingoCard());
    }

    return newCards;
}

function checkLuckyCards() {
    cards.forEach((card) => {
        const markedCells = [];

        card.rows.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.isMarked) {
                    markedCells.push(`${i}-${j}`);
                }
            });
        });

        markedCells.sort(); 

        
        card.luckyCard = luckyCardsCellMatches.some((template) =>
            template.every((cell) => markedCells.includes(cell))
        );
    });
}
function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
    
    cardsPlaceholderElem.innerHTML = `<div class="row g-3">
        ${cards.map((card, cardIndex) => {
            const rows = card.rows;
            return `<div class="col-md-4">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white text-center">
                        <strong>Bingo Card ${cardIndex + 1}</strong>
                    </div>
                    <table class="table table-bordered text-center mb-0">
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
                                ${row.map((cell) => `
                                    <td class="${cell.isMarked ? 'bg-danger text-white' : ''}">
                                        ${cell.value === "FREE" ? '<i class="fas fa-star"></i>' : cell.value}
                                    </td>
                                `).join('')}
                            </tr>`;
                        }).join('')}
                        </tbody>
                        <tfoot class="${card.luckyCard ? 'table-success' : ''}">
                            <tr>
                                <td colspan="5">${card.luckyCard ? '<i class="fas fa-trophy"></i> Lucky Card!' : '&nbsp;'}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>`;
        }).join('')}
    </div>`;

    luckyCardsPlaceholderElem.innerHTML = luckyCards.map((luckyCard, luckyCardIndex) => {
        return `<div class="card shadow-sm mb-3">
            <div class="card-header bg-success text-white text-center">
                <strong>Lucky Card ${luckyCardIndex + 1}</strong>
            </div>
            <table class="table table-bordered text-center mb-0">
                <thead class="table-success">
                    <tr>
                        <th>B</th>
                        <th>I</th>
                        <th>N</th>
                        <th>G</th>
                        <th>O</th>
                    </tr>
                </thead>
                <tbody>
                    ${luckyCard.map((row) => {
                        return `<tr>
                            ${row.map((cell) => `
                                <td class="${cell ? 'bg-danger text-white' : ''}">
                                    ${cell ? '<i class="fas fa-check"></i>' : '&nbsp;'}
                                </td>
                            `).join('')}
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
    }).join('');

    document.getElementById('drawnBallsPlaceholder').innerHTML = nabola.map((bola) => `
        <span class="badge bg-primary mb-1">
            <i class="fas fa-circle"></i> ${bola.letter}<br>${bola.number}
        </span>
    `).join(' ');
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
        alert('No more balls to draw!');
        drawBtn.setAttribute('disabled', true);
        return;
    }

    nabola.push(drawnBall); 

  
    cards.forEach((card) => {
        card.rows.forEach((row) => {
            row.forEach((cell) => {
                if (cell.value === drawnBall.number) {
                    cell.isMarked = true;
                }
            });
        });
    });

    checkLuckyCards(); 

    render(); 
});
render();