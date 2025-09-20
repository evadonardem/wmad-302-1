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
            B: [1, 15],
            I: [16, 30],
            N: [31, 45],
            G: [46, 60],
            O: [61, 75]
        };
        for (const letter in ranges) {
            const [start, end] = ranges[letter];
            for (let n = start; n <= end; n++) {
                this.#balls.push(new BingoBall(letter, n));
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
                
                if (i === 2 && j === 2) {
                    this.#cells[i].push({
                        value: 'FREE',
                        isMarked: true
                    });
                } else {
                    this.#cells[i].push({
                        value: randomCellValues.get(j)[i],
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

    markCell(letter, number) {
        
        const letterIndexMap = { B: 0, I: 1, N: 2, G: 3, O: 4 };
        const col = letterIndexMap[letter];
        for (let row = 0; row < 5; row++) {
            const cell = this.#cells[row][col];
            if (cell.value === number) {
                cell.isMarked = true;
            }
        }
    }

    
    matchesPattern(patternCells) {
        
        return patternCells.every(coord => {
            const [r, c] = coord.split('-').map(Number);
            return this.#cells[r][c].isMarked;
        });
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
    let luckyFound = false;
    cards.forEach(card => {
        card.luckyCard = false; 
        for (const pattern of luckyCardsCellMatches) {
            if (card.matchesPattern(pattern)) {
                card.luckyCard = true;
                luckyFound = true;
                break;
            }
        }
    });

    if (luckyFound) {
        
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}


function markCards(drawnBall) {
    cards.forEach(card => {
        card.markCell(drawnBall.letter, drawnBall.number);
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
                        <td colspan=5>${card.luckyCard ? '<b>Lucky Winner! PALDOO!<b>' : '&nbsp;'}</td>
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
    const numberOfCards = parseInt(event.target.value) || 1;
    cards = generateCards(numberOfCards);
    nabola = [];
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    render();
});

rollBtn.addEventListener('click', () => {
    const rollingStatusElem = document.getElementById('rollingStatus');
    rollingStatusElem.style.display = 'block';  
    setTimeout(() => {
        tambiolo.roll();  
        rollingStatusElem.style.display = 'none';  
    }, 2000);
});

drawBtn.addEventListener('click', () => {
    if (tambiolo.isEmpty()) {
        alert('No more balls to draw.');
        drawBtn.setAttribute('disabled', '');
        return;
    }
    const ball = tambiolo.draw();
    if (ball) {
        nabola.push(ball);
        markCards(ball);
        checkLuckyCards();
        render();
    } else {
        alert('No balls left to draw!');
        drawBtn.setAttribute('disabled', '');
    }
});

render();
