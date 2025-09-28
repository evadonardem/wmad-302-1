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

    getBallsLeft() {
        // Return a shallow copy of the balls left
        return [...this.#balls];
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
                this.#cells[i][j] = {
                    value: value,
                    isMarked: false
                };
            }
        }
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
            if (cell) cellMatches.push(`${i}-${j}`);
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
        let marked = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (card.rows[i][j].isMarked) {
                    marked.push(`${i}-${j}`);
                }
            }
        }
        marked.sort();
        let isLucky = luckyCardsCellMatches.some(template => 
            template.every(pos => marked.includes(pos))
        );
        card.luckyCard = isLucky;
    });
}

function renderGoalPatterns() {
    const goalPatternsElem = document.getElementById('goalPatternsPlaceholder');
    goalPatternsElem.innerHTML = `
        <div class="card shadow-sm mb-3">
            <div class="card-header bg-primary text-white text-center">
                <h5 class="mb-0">Goal Patterns</h5>
            </div>
            <div class="card-body p-3">
                <div class="d-flex flex-wrap justify-content-center gap-3">
                    ${luckyCards.map((luckyCard, idx) => {
                        return `<div style="min-width:120px;flex:1 1 180px;max-width:220px;">
                            <table class="table table-bordered text-center m-0 table-bingo w-100" style="display:inline-table;">
                                <thead>
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
                                            <td class="${row[0] ? 'bg-danger' : ''}">&nbsp;</td>
                                            <td class="${row[1] ? 'bg-danger' : ''}">&nbsp;</td>
                                            <td class="${row[2] ? 'bg-danger' : ''}">&nbsp;</td>
                                            <td class="${row[3] ? 'bg-danger' : ''}">&nbsp;</td>
                                            <td class="${row[4] ? 'bg-danger' : ''}">&nbsp;</td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderBallsLeft(show = ballsLeftVisible) {
    ballsLeftVisible = show; // Track the current state
    const rollBtn = document.getElementById('roll');
    let ballsLeftElem = document.getElementById('ballsLeftPlaceholder');
    if (!ballsLeftElem) {
        ballsLeftElem = document.createElement('div');
        ballsLeftElem.id = 'ballsLeftPlaceholder';
        rollBtn.parentNode.insertAdjacentElement('afterend', ballsLeftElem);
    }
    ballsLeftElem.style.display = show ? '' : 'none';

    let toggleBtn = document.getElementById('toggleBallsLeftBtn');
    if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggleBallsLeftBtn';
        toggleBtn.className = 'btn btn-outline-secondary btn-sm mb-2 mt-2';
        toggleBtn.type = 'button';
        toggleBtn.textContent = show ? 'Hide Balls Left' : 'Show Balls Left';
        ballsLeftElem.parentNode.insertBefore(toggleBtn, ballsLeftElem);
        toggleBtn.addEventListener('click', () => {
            ballsLeftVisible = !ballsLeftVisible;
            renderBallsLeft(ballsLeftVisible);
            toggleBtn.textContent = ballsLeftVisible ? 'Hide Balls Left' : 'Show Balls Left';
        });
    } else {
        toggleBtn.textContent = show ? 'Hide Balls Left' : 'Show Balls Left';
    }

    const ballsLeft = tambiolo.getBallsLeft();
    ballsLeftElem.innerHTML = `
        <div class="card shadow-sm mb-3">
            <div class="card-header bg-info text-dark">
                Balls Left <span class="badge bg-secondary">${ballsLeft.length}</span>
            </div>
            <div class="card-body p-2" style="max-height:110px;overflow:auto;">
                ${ballsLeft.map(b => `<span class="badge bg-secondary m-1">${b.letter}${b.number}</span>`).join(' ')}
            </div>
        </div>
    `;
}

function renderDrawnBalls() {
    let drawnBallsElem = document.getElementById('drawnBallsPlaceholder');
    if (!drawnBallsElem) {
        drawnBallsElem = document.createElement('div');
        drawnBallsElem.id = 'drawnBallsPlaceholder';
        const drawBtn = document.getElementById('draw');
        drawBtn.parentNode.insertAdjacentElement('afterend', drawnBallsElem);
    }
    drawnBallsElem.innerHTML = `
        <div class="card shadow-sm mb-3">
            <div class="card-header bg-success text-white">
                Drawn Balls <span class="badge bg-light text-dark">${nabola.length}</span>
            </div>
            <div class="card-body p-2" style="max-height:110px;overflow:auto;">
                ${nabola.map(b => `<span class="badge bg-primary m-1">${b.letter}${b.number}</span>`).join(' ')}
            </div>
        </div>
    `;
}

function render() {
    renderGoalPatterns();
    renderBallsLeft();
    renderDrawnBalls();

    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const hasBingo = cards.some(card => card.luckyCard);
    const drawBtn = document.getElementById('draw');
    if (drawBtn) {
        if (hasBingo || tambiolo.isEmpty()) {
            drawBtn.setAttribute('disabled', true);
        } else {
            drawBtn.removeAttribute('disabled');
        }
    }

    cardsPlaceholderElem.innerHTML = `<div class="row g-4">
        ${cards.map((card) => {
            const rows = card.rows;
            return `<div class="col-md-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body p-2">
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
                                    <td colspan=5>${card.luckyCard ? 'Lucky Card!' : '&nbsp;'}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>`;
        }).join('')}
    </div>`;
}
 /**
 * Events
 */
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');

// Add a Reset button if not present
let resetBtn = document.getElementById('reset');
if (!resetBtn) {
    resetBtn = document.createElement('button');
    resetBtn.id = 'reset';
    resetBtn.className = 'btn btn-warning ms-2';
    resetBtn.type = 'button';
    resetBtn.textContent = 'Reset';
    rollBtn.parentNode.appendChild(resetBtn);
}

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
    renderBallsLeft();
});

drawBtn.addEventListener('click', () => {
    drawBtn.setAttribute('disabled', true);

    const bola = tambiolo.draw();
    if (!bola) {
        drawBtn.setAttribute('disabled', true);
        renderBallsLeft(true); // Always show balls left after draw
        return;
    }
    nabola.push(bola);

    cards.forEach(card => {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                let cell = card.rows[i][j];
                if (cell.value === bola.number) {
                    cell.isMarked = true;
                }
            }
        }
    });

    checkLuckyCards();
    render();
    renderBallsLeft(true); // Always show balls left after draw
});

resetBtn.addEventListener('click', () => {
    const numberOfCards = numberOfCardsInput.value;
    cards  = generateCards(numberOfCards);
    nabola = [];
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    render();
});

cards = generateCards(Number(numberOfCardsInput.value) || 1);
render();
let ballsLeftVisible = true;
// END OF BINGO GAME LOGIC