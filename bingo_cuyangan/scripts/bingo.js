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
        for (let i = 1; i <= 15; i++) this.#balls.push(new BingoBall('B', i));
        for (let i = 16; i <= 30; i++) this.#balls.push(new BingoBall('I', i));
        for (let i = 31; i <= 45; i++) this.#balls.push(new BingoBall('N', i));
        for (let i = 46; i <= 60; i++) this.#balls.push(new BingoBall('G', i));
        for (let i = 61; i <= 75; i++) this.#balls.push(new BingoBall('O', i));
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
                let value = randomCellValues.get(j)[i];
                // Center cell is free
                if (i === 2 && j === 2) {
                    this.#cells[i].push({ value: "FREE", isMarked: true });
                } else {
                    this.#cells[i].push({ value: value, isMarked: false });
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
    cards.forEach(card => {
        let markedCells = [];
        card.rows.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.isMarked) markedCells.push(`${i}-${j}`);
            });
        });
        card.luckyCard = luckyCardsCellMatches.some(template =>
            template.every(pos => markedCells.includes(pos))
        );
    });
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
    
    cardsPlaceholderElem.innerHTML = `<div class="row">
    ${cards.map((card, idx) => {
        const rows = card.rows;
        return `<div class="col-md-4 mb-4">
            <div class="text-center fw-bold mb-2" style="color:#38bdf8;">Card ${idx + 1}</div>
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
                        <td class="${row[0].isMarked ? 'bg-danger' : ''}">${row[0].value === "FREE" ? '<i class="fa-solid fa-star text-warning"></i>' : row[0].value}</td>
                        <td class="${row[1].isMarked ? 'bg-danger' : ''}">${row[1].value === "FREE" ? '<i class="fa-solid fa-star text-warning"></i>' : row[1].value}</td>
                        <td class="${row[2].isMarked ? 'bg-danger' : ''}">${row[2].value === "FREE" ? '<i class="fa-solid fa-star text-warning"></i>' : row[2].value}</td>
                        <td class="${row[3].isMarked ? 'bg-danger' : ''}">${row[3].value === "FREE" ? '<i class="fa-solid fa-star text-warning"></i>' : row[3].value}</td>
                        <td class="${row[4].isMarked ? 'bg-danger' : ''}">${row[4].value === "FREE" ? '<i class="fa-solid fa-star text-warning"></i>' : row[4].value}</td>
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
    // 1. draw a ball from tambiolo
    const bola = tambiolo.draw();
    if (!bola) {
        drawBtn.setAttribute('disabled', true);
        return;
    }
    // 2. add drawn ball to nabola
    nabola.push(bola);
    // 3. mark cells in all cards
    cards.forEach(card => {
        card.rows.forEach((row, i) => {
            row.forEach((cell, j) => {
                // Mark cell if matches drawn ball
                let colLetter = ['B', 'I', 'N', 'G', 'O'][j];
                if (cell.value === bola.number && colLetter === bola.letter) {
                    cell.isMarked = true;
                }
            });
        });
    });
    // 4. check lucky cards
    checkLuckyCards();
    // 5. render the page
    render();
});