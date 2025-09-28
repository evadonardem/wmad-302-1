
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
            B: _.range(1, 16),
            I: _.range(16, 31),
            N: _.range(31, 46),
            G: _.range(46, 61),
            O: _.range(61, 76),
        };


        for (const [letter, numbers] of Object.entries(ranges)) {
            numbers.forEach((num) => {
                this.#balls.push(new BingoBall(letter, num));
            });
        }
    }


    isEmpty() {
        return this.#balls.length === 0;
    }


    roll() {
        this.#balls = _.shuffle(this.#balls);
    }


    draw() {
        if (this.#balls.length === 0) return null;
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
        for (let row = 0; row < 5; row++) {
            this.#cells[row] = [];
            for (let col = 0; col < 5; col++) {
                let value = randomCellValues.get(col)[row];
                this.#cells[row][col] = {
                    value: (row === 2 && col === 2) ? 'FREE' : value,
                    isMarked: (row === 2 && col === 2) ? true : false
                };
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
    cards.forEach((card) => {
        let markedCells = [];
        card.rows.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.isMarked) {
                    markedCells.push(`${i}-${j}`);
                }
            });
        });
        markedCells.sort();
        card.luckyCard = luckyCardsCellMatches.some((template) =>
            template.every((pos) => markedCells.includes(pos))
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
                        <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
                    </thead>
                    <tbody>
                        ${rows.map((row) => `<tr>
                            ${row.map((cell) => `<td class="${cell.isMarked ? 'bg-danger' : ''}">${cell.value}</td>`).join('')}
                        </tr>`).join('')}
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
                <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
            </thead>
            <tbody>
                ${luckyCard.map((row) => `<tr>
                    ${row.map((cell) => `<td class="${cell ? 'bg-danger' : ''}">&nbsp;</td>`).join('')}
                </tr>`).join('')}
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
    const numberOfCards = parseInt(event.target.value);
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
    const ball = tambiolo.draw();
    if (!ball) return;


    nabola.push(ball);


    cards.forEach((card) => {
        card.rows.forEach((row) => {
            row.forEach((cell) => {
                if (cell.value === ball.number) {
                    cell.isMarked = true;
                }
            });
        });
    });


    checkLuckyCards();


    const hasLuckyCard = cards.some(card => card.luckyCard);
    if (hasLuckyCard) {
        drawBtn.setAttribute('disabled', true);
        alert('🎉 Bingo! A lucky card has been hit!');
    }


    render();
});


render();
