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

        for (let letter in ranges) {
            const [start, end] = ranges[letter];
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

        // Free space in the middle
        this.#cells[2][2] = { value: "★", isMarked: true };
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
        [false, false, true, false, false],
        [false, false, true, false, false],
        [true, true, true, true, true],
        [false, false, true, false, false],
        [false, false, true, false, false],
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
    let winnerIndex = -1;

    cards.forEach((card, idx) => {
        let markedCells = [];
        card.rows.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.isMarked) {
                    markedCells.push(`${i}-${j}`);
                }
            });
        });
        markedCells.sort();

        card.luckyCard = luckyCardsCellMatches.some((pattern) => {
            return pattern.every((cell) => markedCells.includes(cell));
        });

        if (card.luckyCard && winnerIndex === -1) {
            winnerIndex = idx; // first winning card found
        }
    });

    return winnerIndex;
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
    
    cardsPlaceholderElem.innerHTML = `<div class="row">
        ${cards.map((card, idx) => {
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
                            ${row.map(cell => `<td class="${cell.isMarked ? 'bg-danger text-white fw-bold' : ''}">${cell.value}</td>`).join('')}
                        </tr>`;
                    }).join('')}
                    </tbody>
                    <tfoot class="${card.luckyCard ? 'table-success' : ''}">
                        <td colspan=5>${card.luckyCard ? 'Lucky Card!' : '&nbsp;'}</td>
                    </tfoot>
                </table>
                <p class="text-center mt-2 mb-2" style="color:#007bff; font-weight:bold; font-style:italic;">
                    ✨ Player Card ${idx + 1} ✨
                </p>
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
                        ${row.map(cell => `<td class="${cell ? 'bg-danger' : ''}">&nbsp;</td>`).join('')}
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
    }).join('');
    
    document.getElementById('drawnBallsPlaceholder').innerHTML = `
    <div style="display:flex; overflow-x:auto; white-space:nowrap; gap:8px; padding:5px; border:1px solid #800000; border-radius:8px; background:#fdf6f0; max-width:100%;">
        ${[...nabola].reverse().map((bola) => 
            `<span style="display:inline-block; min-width:50px; font-size:14px; padding:8px 12px; border-radius:8px; background:#800000; color:white; font-weight:bold; text-align:center;">
                ${bola.letter}<br>${bola.number}
            </span>`
        ).join('')}
    </div>
    `;
}

/**
 * Events
 */
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');
const multiDrawBtn = document.getElementById('multiDraw'); // new button

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
    const bola = tambiolo.draw();
    if (!bola) {
        alert("No more balls in the tambiolo!");
        drawBtn.setAttribute("disabled", true);
        return;
    }

    nabola.push(bola);

    // mark cards
    cards.forEach((card) => {
        card.rows.forEach((row) => {
            row.forEach((cell) => {
                if (cell.value === bola.number) {
                    cell.isMarked = true;
                }
            });
        });
    });

    // check if any card won
    const winnerIndex = checkLuckyCards();
    if (winnerIndex !== -1) {
        render();

        const winnerMessageElem = document.getElementById("winnerMessage");
        winnerMessageElem.textContent = `🎉 Congratulations! Player Card ${winnerIndex + 1} is the WINNER! 🎉`;

        const winnerModal = new bootstrap.Modal(document.getElementById("winnerModal"));
        winnerModal.show();

        drawBtn.setAttribute("disabled", true); 
        return;
    }

    render();
});

// --- New function: draw multiple times ---
function drawMultiple() {
    let count = parseInt(prompt("How many draws would you like to make?"), 10);

    if (isNaN(count) || count <= 0) {
        alert("Please enter a valid positive number.");
        return;
    }

    for (let i = 0; i < count; i++) {
        if (tambiolo.isEmpty()) {
            alert("No more balls in the tambiolo!");
            drawBtn.setAttribute("disabled", true);
            break;
        }

        const bola = tambiolo.draw();
        nabola.push(bola);

        // Mark cards
        cards.forEach((card) => {
            card.rows.forEach((row) => {
                row.forEach((cell) => {
                    if (cell.value === bola.number) {
                        cell.isMarked = true;
                    }
                });
            });
        });

        // Check winner after each draw
        const winnerIndex = checkLuckyCards();
        if (winnerIndex !== -1) {
            render();

            const winnerMessageElem = document.getElementById("winnerMessage");
            winnerMessageElem.textContent = `🎉 Congratulations! Player Card ${winnerIndex + 1} is the WINNER! 🎉`;

            const winnerModal = new bootstrap.Modal(document.getElementById("winnerModal"));
            winnerModal.show();

            drawBtn.setAttribute("disabled", true); 
            return;
        }
    }

    render();
}

multiDrawBtn.addEventListener('click', drawMultiple);

render();
