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
        const ranges = [
            [1, 15],   // B
            [16, 30],  // I
            [31, 45],  // N
            [46, 60],  // G
            [61, 75],  // O
        ];

        letters.forEach((letter, index) => {
            const [start, end] = ranges[index];
            for (let number = start; number <= end; number++) {
                this.#balls.push(new BingoBall(letter, number));
            }
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
                    isMarked: i === 2 && j === 2 // Mark the center cell as "FREE"
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
    // generate cards using loops
    for (let i = 0; i < count; i++) {
        newCards.push(new BingoCard());
    }
    return newCards;
}

function checkLuckyCards() {
    let hasWinner = false;
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

        card.luckyCard = luckyCardsCellMatches.some((luckyCard) =>
            luckyCard.every((cell) => markedCells.includes(cell))
        );

        if (card.luckyCard) {
            hasWinner = true;
        }
    });

    // Disable the "Draw" button if there is a winner
    if (hasWinner) {
        alert('We have a winner!');
        drawBtn.setAttribute('disabled', true);
    }
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
    const drawnBallsPlaceholderElem = document.getElementById('drawnBallsPlaceholder');

    // Render Bingo Cards
    cardsPlaceholderElem.innerHTML = `<div class="row">
    ${cards.map((card) => {
        const rows = card.rows;
        return `<div class="col-md-4">
        <table class="table table-bordered text-center">
          <thead class="table-primary">
            <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
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

    // Render Lucky Cards
    luckyCardsPlaceholderElem.innerHTML = luckyCards.map((luckyCard) => {
        return `<table class="table table-bordered text-center">
      <thead class="table-primary">
        <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
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

    // Render Drawn Balls (only the latest 10 balls)
    const latestBalls = nabola.slice(-10); // Get the last 10 balls
    drawnBallsPlaceholderElem.innerHTML = latestBalls.map((bola) =>
        `<span class="badge bg-primary mb-1">${bola.letter}<br>${bola.number}</span>`
    ).join('');
}

/**
 * Events
 */
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');
const tambiolaElem = document.getElementById('tambiola');
const generateCardsBtn = document.getElementById('generateCards');

numberOfCardsInput.addEventListener('change', (event) => {
    const numberOfCards = event.target.value;
    cards = generateCards(numberOfCards);
    nabola = [];
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    render();
});

rollBtn.addEventListener('click', () => {
    tambiolaElem.style.display = 'block';
    tambiolaElem.classList.add('shake');
    setTimeout(() => {
        tambiolaElem.classList.remove('shake');
    }, 500);
    tambiolo.roll();
});

drawBtn.addEventListener('click', () => {
    const drawnBall = tambiolo.draw();
    if (!drawnBall) {
        alert('No more balls to draw!');
        drawBtn.setAttribute('disabled', true);
        return;
    }

    tambiolaElem.style.display = 'block';
    tambiolaElem.textContent = `${drawnBall.letter}${drawnBall.number}`;
    tambiolaElem.classList.add('tambiola-spit');
    setTimeout(() => {
        tambiolaElem.classList.remove('tambiola-spit');
    }, 500);

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

generateCardsBtn.addEventListener('click', () => {
    const numberOfCards = numberOfCardsInput.value || 1;
    cards = generateCards(numberOfCards);
    nabola = [];
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    render();
});

render();
