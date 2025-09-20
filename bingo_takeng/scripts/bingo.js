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
        ['B', _.range(1, 16)],  // 1-15 inclusive
        ['I', _.range(16, 31)], // 16-30 inclusive
        ['N', _.range(31, 46)], // 31-45 inclusive
        ['G', _.range(46, 61)], // 46-60 inclusive
        ['O', _.range(61, 76)], // 61-75 inclusive
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
                        value: "FREE",
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
        const columnMap = { 'B': 0, 'I': 1, 'N': 2, 'G': 3, 'O': 4 };
        const col = columnMap[letter];
        
        for (let row = 0; row < 5; row++) {
            if (this.#cells[row][col].value === number) {
                this.#cells[row][col].isMarked = true;
                return true;
            }
        }
        return false;
    }

    getMarkedCells() {
        let markedCells = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.#cells[i][j].isMarked) {
                    markedCells.push(`${i}-${j}`);
                }
            }
        }
        markedCells.sort();
        return markedCells;
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
    cards.forEach(card => {
        const markedCells = card.getMarkedCells();
        
        for (let i = 0; i < luckyCardsCellMatches.length; i++) {
            const luckyPattern = luckyCardsCellMatches[i];
            const isMatch = luckyPattern.every(cell => markedCells.includes(cell));
            
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
            return `<div class="col-md-6 col-lg-4 mb-3">
                <div class="card">
                    <div class="card-header ${card.luckyCard ? 'bg-success text-white' : 'bg-primary text-white'}">
                        <h6 class="mb-0">Card ${index + 1} ${card.luckyCard ? 'LUCKY CARD!' : ''}</h6>
                    </div>
                    <div class="card-body p-2">
                        <table class="table table-bordered text-center mb-0">
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
                                    <td class="${row[0].isMarked ? 'bg-danger text-white' : ''}" style="padding: 8px;">${row[0].value}</td>
                                    <td class="${row[1].isMarked ? 'bg-danger text-white' : ''}" style="padding: 8px;">${row[1].value}</td>
                                    <td class="${row[2].isMarked ? 'bg-danger text-white' : ''}" style="padding: 8px;">${row[2].value}</td>
                                    <td class="${row[3].isMarked ? 'bg-danger text-white' : ''}" style="padding: 8px;">${row[3].value}</td>
                                    <td class="${row[4].isMarked ? 'bg-danger text-white' : ''}" style="padding: 8px;">${row[4].value}</td>
                                </tr>`;
                            }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
        }).join('')}
    </div>`;

    luckyCardsPlaceholderElem.innerHTML = luckyCards.map((luckyCard, index) => {
        return `<div class="mb-3">
            <h6 class="text-center">Pattern ${index + 1}</h6>
            <table class="table table-bordered text-center" style="max-width: 150px; margin: 0 auto;">
                <thead class="table-primary">
                    <th style="font-size: 0.7rem; padding: 2px;">B</th>
                    <th style="font-size: 0.7rem; padding: 2px;">I</th>
                    <th style="font-size: 0.7rem; padding: 2px;">N</th>
                    <th style="font-size: 0.7rem; padding: 2px;">G</th>
                    <th style="font-size: 0.7rem; padding: 2px;">O</th>
                </thead>
                <tbody>
                    ${luckyCard.map((row) => {
                        return `<tr>
                            <td class="${row[0] ? 'bg-danger' : ''}" style="padding: 4px; font-size: 0.6rem;">&nbsp;</td>
                            <td class="${row[1] ? 'bg-danger' : ''}" style="padding: 4px; font-size: 0.6rem;">&nbsp;</td>
                            <td class="${row[2] ? 'bg-danger' : ''}" style="padding: 4px; font-size: 0.6rem;">&nbsp;</td>
                            <td class="${row[3] ? 'bg-danger' : ''}" style="padding: 4px; font-size: 0.6rem;">&nbsp;</td>
                            <td class="${row[4] ? 'bg-danger' : ''}" style="padding: 4px; font-size: 0.6rem;">&nbsp;</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
    }).join('');
    
    document.getElementById('drawnBallsPlaceholder').innerHTML = nabola.map((bola) => 
        `<span class="badge bg-primary mb-1 me-1 p-2">${bola.letter}<br>${bola.number}</span>`
    ).join(' ');

    if (tambiolo.isEmpty()) {
        document.getElementById('draw').disabled = true;
        document.getElementById('draw').textContent = 'No More Balls';
    }
}
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');

numberOfCardsInput.addEventListener('change', (event) => {
    const numberOfCards = parseInt(event.target.value) || 1;
    if (numberOfCards > 0 && numberOfCards <= 1000) {
        cards = generateCards(numberOfCards);
        nabola = [];
        tambiolo.reset();
        drawBtn.disabled = false;
        drawBtn.textContent = 'Draw';
        render();
    }
});

rollBtn.addEventListener('click', () => {
    tambiolo.roll();
});
drawBtn.addEventListener('click', () => {
    const drawnBall = tambiolo.draw();
    
    if (!drawnBall) {
        alert('No more balls to draw!');
        return;
    }
    nabola.push(drawnBall);
    
    cards.forEach(card => {
        card.markCell(drawnBall.letter, drawnBall.number);
    });
    checkLuckyCards();
    render();
 
    const luckyCardWinners = cards.filter(card => card.luckyCard);
    if (luckyCardWinners.length >= 4) {
        setTimeout(() => {
            alert(`BINGO! ${luckyCardWinners.length} card(s) matched a lucky pattern!`);
        }, 100);
    }
});

numberOfCardsInput.value = 1;
cards = generateCards(1);
render();